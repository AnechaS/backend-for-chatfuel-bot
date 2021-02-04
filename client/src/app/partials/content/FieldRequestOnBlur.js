import { useState, useEffect, useCallback } from "react";

export default function FieldRequestOnBlur({
  defaultValue = "",
  validate,
  children,
  request,
  name,
  send,
  messageSendedError,
  component,
  onRequired,
  ...rest
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    async (e) => {
      const val = e.target.value.trim();
      setValue(val);

      if (typeof validate === "function") {
        let validation = validate(val);
        if (validation instanceof Promise) {
          validation = await validation
            .then(() => "")
            .catch((err) => err.message);
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
        await send(name, value);
        onRequired(name, value);
      } catch (error) {
        setError(messageSendedError || error.message || "failed");
      } finally {
        setLoading(false);
      }
    }
  }, [error, value, send, name, defaultValue, messageSendedError, onRequired]);

  const field = {
    name: name,
    value: value,
    onBlur: handleBlur,
    onChange: handleChange,
    ...rest,
  };
  const meta = {
    error: error,
    // TODO: check touche
    // touched
  };
  const propsComponent = {
    field,
    meta,
    loading,
  };

  if (component) {
    return component(propsComponent);
  }

  return children(propsComponent);
}
