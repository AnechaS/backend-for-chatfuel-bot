import React, { Component } from "react";
import SubHeader from "../../partials/layout/SubHeaderDatabase";
import KTContent from "../../../_metronic/layout/KtContent";
import Table from "../../partials/content/TableEdit";
import {
  getPeople,
  deletePeople,
  updatePeople,
  createPeople
} from "../../crud/people.crud";
import queryFromFilters from "../../utils/queryFromFilters";
import { Portlet, PortletBody } from "../../partials/content/Portlet";

export default class People extends Component {
  _columns = [
    {
      Header: "_id",
      accessor: "_id",
      type: "ObjectId"
    },
    {
      Header: "firstName",
      accessor: "firstName",
      type: "String",
      edit: true
    },
    {
      Header: "lastName",
      accessor: "lastName",
      type: "String",
      edit: true
    },
    {
      Header: "gender",
      accessor: "gender",
      type: "String",
      edit: true
    },
    {
      Header: "pic",
      accessor: "pic",
      type: "String",
      edit: true
    },
    {
      Header: "province",
      accessor: "province",
      type: "String",
      edit: true
    },
    {
      Header: "district",
      accessor: "district",
      type: "String",
      edit: true
    },
    {
      Header: "dentalId",
      accessor: "dentalId",
      type: "String",
      edit: true
    },
    {
      Header: "childName",
      accessor: "childName",
      type: "String",
      edit: true
    },
    {
      Header: "childBirthday",
      accessor: "childBirthday",
      type: "String",
      edit: true
    },
    {
      Header: "createdAt",
      accessor: "createdAt",
      type: "Date"
    },
    {
      Header: "updatedAt",
      accessor: "updatedAt",
      type: "Date"
    }
  ];
  _schema = {};
  _isMounted = false;

  state = {
    isLoading: false,
    count: 0,
    data: [],
    selectRows: [],
    pageIndex: 0,
    pageCount: 0,
    pageSize: 15,
    isCreating: false,
    skipPageReset: false,
    filters: []
  };

  componentDidMount() {
    this._isMounted = true;

    this._schema = this._columns.reduce((result, column) => {
      result[column.Header] = {
        type: column.type
      };
      return result;
    }, {});

    this.fetchData({ count: 1 });

    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    this._isMounted = false;

    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  fetchData = async params => {
    try {
      this.setState({ isLoading: true });

      const { pageSize, pageIndex, filters } = this.state;

      const query = {
        sort: "-createdAt",
        skip: pageIndex * pageSize,
        limit: pageSize,
        ...params
      };

      if (filters.length) {
        query.where = queryFromFilters(filters);
      }

      const response = await getPeople(query);
      const json = response.data;
      if (this._isMounted) {
        const state = {
          data: json.results,
          isLoading: false
        };

        if (typeof json.count !== "undefined") {
          state.count = json.count;
          state.pageCount = Math.ceil(json.count / pageSize);
        }

        this.setState(state);
      }
    } catch (error) {
      // TODO handle error
      this.setState({ isLoading: false });
    }
  };

  handleCreate = async object => {
    try {
      await createPeople(object);
      await this.fetchData({ count: 1 });
      this.setState({ isCreating: false });
    } catch (error) {
      // TODO handle error create method
    }
  };

  handleUpdate = async (rowIndex, column, value) => {
    try {
      const { data } = this.state;
      if (data[rowIndex][column] === value) {
        return;
      }

      const object = data[rowIndex];
      const newData = data.slice();
      newData[rowIndex] = { ...object, [column]: value };
      this.setState({ data: newData, skipPageReset: true });
      await updatePeople(object._id, {
        [column]: value
      });
    } catch (error) {
      // TODO handle error update method
    }
  };

  handleDelete = async () => {
    try {
      const { data, selectRows } = this.state;
      if (!selectRows.length) {
        return;
      }

      const promise = selectRows.map(rowIndex =>
        deletePeople(data[rowIndex]._id)
      );
      await Promise.all(promise);
      await this.fetchData({ count: 1 });
    } catch (error) {
      // TODO handle error delete moethod
    }
  };

  handleCheckRows = rows => {
    this.setState({ selectRows: rows });
  };

  handlePagingChange = pageIndex => {
    this.setState({ pageIndex, isCreating: false }, () => {
      this.fetchData();
    });
  };

  handlePageSizeChange = value => {
    this.setState({ pageSize: value }, () => {
      this.fetchData();
    });
  };

  handleAddRow = () => {
    this.setState({ isCreating: true });
  };

  handleKeyDown = e => {
    if (e.keyCode === 27) {
      this.setState({ isCreating: false });
    }
  };

  handleRefresh = () => {
    this.setState({ isCreating: false });
    this.fetchData();
  };

  handleFilterChange = filters => {
    this.setState({ filters }, () => {
      this.fetchData({ count: 1 });
    });
  };

  render() {
    const {
      data,
      count,
      skipPageReset,
      isCreating,
      isLoading,
      pageSize,
      pageIndex,
      pageCount,
      filters
    } = this.state;
    return (
      <>
        <SubHeader
          loading={isLoading}
          count={count}
          schema={this._schema}
          filters={filters}
          onAddRow={this.handleAddRow}
          onRefresh={this.handleRefresh}
          onDeleteRows={this.handleDelete}
          onFilterChange={this.handleFilterChange}
        />
        <KTContent>
          <Portlet>
            <PortletBody fit>
              <Table
                count={count}
                pageSize={pageSize}
                pageIndex={pageIndex}
                pageCount={pageCount}
                data={data}
                columns={this._columns}
                skipPageReset={skipPageReset}
                onCheckRows={this.handleCheckRows}
                onPagingChange={this.handlePagingChange}
                onPageSizeChange={this.handlePageSizeChange}
                showRowCreate={isCreating}
                onCreate={this.handleCreate}
                onUpdate={this.handleUpdate}
                loading={isLoading}
                minHeight={680}
              />
            </PortletBody>
          </Portlet>
        </KTContent>
      </>
    );
  }
}
