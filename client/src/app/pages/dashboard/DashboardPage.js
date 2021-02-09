import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import moment from "moment";
import SubHeader from "../../partials/layout/SubHeader";
import KTContent from "../../../_metronic/layout/KtContent";
import DashboardPage1 from "./DashboardPage1";
import DashboardPage2 from "./DashboardPage2";

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = { page: "2" };

    this.Page = new Map([
      [
        "1",
        moment("2019-07-01").format("MMM YYYY") +
          " - " +
          moment("2020-04-04").format("MMM YYYY")
      ],
      ["2", moment().format("D MMM YYYY")]
    ]);
  }

  componentDidMount() {
    const { history } = this.props;
    const page = history.location.pathname.split("/").pop();
    this.setState({ page });

    window.scrollTo(0, 0);
  }

  handleChangePage = value => {
    this.setState({ page: value });
    this.props.history.push(`/dashboard/${value}`);
  };

  render() {
    const { page } = this.state;
    return (
      <>
        <SubHeader>
          <SubHeader.Main title="Dashboard"></SubHeader.Main>
          <SubHeader.Toolbar>
            <SubHeader.Dropdown>
              <SubHeader.Dropdown.Toggle color="primary">
                <i className="fas fa-calendar-alt"></i>
                {this.Page.get(page)}
              </SubHeader.Dropdown.Toggle>
              <SubHeader.Dropdown.Menu style={{ width: "200px" }} drop="left">
                {Array.from(this.Page.keys()).map(key => (
                  <SubHeader.Dropdown.Item
                    key={key}
                    onClick={() => this.handleChangePage(key)}
                  >
                    {this.Page.get(key)}
                  </SubHeader.Dropdown.Item>
                ))}
              </SubHeader.Dropdown.Menu>
            </SubHeader.Dropdown>
          </SubHeader.Toolbar>
        </SubHeader>
        <KTContent>
          <Switch>
            <Redirect
              from="/dashboard"
              exact={true}
              to={`/dashboard/${page}`}
            />
            <Route path="/dashboard/1" component={DashboardPage1} />
            <Route path="/dashboard/2" component={DashboardPage2} />
          </Switch>
        </KTContent>
      </>
    );
  }
}

export default DashboardPage;
