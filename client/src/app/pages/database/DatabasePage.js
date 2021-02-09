import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import queryFromFilters from "../../utils/queryFromFilters";
import axios from "axios";
import { defaults } from "lodash";
import {
  getDocuments,
  createDocument,
  updateDocument,
  removeDocument,
} from "../../crud/classes.crud";
import { removeAllDocuments } from "../../crud/purge.crud";
import KTContent from "../../../_metronic/layout/KtContent";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import SubHeader from "../../partials/layout/SubHeader";
import TableEdit from "../../partials/content/TableEdit";
import ModalConfirmDeleteAllRows from "./ModalConfirmDeleteAllRows";

const buildColumns = (fields = {}, options) => {
  options = defaults(options, {
    fieldsNotAllowEdit: [],
    fieldsHidden: [],
  });
  return Object.keys(fields).map((field) => ({
    Header: field,
    accessor: field,
    type: fields[field].type,
    edit: !options.fieldsNotAllowEdit.includes(field),
    hidden: options.fieldsHidden.includes(field),
  }));
};

class DatabasePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      count: 0,
      showRowCreate: false,
      pageIndex: 0,
      pageCount: 0,
      pageSize: 10,
      filters: [],
      selectRows: [],
      skipPageReset: false,
      columns: [],
      data: [],
      showConfirmDeleteAllRows: false,
      schema: undefined,
    };

    this._cancel = () => {};

    this.loadData = this.loadData.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.createData = this.createData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.purgeData = this.purgeData.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChangePaging = this.onChangePaging.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.onCheckRows = this.onCheckRows.bind(this);
    this.onClickAddRow = this.onClickAddRow.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onDeleteAllRows = this.onDeleteAllRows.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { schemas, match } = props;
    const { schema } = state;
    if (!schema || (schema && schema.className !== match.params.className)) {
      const i = schemas.findIndex(
        ({ className }) => className === match.params.className
      );

      if (i !== -1) {
        return {
          schema: { _i: i, ...schemas[i] },
          columns: buildColumns(schemas[i].fields, {
            fieldsNotAllowEdit: ["_id", "createdAt", "updatedAt", "__v"],
            fieldsHidden: ["password"],
          }),
          count: 0,
          data: [],
          showRowCreate: false,
        };
      }
    }

    return null;
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    document.addEventListener("keydown", this.onKeyDown, false);

    if (typeof this.state.schema !== "undefined") {
      this.loadData({ count: 1 });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { schema } = this.state;

    if (
      typeof prevState.schema === "undefined" &&
      typeof schema !== "undefined"
    ) {
      this.loadData({ count: 1 });
      return;
    }

    if (
      typeof prevState.schema !== "undefined" &&
      typeof schema !== "undefined" &&
      prevState.schema.className !== schema.className
    ) {
      this._cancel();
      this.loadData({ count: 1 });
    }
  }

  componentWillUnmount() {
    this._cancel();
  }

  async loadData(params) {
    try {
      const {
        schema,
        pageSize,
        pageIndex,
        filters,
        count,
        loading,
      } = this.state;

      if (!loading) {
        this.setState({ loading: true });
      }

      const query = {
        sort: "-createdAt",
        skip: pageIndex * pageSize,
        limit: pageSize,
        ...params,
      };

      if (filters.length) {
        query.where = queryFromFilters(filters);
      }

      const { data } = await getDocuments(schema.className, {
        params: query,
        cancelToken: new axios.CancelToken((cancel) => {
          this._cancel = cancel;
        }),
      });

      const n = typeof data.count === "number" ? data.count : count;

      this.setState({
        loading: false,
        data: data.results,
        count: n,
        pageCount: Math.ceil(n / pageSize),
      });
    } catch (error) {
      // TODO handle error
      // if (axios.isCancel(error)) {
      //   console.log("Request canceled", error.message);
      // }

      this.setState({ loading: false });
    }
  }

  reloadData() {
    if (this.state.pageIndex === 0) {
      this.loadData({ count: 1 });
    }

    this.setState({
      showRowCreate: false,
      pageIndex: 0,
    });
  }

  async createData(body) {
    try {
      this.setState({ loading: true });

      const { schema, count, data } = this.state;

      const response = await createDocument(schema.className, body, {
        cancelToken: new axios.CancelToken((cancel) => {
          this._cancel = cancel;
        }),
      });

      this.setState({
        count: count + 1,
        loading: false,
        data: [response.data, ...data.slice(0, data.length - 1)],
        showRowCreate: false,
      });
    } catch (error) {
      // handle error
      // if (axios.isCancel(error)) {
      //   console.log("Request canceled", error.message);
      // }
      this.setState({ loading: false });
    }
  }

  async updateData(index, column, value) {
    const { schema, data } = this.state;

    try {
      const object = data[index];
      const newData = data.slice();
      newData[index] = { ...object, [column]: value };

      this.setState({
        loading: true,
        data: newData,
        skipPageReset: true,
      });

      /* const response = await */ updateDocument(
        schema.className,
        object._id,
        {
          [column]: value,
        },
        {
          cancelToken: new axios.CancelToken((cancel) => {
            this._cancel = cancel;
          }),
        }
      );

      this.setState({ loading: false, skipPageReset: false });
    } catch (error) {
      // handle error
      this.setState({ loading: false, data, skipPageReset: false });
    }
  }

  async deleteData() {
    const { selectRows, schema, data } = this.state;
    if (!selectRows.length) {
      return;
    }

    try {
      this.setState({ loading: true, showRowCreate: false });
      const promise = selectRows.map((index) => {
        return removeDocument(schema.className, data[index]._id);
      });

      await Promise.all(promise);
      this.loadData({ count: 1 });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  async purgeData() {
    try {
      this.setState({ loading: true, showRowCreate: false });
      const { schema } = this.state;
      await removeAllDocuments(schema.className, {
        cancelToken: new axios.CancelToken((cancel) => {
          this._cancel = cancel;
        }),
      });
      this.setState({
        loading: false,
        count: 0,
        pageIndex: 0,
        pageCount: 0,
        pageSize: 10,
        filters: [],
        selectRows: [],
        data: [],
        showConfirmDeleteAllRows: false,
      });
    } catch (error) {
      // hander error
      this.setState({ loading: false });
    }
  }

  onKeyDown(event) {
    if (event.keyCode === 27) {
      this.setState({ showRowCreate: false });
    }
  }

  onChangePaging(pageIndex) {
    this.setState(
      { pageIndex, ...(pageIndex && { showRowCreate: false }) },
      () => {
        this.loadData({ ...(!pageIndex && { count: 1 }) });
      }
    );
  }

  onChangePageSize(pageSize, pageIndex) {
    this.setState({ pageSize, pageIndex, showRowCreate: false }, () => {
      this.loadData({ count: 1 });
    });
  }

  onCheckRows(rows) {
    this.setState({ selectRows: rows, showRowCreate: false });
  }

  onClickAddRow() {
    this.setState({
      pageIndex: 0,
      showRowCreate: true,
    });
  }

  onFilterChange(filters) {
    this.setState({ filters, showRowCreate: false }, () => {
      this.loadData({ count: 1 });
    });
  }

  onDeleteAllRows() {
    this.setState({ showConfirmDeleteAllRows: true });
  }

  render() {
    const {
      schema,
      loading,
      count,
      filters,
      pageIndex,
      pageSize,
      pageCount,
      columns,
      data,
      skipPageReset,
      showRowCreate,
      showConfirmDeleteAllRows,
    } = this.state;

    const { match, schemas } = this.props;
    if (typeof match.params.className === "undefined" && schemas.length) {
      return (
        <Redirect from="/database" to={`/database/${schemas[0].className}`} />
      );
    }

    if (!schema) {
      return null;
    }

    return (
      <>
        <SubHeader>
          <SubHeader.Main prefix="Database > ">
            <SubHeader.Group>
              {(!loading || count > 0) && (
                <SubHeader.Desc>{count} Total</SubHeader.Desc>
              )}
            </SubHeader.Group>
          </SubHeader.Main>
          <SubHeader.TableToolbar
            schema={schema.fields}
            filters={filters}
            onRefresh={this.reloadData}
            onAddRow={this.onClickAddRow}
            onDeleteRows={this.deleteData}
            onFilterChange={this.onFilterChange}
            onDeleteAllRows={this.onDeleteAllRows}
          />
        </SubHeader>
        <KTContent>
          <Portlet>
            <PortletBody fit>
              <TableEdit
                columns={columns}
                count={count}
                loading={loading}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                skipPageReset={skipPageReset}
                showRowCreate={showRowCreate}
                data={data}
                minHeight={460}
                onChangePaging={this.onChangePaging}
                onChangePageSize={this.onChangePageSize}
                onCheckRows={this.onCheckRows}
                onCreate={this.createData}
                onUpdate={this.updateData}
              />
            </PortletBody>
          </Portlet>
        </KTContent>
        <ModalConfirmDeleteAllRows
          show={showConfirmDeleteAllRows}
          onHide={() => {
            this.setState({ showConfirmDeleteAllRows: false });
          }}
          modelName={schema.className}
          onConfirmed={this.purgeData}
        />
      </>
    );
  }
}

const mapStateToProps = ({ schemas }) => ({
  schemas: schemas.items,
});

export default connect(mapStateToProps)(DatabasePage);
