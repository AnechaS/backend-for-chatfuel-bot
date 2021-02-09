import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login } from "../../crud/auth.crud";

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "3.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "2.5rem" });
  };

  return (
    <>
      <div className="kt-login__signin">
        <div className="kt-login__head">
          <h3 className="kt-login__title">Login To Your Account</h3>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validate={values => {
            const errors = {};

            if (!values.email) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_FIELD"
              });
            }

            if (!values.password) {
              errors.password = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            return errors;
          }}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            enableLoading();
            setTimeout(() => {
              login(values.email, values.password)
                .then(({ data: { sessionToken } }) => {
                  disableLoading();
                  props.login(sessionToken);
                })
                .catch(() => {
                  disableLoading();
                  setSubmitting(false);
                  setStatus(
                    intl.formatMessage({
                      id: "AUTH.VALIDATION.INVALID_LOGIN"
                    })
                  );
                });
            }, 1000);
          }}
        >
          {({
            values,
            status,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            submitCount
          }) => (
            <form
              noValidate={true}
              autoComplete="off"
              className="kt-form"
              onSubmit={handleSubmit}
            >
              {status && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{status}</div>
                </div>
              )}

              <div className="input-group">
                <input
                  type="email"
                  className={`form-control ${clsx({
                    "is-invalid": Boolean(
                      submitCount && touched.email && errors.email
                    )
                  })}`}
                  name="email"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                />
                {Boolean(submitCount && touched.email && errors.email) && (
                  <div id="email-error" className="error invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  className={`form-control ${clsx({
                    "is-invalid": Boolean(
                      submitCount && touched.password && errors.password
                    )
                  })}`}
                  name="password"
                  placeholder="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
                {Boolean(
                  submitCount && touched.password && errors.password
                ) && (
                  <div id="password-error" className="error invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="row kt-login__extra">
                <div className="col">
                  <label className="kt-checkbox">
                    <input type="checkbox" name="remember" /> Remember me
                    <span></span>
                  </label>
                </div>
                <div className="col kt-align-right">
                  {/* <Link to="/auth/forgot-password" className="kt-login__link">
                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                  </Link> */}
                </div>
              </div>

              <div className="kt-login__actions">
                <button
                  id="kt_login_signin_submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-brand btn-elevate kt-login__btn-primary ${clsx(
                    {
                      "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                    }
                  )}`}
                  style={loadingButtonStyle}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </Formik>
        {/* </div> */}
      </div>
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
