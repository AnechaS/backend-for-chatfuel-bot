import React, { useState, useEffect, forwardRef, useRef } from "react";
import {
  useTable,
  usePagination,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import _ from "lodash";
import clsx from "clsx";
import pagination from "../../../utils/pagination";

import EditableCell from "./EditableCell";
import RowCreate from "./RowCreate";

/**Î
 * Custrom Hook prev state
 * @param {*} value
 */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const defaultColumn = {
  Cell: EditableCell,
  minWidth: 50,
  width: 160,
};

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <label className="kt-checkbox kt-checkbox--single kt-checkbox--solid">
        <input type="checkbox" ref={resolvedRef} {...rest} />
        &nbsp;<span></span>
      </label>
    </>
  );
});

export default function Table({
  loading = false,
  columns,
  data,
  count,
  pageSize: initialPageSize = 10,
  pageIndex: initialPageIndex = 0,
  pageCount: controlledPageCount,
  showRowCreate,
  skipPageReset,
  minHeight,
  onCheckRows,
  onChangePaging,
  pageIndexOnPageSizeChange = 0,
  onChangePageSize,
  onCreate,
  onUpdate,
}) {
  const {
    headers,
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    page,
    pageCount,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
    ...rest
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
      },
      defaultColumn,
      onUpdate,
      loading,
      autoResetPage: !skipPageReset,
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useBlockLayout,
    useResizeColumns,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          width: 50,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (!loading && isFirstRender) {
      setIsFirstRender(false);
    }
  }, [loading, isFirstRender]);

  // component parent set pageIndex to 0
  const prevInitialPageIndex = usePrevious(initialPageIndex);
  useEffect(() => {
    if (
      !isFirstRender &&
      !_.isEqual(initialPageIndex, prevInitialPageIndex) &&
      initialPageIndex === 0 &&
      pageIndex !== 0
    ) {
      gotoPage(0);
    }
  }, [
    isFirstRender,
    initialPageIndex,
    prevInitialPageIndex,
    pageIndex,
    gotoPage,
  ]);

  // handle onChangePageSize
  const prevPageSize = usePrevious(pageSize);
  useEffect(() => {
    if (
      typeof onChangePageSize === "function" &&
      !_.isEqual(pageSize, prevPageSize) &&
      !isFirstRender
    ) {
      onChangePageSize(pageSize, pageIndexOnPageSizeChange);
    }
  }, [
    pageSize,
    prevPageSize,
    isFirstRender,
    onChangePageSize,
    pageIndexOnPageSizeChange,
  ]);

  // handle onChangePaging
  const prevPageIndex = usePrevious(pageIndex);
  useEffect(() => {
    if (
      typeof onChangePaging === "function" &&
      !isFirstRender &&
      !_.isEqual(pageIndex, prevPageIndex) &&
      _.isEqual(pageSize, prevPageSize)
    ) {
      onChangePaging(pageIndex);
    }
  }, [
    pageIndex,
    prevPageIndex,
    isFirstRender,
    onChangePaging,
    pageSize,
    prevPageSize,
    initialPageIndex,
    prevInitialPageIndex,
  ]);

  // handle onCheckRows
  const prevSelectdRowIds = usePrevious(selectedRowIds);
  useEffect(() => {
    if (
      typeof onCheckRows === "function" &&
      !_.isEqual(selectedRowIds, prevSelectdRowIds) &&
      !isFirstRender
    ) {
      onCheckRows(Object.keys(selectedRowIds));
    }
  }, [selectedRowIds, prevSelectdRowIds, onCheckRows, isFirstRender]);

  const start = rows.length === 0 ? 0 : Math.max(pageSize * pageIndex + 1, 1);
  const end =
    pageIndex + 1 === pageCount || rows.length === 0
      ? rows.length
      : pageSize * (pageIndex + 1);

  return (
    <div className="kt-datatable kt-datatable__table--edit kt-datatable--default kt-datatable--brand kt-datatable--loaded">
      <div
        className="kt-datatable__table kt-datatable__table--scroll"
        {...getTableProps()}
        style={{ minHeight }}
      >
        <div className="kt-datatable__head">
          <div className="kt-datatable__row">
            {headers.map((column) => {
              if (column.id === "selection") {
                return (
                  <div
                    className={
                      "kt-datatable__cell--center kt-datatable__cell kt-datatable__cell--check"
                    }
                    {...column.getHeaderProps()}
                  >
                    <span>{column.render("Header")}</span>
                  </div>
                );
              }

              return (
                <div
                  className={"kt-datatable__cell kt-datatable__cell--sort"}
                  {...column.getHeaderProps()}
                >
                  <span>
                    <div className="kt-datatable__column--name">
                      {column.render("Header")}
                    </div>
                    <div className="kt-datatable__column--type">
                      {column.type}
                    </div>
                  </span>
                  <div
                    {...column.getResizerProps()}
                    className="kt-datatable__resizer"
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Table Body */}
        <div className="kt-datatable__body" {...getTableBodyProps()}>
          {/* Row Create */}
          {showRowCreate && (
            <RowCreate columns={rest.columns} onCreate={onCreate} disabled={loading} />
          )}

          {/* Rows */}
          {page.map((row) => {
            prepareRow(row);
            return (
              <div className="kt-datatable__row" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.id === "selection") {
                    return (
                      <div
                        className="kt-datatable__cell kt-datatable__cell--center kt-datatable__cell--check"
                        {...cell.getCellProps()}
                      >
                        <span>{cell.render("Cell")}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      className={clsx("kt-datatable__cell", {
                        "kt-datatable__cell--edit": cell.column.edit,
                      })}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="kt-datatable__pager kt-datatable--paging-loaded">
        <ul className="kt-datatable__pager-nav">
          <>
            <li>
              <button
                title="First"
                className={clsx(
                  "kt-datatable__pager-link kt-datatable__pager-link--first",
                  {
                    "kt-datatable__pager-link--disabled": !canPreviousPage,
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
                    "kt-datatable__pager-link--disabled": !canPreviousPage,
                  }
                )}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <i className="flaticon2-back"></i>
              </button>
            </li>
            {pagination(pageCount, pageIndex + 1).map((val) => (
              <li key={`page-n-${val}`}>
                <button
                  className={clsx(
                    "kt-datatable__pager-link kt-datatable__pager-link-number",
                    {
                      "kt-datatable__pager-link--active": pageIndex + 1 === val,
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
        <div className="kt-datatable__pager-info">
          {loading && (
            <>
              <span
                className="spinner-border spinner-border-sm text-primary mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="kt-datatable__pager-detail mr-3">
                Loading...
              </span>
            </>
          )}
          <select
            className="form-control form-control-sm font-weight-bold mr-4 border-0 bg-light"
            value={pageSize}
            onChange={(e) => {
              gotoPage(pageIndexOnPageSizeChange);
              setPageSize(Number(e.target.value));
            }}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="kt-datatable__pager-detail">
            {`แสดงข้อมูล ${start} - ${end} ของ ${count}`}
          </span>
        </div>
      </div>
    </div>
  );
}
