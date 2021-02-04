import React from "react";
import clsx from "clsx";

function Dropdown({ children, ...rest }) {
  return (
    <div
      className="dropdown dropdown-inline"
      data-toggle="kt-tooltip"
      data-placement="left"
      {...rest}
    >
      {children}
    </div>
  );
}

Dropdown.Toggle = ({ children, color = "primary" }) => (
  <button
    className={`btn kt-subheader__btn-${color}`}
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
  >
    {children}
  </button>
);

Dropdown.Menu = ({ children, drop, style }) => (
  <div
    className={`dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-${drop ||
      "right"}`}
    style={style}
  >
    <ul className="kt-nav">{children}</ul>
  </div>
);

Dropdown.Item = ({ children, onClick, disabled = false, ...rest }) => (
  <li className="kt-nav__item">
    <button
      type="button"
      className={clsx("kt-nav__link kt-nav__link-button", { disabled })}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <span className="kt-nav__link-text">{children}</span>
    </button>
  </li>
);

Dropdown.Divider = () => <li className="kt-nav__separator"></li>;

export default Dropdown;
