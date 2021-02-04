import React, { useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Yup from "yup";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { updateUser } from "../../crud/users.crud";
import {
  Portlet,
  PortletHeader,
  PortletBody
} from "../../partials/content/Portlet";
import FieldRequestOnBlur from "../../partials/content/FieldRequestOnBlur";

export default function ChangeUserInfo() {
  const user = useSelector(state => state.auth.user, shallowEqual);
  const dispatch = useDispatch();

  const editUser = useCallback(
    (name, value) => {
      return updateUser(user._id, { [name]: value }).catch(() =>
        Promise.reject(
          new Error("ไม่สามารถแก้ไขได้ เนื่องจากส่งคำรองขอล้มเหลว")
        )
      );
    },
    [user._id]
  );

  const onRequired = (name, value) => {
    dispatch(auth.actions.updateUser(name, value));
  };

  const renderField = ({ field, meta: { error }, loading }) => (
    <div
      className={clsx(
        loading &&
          "kt-spinner kt-spinner--sm kt-spinner--success kt-spinner--right kt-spinner--input"
      )}
    >
      <input
        autoComplete="off"
        className={clsx("form-control", {
          "is-invalid": error
        })}
        disabled={loading}
        {...field}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );

  return (
    <Portlet>
      <PortletHeader title="การตั้งค่าบัญชีทั่วไป" />
      <PortletBody className="kt-from">
        <div className="row">
          <div className="col-xl-2"></div>
          <div className="col-xl-8">
            <div className="form-group row">
              <label htmlFor="name" className="col-3 col-form-label">
                ชื่อผู้ใช้:
              </label>
              <div className="col-9">
                <FieldRequestOnBlur
                  type="text"
                  name="name"
                  id="name"
                  placeholder="กรอกข้อมูลชื่อผู้ใช้"
                  defaultValue={user.name}
                  component={renderField}
                  send={editUser}
                  onRequired={onRequired}
                  validate={value => {
                    return Yup.string()
                      .min(2, "ต้องมีตัวอักษรมากกว่า 2 ตัว")
                      .max(50, "ต้องมีตัวอักษรตัวอักษร 50 ตัว")
                      .validate(value);
                  }}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="email" className="col-3 col-form-label">
                อีเมล:
              </label>
              <div className="col-9">
                <FieldRequestOnBlur
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  id="email"
                  placeholder="กรอกข้อมูลอีเมล"
                  component={renderField}
                  send={editUser}
                  onRequired={onRequired}
                  validate={value => {
                    return Yup.string()
                      .email("ต้องเป็นอีเมล ตัวอย่างเช่น example@email.com")
                      .required("ต้องใส่อีเมล")
                      .validate(value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-2"></div>
        </div>
      </PortletBody>
    </Portlet>
  );
}