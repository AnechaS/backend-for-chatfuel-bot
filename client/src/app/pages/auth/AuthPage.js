import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Login from "./Login";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-3.scss";

export default function AuthPage() {
  return (
    <>
      <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v3 kt-login--signin"
        >
          <div
            className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-3.jpg")}`
            }}
          >
            <div className="kt-grid__item kt-grid__item--fluid kt-login__wrapper">
              <div className="kt-login__container">
                <div className="kt-login__logo">
                  <Link to="/">
                    <img
                      className="kt-login__logo--media kt-media kt-media--circle"
                      src={toAbsoluteUrl("/media/logos/logo-1x.jpg")}
                      alt=""
                    />
                  </Link>
                </div>

                <Switch>
                  <Redirect from="/auth" exact={true} to="/auth/login" />
                  <Route path="/auth/login" component={Login} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
