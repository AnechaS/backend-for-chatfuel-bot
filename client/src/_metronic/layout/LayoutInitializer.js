import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutSplashScreen } from "./LayoutContext";
import * as builder from "../ducks/builder";

import { getSchemas } from "../../app/crud/schemas.crud";
import * as schemas from "../../app/store/ducks/schemas.duck";
/**
 * Used to synchronize current layout `menuConfig`, `layoutConfig` and
 * `htmlClassService` with redux store.
 */
export default function LayoutInitializer({
  children,
  menuConfig,
  layoutConfig,
  htmlClassService,
}) {
  const dispatch = useDispatch();
  const builderState = useSelector(({ builder }) => builder);

  useEffect(() => {
    dispatch(builder.actions.setMenuConfig(menuConfig));
  }, [dispatch, menuConfig]);

  useEffect(() => {
    if (layoutConfig.demo !== builderState.layoutConfig.demo) {
      dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    }
  }, [dispatch, builderState.layoutConfig, layoutConfig]);

  useEffect(() => {
    dispatch(builder.actions.setHtmlClassService(htmlClassService));
  }, [dispatch, htmlClassService]);

  useEffect(() => {
    dispatch(builder.actions.setMenuConfig(menuConfig));
  }, [dispatch, menuConfig]);

  useEffect(() => {
    getSchemas()
      .then(({ data }) => {
        dispatch(schemas.actions.loadSchemas(data.results));
      });
  }, [dispatch]);

  return htmlClassService === builderState.htmlClassServiceObjects ? (
    // Render content when `htmlClassService` synchronized with redux store.
    <>{children}</>
  ) : (
    // Otherwise sow loading splash screen.
    <LayoutSplashScreen />
  );
}
