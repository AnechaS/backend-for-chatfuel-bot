import React, { useEffect } from "react";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { useQueryPeoples } from "./PeoplesUIHelpers";
import PeoplesListPage from "./PeoplesListPage";
import PeoplesDetailPage from "./PeoplesDetailPage";

export default function PeoplesPage() {
  const { path } = useRouteMatch();
  const { state, ...rest } = useQueryPeoples();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Switch>
      <Route
        exact
        path={path}
        children={<PeoplesListPage {...state} {...rest} />}
      />
      <Route
        path={`${path}/:id([A-Za-z0-9]{16})`}
        component={PeoplesDetailPage}
      />
      <Redirect to={path} />
    </Switch>
  );
}
