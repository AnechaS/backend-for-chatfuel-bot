import React, { useState, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import {
  Portlet,
  PortletHeader,
  PortletBody
} from "../partials/content/Portlet";
import { updateUser } from "../crud/user.crud";
import { login } from "../crud/auth.crud";
import * as auth from "../store/ducks/auth.duck";

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("ต้องระบุรหัสผ่านใหม่")
    .min(8, "ต้องมีอักษร 8 ตัวขึ้นไป")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}/g,
      "ต้องมีอักษร A-Z, a-z, #$^+=!*()@%& เหล่านี้อยู่ด้วย ตัวอย่าง HelloX1@"
    ),
  confirm: Yup.string()
    .required("ต้องระบุรหัสยืนยัน")
    .oneOf([Yup.ref("password")], "ไม่ตรงกันรหัสผ่านใหม่")
});

export default function ChangePassword() {
  const user = useSelector(state => state.auth.user, shallowEqual);
  const dispatch = useDispatch();

  const [showForm, setShowFrom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (values, { setStatus }) => {
      try {
        // spinner on
        setLoading(true);

        // clear status
        setStatus("");

        // request to change password
        await updateUser(user._id, { password: values.password });

        // get session token
        const sessionToken = await login(user.email, values.password).then(
          ({ data }) => data.sessionToken
        );

        dispatch(auth.actions.refreshToken(sessionToken));

        setShowFrom(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      } catch (error) {
        setStatus("การส่งคำร้องข้อ เปลียนรหัสผ่านเข้าสู่ระบบลมเหลว");
      } finally {
        // spinner off
        setLoading(false);
      }
    },
    [user._id, user.email, dispatch]
  );

  return (
    <Portlet>
      <PortletHeader title="การเข้าสู่ระบบ" />
      <PortletBody>
        <div className="row">
          <div className="col-xl-2"></div>
          <div className="col-xl-8">
            <div className="kt-section kt-section--last">
              <div className="kt-section__body">
                <div className="form-group row">
                  <label className="col-3 col-form-label">รหัสผ่าน</label>
                  <div className="col-9">
                    {/* desc */}
                    <span className="form-text text-muted">
                      ควรใช้รหัสผ่านที่ไม่ซ้ำกับรหัสผ่านที่คุณใช้ที่อื่น
                      และควรมีความยาวอย่างน้อย 8 ตัวอักษรหรือมากกว่านั้น
                      ซึ่งประกอบด้วยอักขระ a-z, A-Z, 0-9 และสัญลักษณ เช่น + @ #
                      $ % ^ & *
                    </span>
                    {!showForm && !isSuccess && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm kt-margin-t-5 kt-margin-b-5"
                        onClick={() => setShowFrom(true)}
                      >
                        ฉันต้องการเปลี่ยนรหัสผ่านใหม่
                      </button>
                    )}

                    {/* Form change password */}
                    {showForm && !isSuccess && (
                      <Formik
                        initialValues={{
                          password: "",
                          confirm: ""
                        }}
                        validationSchema={ChangePasswordSchema}
                        onReset={() => setShowFrom(false)}
                        onSubmit={handleSubmit}
                      >
                        {({
                          handleSubmit,
                          handleReset,
                          handleChange,
                          handleBlur,
                          status,
                          values,
                          errors,
                          touched,
                          isSubmitting
                        }) => (
                          <form
                            className="kt-form kt-form--label-right mt-3"
                            onSubmit={handleSubmit}
                          >
                            {status && (
                              <div className="alert alert-danger" role="alert">
                                <div className="alert-text">{status}! </div>
                              </div>
                            )}

                            <div className="form-group">
                              <label>ใหม่:</label>
                              <input
                                type="password"
                                id="new-password"
                                name="password"
                                className={clsx("form-control", {
                                  "is-invalid":
                                    errors.password && touched.password
                                })}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {Boolean(errors.password && touched.password) && (
                                <div className="invalid-feedback">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <label>พิมพ์อีกครั้ง:</label>
                              <input
                                type="password"
                                id="confirm-password"
                                name="confirm"
                                className={clsx("form-control", {
                                  "is-invalid":
                                    touched.confirm && errors.confirm
                                })}
                                value={values.confirm}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {Boolean(errors.confirm && touched.confirm) && (
                                <div className="invalid-feedback">
                                  {errors.confirm}
                                </div>
                              )}
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className={clsx(
                                "btn btn-primary",
                                loading &&
                                  "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light"
                              )}
                            >
                              บันทึกการเปลี่ยนแปลง
                            </button>

                            <button
                              type="reset"
                              className="btn btn-secondary ml-1"
                              onClick={handleReset}
                            >
                              ยกเลิก
                            </button>
                          </form>
                        )}
                      </Formik>
                    )}

                    {/* Change password success */}
                    {isSuccess && (
                      <div className="mt-3">
                        <i
                          className="fa fa-check kt-font-success"
                          style={{ fontSize: 18 }}
                        ></i>
                        &nbsp;ระบบได้ทำการเปลียนรหัสผ่านเรียบร้อบแล้ว
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">เซสชั่นโทเคน</label>
                  <div className="col-9">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm kt-margin-t-5 kt-margin-b-5"
                    >
                      ออกจากระบบในอุปกรณ์อื่นทั้งหมด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-2"></div>
        </div>
      </PortletBody>
    </Portlet>
  );
}
