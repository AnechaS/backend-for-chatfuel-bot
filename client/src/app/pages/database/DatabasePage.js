import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Comment from "./Comment";
import People from "./People";
import Progress from "./Progress";
import Question from "./Question";
import Quiz from "./Quiz";
import Reply from "./Reply";
import Schedule from "./Schedule";
import User from "./User";

export default function DatabasePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Switch>
      <Redirect from="/database" exact={true} to="/database/comment" />
      <Route path="/database/comment" component={Comment} />
      <Route path="/database/people" component={People} />
      <Route path="/database/progress" component={Progress} />
      <Route path="/database/question" component={Question} />
      <Route path="/database/quiz" component={Quiz} />
      <Route path="/database/reply" component={Reply} />
      <Route path="/database/schedule" component={Schedule} />
      <Route path="/database/user" component={User} />
    </Switch>
  );
}
