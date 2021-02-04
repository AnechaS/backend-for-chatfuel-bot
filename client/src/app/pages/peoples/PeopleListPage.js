import React, { Component } from "react";
import { connect } from "react-redux";
import { chunk } from "lodash";
import clsx from "clsx";
import SubHeader from "../../partials/layout/SubHeader";
import KTContent from "../../../_metronic/layout/KtContent";
import * as peoples from "../../store/ducks/peoples.duck";
import { getDocuments } from "../../crud/classes.crud";

import PeopleCard from "../../widgets/PeopleCard";
import BlockLoading from "../../partials/content/BlockLoading";

class PeopleListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingList: !props.count,
      error: false,
      page: 1,
      perPage: 32,
      pageCount: 0,
      // offset: 0,
      count: props.count,
      rows: props.rows,
      search: "",
    };

    this._isMounted = false;
    this._timeout = undefined;
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadData({ count: 1 });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadData = async (params) => {
    try {
      this.setState({
        loading: true,
        error: false,
      });

      const { perPage, page, search } = this.state;

      const query = {
        limit: perPage,
        ...(search && {
          where: JSON.stringify({
            $or: [
              {
                firstname: {
                  $regex: `.*${search}.*`,
                  $options: "i",
                },
              },
              {
                lastname: {
                  $regex: `.*${search}.*`,
                  $options: "i",
                },
              },
            ],
          }),
        }),
        ...(page > 1 && { skip: page * perPage - perPage }),
        ...params,
      };

      const { data } = await getDocuments("People", { params: query });

      // clear timeout
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = undefined;
      }

      const rows = chunk(data.results, 4);

      if (page === 1 && data.count && !search) {
        this.props.loadPeoples(rows, data.count);
      }

      if (this._isMounted) {
        this.setState((prevState) => ({
          loading: false,
          loadingList: false,
          pageCount:
            typeof data.count === "number"
              ? Math.floor(data.count / prevState.perPage)
              : prevState.pageCount,
          count: typeof data.count === "number" ? data.count : prevState.count,
          rows: prevState.page > 1 ? [...prevState.rows, ...rows] : rows,
        }));
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          loading: false,
          loadingList: false,
          error: true,
        });
      }
    }
  };

  handleMoreLoadClick = () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      () => {
        this.loadData();
      }
    );
  };

  handleCardBtnClick = (id) => {
    // do someting.
  };

  handleSearch = (value) => {
    if (value === this.state.search) {
      return;
    }

    this._timeout = setTimeout(() => {
      this.setState({ loadingList: true });
    }, 1000);

    this.setState(
      {
        page: 1,
        search: value,
      },
      () => {
        this.loadData({ count: 1 });
      }
    );
  };

  render() {
    const {
      loading,
      search,
      count,
      page,
      pageCount,
      loadingList,
      rows,
      error,
    } = this.state;

    return (
      <>
        <SubHeader>
          <SubHeader.Main>
            <SubHeader.Group>
              {(count > 0 || !loading) && (
                <SubHeader.Desc>{count} คน</SubHeader.Desc>
              )}
              <SubHeader.Search
                showCancel={search.length > 0}
                onSearch={this.handleSearch}
              />
            </SubHeader.Group>
          </SubHeader.Main>
        </SubHeader>
        <KTContent>
          <BlockLoading spinning={loadingList} error={error}>
            {rows.map((row, i) => (
              <div key={`row-${i + 1}`} className="row">
                {row.map((item) => (
                  <div key={item._id} className="col-xl-3 col-md-6">
                    <PeopleCard
                      firstname={item.firstname}
                      lastname={item.lastname}
                      gender={item.gender}
                      pic={item.pic}
                      createdAt={item.createdAt}
                      onClickBtn={this.handleCardBtnClick}
                    />
                  </div>
                ))}
              </div>
            ))}
            {!loadingList &&
              (page < pageCount || (page === pageCount && loading)) && (
                <div className="text-center">
                  <button
                    type="button"
                    className={clsx(
                      "btn btn-light btn-wide btn-pill btn-font-lg",
                      {
                        "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--brand": loading,
                      }
                    )}
                    onClick={this.handleMoreLoadClick}
                    disabled={loading}
                  >
                    โหลดข้อมูลเพิ่มเติม
                  </button>
                </div>
              )}
          </BlockLoading>
        </KTContent>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.peoples.count,
  rows: state.peoples.rows,
});

export default connect(mapStateToProps, peoples.actions)(PeopleListPage);
