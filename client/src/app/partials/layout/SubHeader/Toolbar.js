import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { isEmpty } from "lodash";
import $ from "jquery";
import Button from "./Button";
import Dropdown from "./Dropdown";
import * as Filters from "../../../utils/Filters";
import { ReactComponent as PlusIcon } from "../../../../_metronic/layout/assets/layout-svg-icons/Plus.svg";
import { ReactComponent as UpdateIcon } from "../../../../_metronic/layout/assets/layout-svg-icons/Update.svg";
import { ReactComponent as FilterIcon } from "../../../../_metronic/layout/assets/layout-svg-icons/Filter.svg";
import { ReactComponent as WriteIcon } from "../../../../_metronic/layout/assets/layout-svg-icons/Write.svg";

// const $ = window.$;

export const Toolbar = ({ children }) => (
  <div className="kt-subheader__toolbar">
    <div className="kt-subheader__wrapper">{children}</div>
  </div>
);

let setFocus = (input) => {
  if (input !== null) {
    ReactDOM.findDOMNode(input).focus();
  }
};

function compareValue(type, value, onChangeCompareTo /* , active */) {
  switch (type) {
    case "Object":
    case "ObjectId":
    case "String":
      return (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => {
            onChangeCompareTo(e.target.value);
          }}
          ref={setFocus}
        />
      );
    case "Populate":
      return (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => {
            onChangeCompareTo(e.target.value);
          }}
          ref={setFocus}
        />
      );
    case "Boolean":
      return (
        <select
          className="form-control"
          value={value ? "True" : "False"}
          onChange={(val) => onChangeCompareTo(val === "True")}
        >
          {["True", "False"].map((v) => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </select>
      );
    case "Number":
      return (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => {
            let val = value;
            if (!e.target.value.length || e.target.value === "-") {
              val = e.target.value;
            } else if (!Number.isNaN(Number(e.target.value))) {
              val = parseFloat(e.target.value);
            }
            onChangeCompareTo(val);
          }}
        />
      );
    case "Date":
      return (
        <input
          type="date"
          className="form-control"
          value={value}
          onChange={(e) => {
            onChangeCompareTo(e.target.value);
          }}
        />
      );
    default:
      return null;
  }
}

