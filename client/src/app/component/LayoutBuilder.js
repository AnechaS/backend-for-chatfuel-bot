import React, { useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { get, merge } from "lodash";
import { Switch } from "@material-ui/core";
import clsx from "clsx";
import { metronic, initLayoutConfig, LayoutConfig } from "../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader
} from "../partials/content/Portlet";

export default function LayoutBuilder() {
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: "3.5rem" });
  };
  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: "3.5rem" });
  };
  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const initialValues = useMemo(
    () =>
      merge(
        // Fulfill changeable fields.
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <>
            <Portlet>
              <PortletHeader title="การตั้งค่าเทมเพลต" />
              <PortletBody>
                <div className="row">
                  <div className="col-xl-2"></div>
                  <div className="col-xl-8">
                    <div className="kt-section">
                      <div className="kt-section__body">
                        <h3 className="kt-section__title kt-section__title-lg">
                          Skins:
                        </h3>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Header Skin:
                          </label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="header.self.skin"
                              onBlur={handleBlur}
                              value={get(values, "header.self.skin")}
                              onChange={handleChange}
                            >
                              <option value="light">Light (Default)</option>
                              <option value="dark">Dark</option>
                            </select>
                          </div>
                        </div>
                        {/* 
                            TODO: Change Color sub header
                            <div className="form-group row">
                              <label className="col-3 col-form-label">
                                Header Menu Skin:
                              </label>
                              <div className="col-9">
                                <select
                                  className="form-control"
                                  name="header.menu.desktop.submenu.skin"
                                  onBlur={handleBlur}
                                  value={get(
                                    values,
                                    "header.menu.desktop.submenu.skin"
                                  )}
                                  onChange={handleChange}
                                >
                                  <option value="light">Light (Default)</option>
                                  <option value="dark">Dark</option>
                                </select>
                              </div>
                            </div> 
                          */}
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Logo Bar Skin:
                          </label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="brand.self.skin"
                              onBlur={handleBlur}
                              value={get(values, "brand.self.skin")}
                              onChange={handleChange}
                            >
                              <option value="dark">Dark (Default)</option>
                              <option value="light">Light</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Aside Skin:
                          </label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="aside.self.skin"
                              onBlur={handleBlur}
                              value={get(values, "aside.self.skin")}
                              onChange={handleChange}
                            >
                              <option value="dark">Dark (Default)</option>
                              <option value="light">Light</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"></div>
                    <div className="kt-section kt-section--last">
                      <div className="kt-section__body">
                        <h3 className="kt-section__title kt-section__title-lg">
                          Subheader:
                        </h3>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">Width:</label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="subheader.width"
                              onBlur={handleBlur}
                              value={get(values, "subheader.width")}
                              onChange={handleChange}
                            >
                              <option value="fluid">Fluid</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Subheader Style:
                          </label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="subheader.style"
                              onBlur={handleBlur}
                              value={get(values, "subheader.style")}
                              onChange={handleChange}
                            >
                              <option value="transparent">Transparent</option>
                              <option value="solid">Solid</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"></div>
                    <div className="kt-section kt-section--last">
                      <div className="kt-section__body">
                        <h3 className="kt-section__title kt-section__title-lg">
                          Content:
                        </h3>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">Width:</label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="content.width"
                              onBlur={handleBlur}
                              value={get(values, "content.width")}
                              onChange={handleChange}
                            >
                              <option value="fluid">Fluid</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"></div>
                    <div className="kt-section kt-section--last">
                      <div className="kt-section__body">
                        <h3 className="kt-section__title kt-section__title-lg">
                          Aside:
                        </h3>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Minimize:
                          </label>
                          <div className="col-9">
                            <Switch
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name="aside.self.minimize.toggle"
                              checked={get(
                                values,
                                "aside.self.minimize.toggle"
                              )}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Default Minimize:
                          </label>
                          <div className="col-9">
                            <Switch
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name="aside.self.minimize.default"
                              checked={get(
                                values,
                                "aside.self.minimize.default"
                              )}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-3 col-form-label">
                            Submenu Toggle:
                          </label>
                          <div className="col-9">
                            <select
                              className="form-control"
                              name="aside.menu.dropdown"
                              onBlur={handleBlur}
                              value={get(
                                values,
                                "aside.menu.dropdown"
                              ).toString()}
                              onChange={handleChange}
                            >
                              <option value="true">Dropdown</option>
                              <option value="false">Accordion</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2"></div>
                </div>
              </PortletBody>
              <PortletFooter>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                      }
                    )}`}
                  >
                    <i className="la la-eye" /> ใช้งาน
                  </button>{" "}
                  <button
                    type="button"
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loadingReset
                      }
                    )}`}
                  >
                    <i className="la la-recycle" /> รีเซ็ต
                  </button>
                </div>
              </PortletFooter>
            </Portlet>
          </>
        )}
      </Formik>
    </>
  );
}
