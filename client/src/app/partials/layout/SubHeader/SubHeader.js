import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import objectPath from "object-path";
import { withRouter } from "react-router-dom";
import * as builder from "../../../../_metronic/ducks/builder";
import { LayoutContextConsumer } from "../../../../_metronic/layout/LayoutContext";
import { Toolbar, TableToolbar } from "./Toolbar";
import Daterangepicker from "./Daterangepicker";
import Search from "./Search";
import Button from "./Button";
import Dropdown from "./Dropdown";

const Main = ({ children, title: titleDefault, prefix }) => {
  const { subheaderMobileToggle } = useSelector((state) => ({
    subheaderMobileToggle: objectPath.get(
      state.builder.layoutConfig,
      "subheader.mobile-toggle"
    ),
  }));

  return (
    <div className="kt-subheader__main">
      {subheaderMobileToggle && (
        <button
          className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
          id="kt_subheader_mobile_toggle"
        >
          <span />
        </button>
      )}
      <LayoutContextConsumer>
        {({ subheader: { title } }) => (
          <>
            <h3 className="kt-subheader__title">
              {`${prefix || ""}${titleDefault || title}`}
            </h3>
          </>
        )}
      </LayoutContextConsumer>
      <span className="kt-subheader__separator kt-subheader__separator--v" />
      {children}
    </div>
  );
};

const Group = ({ children }) => (
  <div className="kt-subheader__group">{children}</div>
);

const Desc = ({ children }) => (
  <span className="kt-subheader__desc">{children}</span>
);

class SubHeader extends Component {
  static Main = Main;
  static Group = Group;
  static Toolbar = Toolbar;
  static TableToolbar = TableToolbar;
  static Desc = Desc;
  static Button = Button;
  static Dropdown = Dropdown;
  static Search = Search;
  static Daterangepicker = Daterangepicker;

  render() {
    const {
      subheaderCssClasses,
      subheaderContainerCssClasses,
      children,
    } = this.props;
    return (
      <div
        id="kt_subheader"
        className={`kt-subheader ${subheaderCssClasses} kt-grid__item`}
      >
        <div className={`kt-container ${subheaderContainerCssClasses}`}>
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  config: store.builder.layoutConfig,
  menuConfig: store.builder.menuConfig,
  subheaderCssClasses: builder.selectors.getClasses(store, {
    path: "subheader",
    toString: true,
  }),
  subheaderContainerCssClasses: builder.selectors.getClasses(store, {
    path: "subheader_container",
    toString: true,
  }),
});

export default withRouter(connect(mapStateToProps)(SubHeader));
