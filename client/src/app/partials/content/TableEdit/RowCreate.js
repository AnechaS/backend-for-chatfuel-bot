import React, { useState } from "react";
import { Edit } from "./EditableCell";

export default function RowCreate({ columns, disabled = false, onCreate }) {
  const [data, setData] = useState({});

  return (
    <div className="kt-datatable__row">
      <div className="kt-datatable__cell--center kt-datatable__cell kt-datatable__cell--check">
        <span>
          <label className="kt-checkbox kt-checkbox--single kt-checkbox--solid kt-checkbox--disabled">
            <input type="checkbox" disabled={true} />
            &nbsp;<span></span>
          </label>
        </span>
      </div>
      {columns.map((column) => {
        return (
          <div
            className="kt-datatable__cell kt-datatable__cell--edit"
            {...column.getHeaderProps()}
          >
            <Edit
              edit={disabled === true ? false : Boolean(column.edit)}
              onBlur={(value) => {
                const body = {
                  ...data,
                  [column.id]: value,
                };
                onCreate(body);
                setData(body);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
