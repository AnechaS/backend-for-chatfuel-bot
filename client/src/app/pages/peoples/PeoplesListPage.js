import React, { Component } from "react";
import _, { isEqual, chunk } from "lodash";
import clsx from "clsx";
import SubHeader from "../../partials/layout/SubHeader";
import FilterPeopleDropdown from "../../partials/content/CustomDropdowns/FilterPeopleDropdown";
import KTContent from "../../../_metronic/layout/KtContent";
import { ProfileCard } from "../../widgets/general/ProfileCard";

export default class PeoplesListPage extends Component {
  columnCount = 4;
  state = {
    rows: []
  };

  componentDidMount() {
    const { items } = this.props;
    if (items.length) {
      this.setState({ rows: chunk(items, this.columnCount) });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { items } = this.props;
    if (!isEqual(nextProps.items, items)) {
      this.setState({ rows: chunk(nextProps.items, this.columnCount) });
    }
  }

  handleLoadMore = () => {
    const { loadMore, pagin } = this.props;
    loadMore(pagin + 1);
  };

  handleSearchChange = value => {
    const { setSearch } = this.props;
    setSearch(value);
  };

  handleFilterChange = filters => {
    const { setFilters, clearFilters } = this.props;
    if (Object.keys(filters).length) {
      setFilters(filters);
      return;
    }

    clearFilters();
  };

  renderList = () => {
    const { rows } = this.state;
    const { listLoading } = this.props;

    if (listLoading) {
      return _.chunk(Array.from(Array(8).keys()), 4).map((cols, i) => (
        <div className="row" key={`row-${i + 1}`}>
          {cols.map(col => (
            <div
              className="col-xl-3 col-md-6"
              key={`column-${(col + 1).toString()}`}
            >
              <ProfileCard showActions loading />
            </div>
          ))}
        </div>
      ));
    }

    return (
      <>
        {rows.map((row, i) => (
          <div key={`row-${i + 1}`} className="row">
            {row.map(item => (
              <div key={item._id} className="col-xl-3 col-md-6">
                <ProfileCard showActions data={item} />
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  render() {
    const { loading, count, filters, pagin, search } = this.props;
    return (
      <>
        <SubHeader>
          <SubHeader.Main>
            <SubHeader.Group>
              {(count > 0 || !loading) && (
                <SubHeader.Desc>{count} Total</SubHeader.Desc>
              )}
              <SubHeader.Search
                initialValue={search}
                onSubmit={this.handleSearchChange}
              />
              <FilterPeopleDropdown
                onFilterChange={this.handleFilterChange}
                filters={filters}
              />
            </SubHeader.Group>
          </SubHeader.Main>
        </SubHeader>
        <KTContent>
          {this.renderList()}
          {pagin.offset + pagin.perPage < count && (
            <div className="text-center">
              <button
                type="button"
                className={clsx("btn btn-light btn-wide btn-pill btn-font-lg", {
                  "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--brand":
                    loading && pagin.page
                })}
                onClick={this.handleLoadMore}
                disabled={loading && pagin.page}
              >
                โหลดข้อมูลเพิ่มเติม
              </button>
            </div>
          )}
        </KTContent>
      </>
    );
  }
}
