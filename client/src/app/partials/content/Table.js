import React, { useMemo, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination
  /* useRowSelect, */
} from "react-table";
import PropTypes from "prop-types";
import clsx from "clsx";
import pagination from "../../utils/pagination";

export const PaginTable = ({
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  pageIndex,
  pageSize,
  setPageSize,
  rowsCount,
  showTotal,
  showSizePerPage,
  perPageList,
  pageTotalRenderer
}) => {
  // total render
  const renderTotal = useCallback(() => {
    if (!showTotal) {
      return null;
    }

    // number start row of pagin
    const start = rowsCount === 0 ? 0 : Math.max(pageSize * pageIndex + 1, 1);
    // number end row of pagin
    const end =
      pageIndex + 1 === pageCount || rowsCount === 0
        ? rowsCount
        : pageSize * (pageIndex + 1);

    // custom render total
    if (pageTotalRenderer) {
      return pageTotalRenderer(start, end, rowsCount);
    }

    return (
      <span className="kt-datatable__pager-detail">
        {`Showing  ${start} - ${end} of ${rowsCount}`}
      </span>
    );
  }, [showTotal, pageSize, pageIndex, pageCount, rowsCount, pageTotalRenderer]);

  return (
    <div className="kt-datatable__pager kt-datatable--paging-loaded">
      <ul className="kt-datatable__pager-nav">
        <>
          <li>
            <button
              title="First"
              className={clsx(
                "kt-datatable__pager-link kt-datatable__pager-link--first",
                {
                  "kt-datatable__pager-link--disabled": !canPreviousPage
                }
              )}
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <i className="flaticon2-fast-back"></i>
            </button>
          </li>
          <li>
            <button
              title="Previous"
              className={clsx(
                "kt-datatable__pager-link kt-datatable__pager-link--prev",
                {
                  "kt-datatable__pager-link--disabled": !canPreviousPage
                }
              )}
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <i className="flaticon2-back"></i>
            </button>
          </li>
          {pagination(pageCount, pageIndex + 1).map(val => (
            <li key={`page-n-${val}`}>
              <button
                className={clsx(
                  "kt-datatable__pager-link kt-datatable__pager-link-number",
                  {
                    "kt-datatable__pager-link--active": pageIndex + 1 === val
                  }
                )}
                onClick={() => {
                  gotoPage(val - 1);
                }}
                title={val}
              >
                {val}
              </button>
            </li>
          ))}
          <li>
            <button
              title="Next"
              className={clsx(
                "kt-datatable__pager-link kt-datatable__pager-link--next",
                { "kt-datatable__pager-link--disabled": !canNextPage }
              )}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <i className="flaticon2-next"></i>
            </button>
          </li>
          <li>
            <button
              title="Last"
              className={clsx(
                "kt-datatable__pager-link kt-datatable__pager-link--last",
                { "kt-datatable__pager-link--disabled": !canNextPage }
              )}
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <i className="flaticon2-fast-next"></i>
            </button>
          </li>
        </>
      </ul>
      {showTotal && (
        <div className="kt-datatable__pager-info">
          {showSizePerPage && (
            <select
              className="selectpicker kt-datatable__pager-size"
              data-width="60px"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {perPageList.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}
          {showTotal && renderTotal()}
        </div>
      )}
    </div>
  );
};

PaginTable.defaultProps = {
  canPreviousPage: false,
  canNextPage: true,
  pageCount: 0,
  rowsCount: 0,
  showTotal: true,
  showSizePerPage: true,
  perPageList: [10, 20, 30, 50, 100]
};

PaginTable.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  gotoPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  rowsCount: PropTypes.number,
  showTotal: PropTypes.bool,
  showSizePerPage: PropTypes.bool,
  pageTotalRenderer: PropTypes.func,
  perPageList: PropTypes.arrayOf(PropTypes.number)
};

export default function Table({
  columns,
  data,
  sortable,
  pagination,
  height,
  maxHeight,
  loading
}) {
  const initialState = useMemo(() => {
    const object = {};

    if (typeof pagination.pageSize !== "undefined") {
      object.pageSize = pagination.pageSize;
    }

    if (typeof pagination.pageIndex !== "undefined") {
      object.pageSize = pagination.pageIndex;
    }

    return object;
  }, [pagination]);

  const instance = useTable(
    {
      data: data,
      columns,
      initialState
    },
    useSortBy,
    usePagination
  );

  // props table
  const tableProps = useCallback(
    (props /* , { column } */) => {
      // styles table
      props.style = {
        display: "block"
      };
      // max height table
      if (maxHeight) {
        props.style = {
          ...props.style,
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight
        };
      }
      // height table
      if (height) {
        props.style = {
          ...props.style,
          height: typeof height === "number" ? `${height}px` : height
        };
      }

      return props;
    },
    [maxHeight, height]
  );

  // props header table
  const headerProps = useCallback(
    (props, { column }) => {
      // if prop sortable equal true
      if (sortable) {
        props = { ...props, ...column.getSortByToggleProps() };
      }

      return props;
    },
    [sortable]
  );

  // rows datatable
  const rows =
    typeof pagination !== "undefined" ? instance.page : instance.rows;

  return (
    <div
      className={clsx(
        "kt-datatable kt-datatable--default kt-datatable--brand kt-datatable--loaded"
      )}
    >
      <table
        className="kt-datatable__table kt-datatable__table--scroll-x"
        {...instance.getTableProps(tableProps)}
      >
        <thead className="kt-datatable__head">
          <tr className="kt-datatable__row">
            {instance.headers.map(column => {
              return (
                <th
                  className={clsx("kt-datatable__cell", {
                    "kt-datatable__cell--sort": Boolean(
                      column.sortable || true
                    ),
                    "kt-datatable__cell--sorted": column.isSorted
                  })}
                  {...column.getHeaderProps(headerProps)}
                >
                  <span style={{ width: column.width }}>
                    {column.render("Header")}
                    {column.isSorted && (
                      <i
                        className={clsx({
                          "flaticon2-arrow-down": column.isSortedDesc,
                          "flaticon2-arrow-up": !column.isSortedDesc
                        })}
                      ></i>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="kt-datatable__body" {...instance.getTableBodyProps()}>
          {Boolean(data.length) &&
            rows.map((row, i) => {
              instance.prepareRow(row);
              return (
                <tr className="kt-datatable__row" {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        className="kt-datatable__cell"
                        {...cell.getCellProps()}
                      >
                        <span
                          style={{
                            width: cell.column.width,
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          {!cell.column.hasOwnProperty("template")
                            ? cell.render("Cell")
                            : cell.column.template(cell, i)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

          {/* data empty */}
          {Boolean(!loading && !data.length) && (
            <tr
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "30px"
              }}
            >
              <td>
                <span>No data to display</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {Boolean(!loading && pagination) && (
        <PaginTable
          canPreviousPage={instance.canPreviousPage}
          canNextPage={instance.canNextPage}
          pageCount={instance.pageCount}
          gotoPage={instance.gotoPage}
          nextPage={instance.nextPage}
          previousPage={instance.previousPage}
          setPageSize={instance.setPageSize}
          pageIndex={instance.state.pageIndex}
          pageSize={instance.state.pageSize}
          rowsCount={instance.rows.length}
          showTotal={pagination.showTotal}
          showSizePerPage={pagination.showSizePerPage}
          pageTotalRenderer={pagination.pageTotalRenderer}
        />
      )}
    </div>
  );
}

Table.defaultProps = {
  columns: [],
  data: [],
  initialState: {},
  pagination: {
    display: false
  },
  sortable: false,
  loading: false
};

Table.propTypes = {
  column: PropTypes.array,
  data: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pagination: PropTypes.shape({
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    showTotal: PropTypes.bool,
    pageTotalRenderer: PropTypes.func,
    sizePerPage: PropTypes.number,
    showSizePerPage: PropTypes.bool,
    sizePerPageList: PropTypes.arrayOf(PropTypes.number)
  }),
  sortable: PropTypes.bool,
  loading: PropTypes.bool
};
