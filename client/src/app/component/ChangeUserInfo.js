import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Yup from "yup";
import clsx from "clsx";
import {
  Portlet,
  PortletHeader,
  PortletBody
} from "../partials/content/Portlet";
import { actions } from "../store/ducks/auth.duck";
import { updateUser } from "../crud/user.crud";

export default function ChangeUserInfo() {
  const user = useSelector(state => state.auth.user, shallowEqual);
  const dispatch = useDispatch();

  const editUser = useCallback(
    (value, name) => {
      return updateUser(user._id, { [name]: value }).catch(() =>
        Promise.reject(
          new Error("ไม่สามารถแก้ไขได้ เนื่องจากส่งคำรองขอล้มเหลว")
        )
      );
    },
    [user._id]
  );

  const onChange = (value, name) => {
    dispatch(actions.fulfillUser({ [name]: value }));
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
                <FieldRequerstOnBlur
                  type="text"
                  name="name"
                  id="name"
                  placeholder="กรอกข้อมูลชื่อผู้ใช้"
                  defaultValue={user.name}
                  component={renderField}
                  send={editUser}
                  onChange={onChange}
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
                <FieldRequerstOnBlur
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  id="email"
                  placeholder="กรอกข้อมูลอีเมล"
                  component={renderField}
                  send={editUser}
                  onChange={onChange}
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

const FieldRequerstOnBlur = ({
  defaultValue = "",
  validate,
  children,
  request,
  name,
  send,
  messageSendedError,
  component,
  onChange: onValueChange,
  ...rest
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    async e => {
      const val = e.target.value.trim();
      setValue(val);

      if (typeof validate === "function") {
        let validation = validate(val);
        if (validation instanceof Promise) {
          validation = await validation
            .then(() => "")
            .catch(err => err.message);
        }
        if (typeof validation === "string" && validation !== error) {
          setError(validation);
        }
      }
    },
    [error, validate]
  );

  const handleBlur = useCallback(async () => {
    if (error || value === "") {
      setError("");
      setValue(defaultValue);
      return;
    }

    if (typeof send === "function" && value !== defaultValue) {
      try {
        setLoading(true);
        await send(value, name);
        onValueChange(value, name);
      } catch (error) {
        setError(messageSendedError || error.message || "requested failure.");
      } finally {
        setLoading(false);
      }
    }
  }, [
    error,
    value,
    send,
    name,
    defaultValue,
    messageSendedError,
    onValueChange
  ]);

  const field = {
    name: name,
    value: value,
    onBlur: handleBlur,
    onChange: handleChange,
    ...rest
  };
  const meta = {
    error: error
    // TODO: check touche
    // touched
  };
  const propsComponent = {
    field,
    meta,
    loading
  };

  if (component) {
    return component(propsComponent);
  }

  return children(propsComponent);
};
