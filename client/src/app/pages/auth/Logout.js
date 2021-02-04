import React, { Component } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
import { logout } from "../../crud/users.crud";

class Logout extends Component {
  componentDidMount() {
    logout().finally(() => {
      this.props.logout();
    });
  }

  render() {
    const { hasAuthToken } = this.props;
    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth" />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
