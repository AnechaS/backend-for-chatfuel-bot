import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PeopleListPage from "./PeopleListPage";

export default function PeoplePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Switch>
      <Route exact path="/peoples" children={<PeopleListPage />} />
      {/* <Route
        path={`${path}/:id([A-Za-z0-9]{16})`}
        component={PeopleDetailPage}
      /> */}
      <Redirect to="/peoples" />
    </Switch>
  );
}
