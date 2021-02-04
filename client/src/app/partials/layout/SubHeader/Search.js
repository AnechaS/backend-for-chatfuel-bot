import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../../../../_metronic/layout/assets/layout-svg-icons/Search.svg";

export default function Search({ initialValue, showCancel, onSearch }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <form
      className="kt-margin-l-20"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        const val = e.target.search.value.trim();
        onSearch(val);
      }}
    >
      <div className="kt-input-icon kt-input-icon--right kt-input-icon--left kt-subheader__search">
        <input
          type="text"
          name="search"
          className="form-control"
          placeholder="ค้นหา..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <span className="kt-input-icon__icon kt-input-icon__icon--left">
          <span>
            <SearchIcon className="kt-svg-icon" />
          </span>
        </span>
        {(value || showCancel) && (
          <span className="kt-input-icon__icon kt-input-icon__icon--right">
            <span>
              <i
                className="flaticon2-cancel kt-icon-sm kt-font-danger"
                onClick={() => {
                  setValue("");
                  onSearch("");
                }}
              />
            </span>
          </span>
        )}
      </div>
    </form>
  );
}

Search.defaultProps = {
  onSearch: () => {},
  showCancel: false,
  initialValue: "",
};