const Filter = ({
  schema = {},
  filters: initialFilters = [],
  onFilterChange,
}) => {
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const $el = $(dropdownRef.current);
    $el.on("shown.bs.dropdown", function() {
      let newFilters = initialFilters;
      if (!initialFilters.length) {
        let available = Filters.availableFilters(schema, null);
        let field = Object.keys(available)[0];
        newFilters = [
          {
            field: field,
            constraint: available[field][0],
          },
        ];
      }

      setFilters(newFilters);
    });

    $el.on("hidden.bs.dropdown", function() {
      setFilters(initialFilters);
    });

    return () => {
      $el.dropdown("dispose");
    };
  }, [initialFilters, schema]);

  const onChangeField = useCallback(
    (index, newField) => {
      let newFilters = filters.slice();
      newFilters[index] = {
        field: newField,
        constraint: Filters.FieldConstraints[schema[newField].type][0],
        compareTo: Filters.DefaultComparisons[schema[newField].type],
      };

      setFilters(newFilters);
    },
    [filters, schema]
  );

  const onChangeConstraint = useCallback(
    (index, newConstraint) => {
      let field = filters[index].field;
      let compareType = schema[field].type;
      if (
        Object.prototype.hasOwnProperty.call(
          Filters.Constraints[newConstraint],
          "field"
        )
      ) {
        compareType = Filters.Constraints[newConstraint].field;
      }
      let newFilters = filters.slice();
      newFilters[index] = {
        field: field,
        constraint: newConstraint,
        compareTo: Filters.DefaultComparisons[compareType],
      };
      setFilters(newFilters);
    },
    [filters, schema]
  );

  const onChangeCompareTo = (index, newCompareTo) => {
    setFilters((prevState) => {
      const state = prevState.slice();
      state[index].compareTo = newCompareTo;
      return state;
    });
  };

  const onDeleteRow = (index) => {
    setFilters((prevState) => {
      const state = prevState.slice();
      state.splice(index, 1);
      return state;
    });
  };

  const addRow = useCallback(() => {
    let available = Filters.availableFilters(schema, filters);
    let field = Object.keys(available)[0];
    setFilters((prevState) => [
      ...prevState,
      {
        field,
        constraint: available[field][0],
      },
    ]);
  }, [schema, filters]);

  const clear = useCallback(() => {
    onFilterChange([]);
  }, [onFilterChange]);

  const apply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterChange(filters);
    },
    [filters, onFilterChange]
  );

  const available = Filters.availableFilters(schema, filters);
  return (
    <div
      className="dropdown dropdown-inline"
      data-toggle="kt-tooltip"
      data-placement="left"
      id="subheader-dropdown-filter"
      ref={dropdownRef}
    >
      <button
        className="btn kt-subheader__btn-secondary"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <FilterIcon className="kt-svg-icon kt-svg-icon-sm" />
        &nbsp; Filter
      </button>
      <div className="dropdown-menu" style={{ width: 555 }}>
        <form onSubmit={apply}>
          <div className="px-3">
            {filters.map((filter, i) => {
              let field = filter.field;
              let constraint = filter.constraint;
              let compareTo = filter.compareTo;

              let fields = Object.keys(available).concat([]);
              if (fields.indexOf(field) < 0) {
                fields.push(field);
              }
              fields.sort();

              let compareType = schema[field].type;
              if (
                Object.prototype.hasOwnProperty.call(
                  Filters.Constraints[constraint],
                  "field"
                )
              ) {
                compareType = Filters.Constraints[constraint].field;
              }

              let constraints = Filters.FieldConstraints[
                schema[field].type
              ].filter((c) => Filters.BLACKLISTED_FILTERS.indexOf(c) < 0);
              return (
                <div
                  key={field + "-" + constraint + "-" + i}
                  className="d-flex mb-3"
                >
                  <div className="mr-2" style={{ width: 150 }}>
                    <select
                      className="form-control"
                      value={field}
                      onChange={(e) => {
                        onChangeField(i, e.target.value);
                      }}
                    >
                      {fields.map((val) => (
                        <option value={val} key={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="mr-2"
                    style={{ width: compareType ? 175 : 325 }}
                  >
                    <select
                      className="form-control"
                      value={constraint}
                      onChange={(e) => {
                        onChangeConstraint(i, e.target.value);
                      }}
                    >
                      {constraints.map((val) => (
                        <option value={val} key={val}>
                          {Filters.Constraints[val].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!isEmpty(compareType) && (
                    <div className="mr-2" style={{ width: 150 }}>
                      {compareValue(compareType, compareTo, (newCompareTo) => {
                        onChangeCompareTo(i, newCompareTo);
                      })}
                    </div>
                  )}
                  <div
                    style={{ cursor: "pointer", margin: 8 }}
                    onClick={() => onDeleteRow(i)}
                  >
                    <i className="fa fa-minus-circle"></i>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-3 border-top">
            <div className="form-row mt-3">
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-block d-block"
                  onClick={clear}
                >
                  Clear all
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-block btn-secondary d-block"
                  onClick={addRow}
                >
                  Add filter
                </button>
              </div>
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-block btn-brand d-block"
                  onClick={apply}
                  disabled={!filters.length}
                >
                  Apply these filters
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TableToolbar = ({
  schema,
  filters,
  onAddRow,
  onRefresh,
  onFilterChange,
  onDeleteRows,
}) => {
  return (
    <Toolbar>
      <Button color="secondary" title="Add Row" onClick={onAddRow}>
        <PlusIcon className="kt-svg-icon kt-svg-icon-sm" />
        &nbsp; Add Row
      </Button>
      <Button color="secondary" title="Refresh" onClick={onRefresh}>
        <UpdateIcon className="kt-svg-icon kt-svg-icon-sm" />
        &nbsp; Refresh
      </Button>
      <Filter
        schema={schema}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <Dropdown title="Edit">
        <Dropdown.Toggle color="secondary">
          <WriteIcon className="kt-svg-icon kt-svg-icon--sm" />
          &nbsp; Edit
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "200px" }}>
          <Dropdown.Item onClick={onAddRow}>
            Add a row
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onDeleteRows}>
            Delete these rows
          </Dropdown.Item>
          <Dropdown.Item>Delete all rows</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Import data</Dropdown.Item>
          <Dropdown.Item>Export this data</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Toolbar>
  );
};
