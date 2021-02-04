import React, { useState, useEffect, useCallback } from "react";
import { isEqual } from "lodash";

/**
 * Data to json stringify scpace ", "
 * @param {any} o Data to be converted
 */
function Stringify_WithSpaces(o) {
  let result = JSON.stringify(o, null, 1);
  result = result.replace(/^ +/gm, " ");
  result = result.replace(/\n/g, "");
  result = result.replace(/{ /g, "{").replace(/ }/g, "}");
  result = result.replace(/\[ /g, "[").replace(/ \]/g, "]");
  return result;
}

export const InputEdit = ({ type, ...props }) => {
  switch (type) {
    case "String":
    case "Array":
    case "Object":
      return <textarea {...props} />;

    case "Boolean":
      return (
        <select {...props}>
          {["true", "false"].map((v) => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </select>
      );

    default:
      return <input {...props} />;
  }
};

export const Edit = ({
  initialValue,
  edit = true,
  hidden = false,
  type,
  onBlur,
}) => {
  const [value, setValue] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [editing, setEditing] = useState(false);

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    // Tranfrom value to string
    let valueString = "";
    if (typeof initialValue !== "undefined") {
      switch (type) {
        case "Array":
          valueString = Stringify_WithSpaces(initialValue);
          break;

        case "Object":
          valueString = Stringify_WithSpaces(initialValue);
          break;

        default:
          valueString = initialValue.toString();
          break;
      }
    }

    setValue(valueString);
    setOriginalValue(valueString);
  }, [hidden, initialValue, type]);

  const handleDoubleClick = () => {
    if (edit) {
      setEditing(true);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = useCallback(() => {
    setEditing(false);

    let val = value;
    if (type === "Array" || type === "Object") {
      // Validate value is json
      try {
        val = JSON.parse(val);
      } catch (error) {
        // error value
        setValue(originalValue);
        return;
      }
    }

    if (hidden && !val) {
      return;
    }

    if (onBlur && typeof onBlur === "function") {
      onBlur(val);

      if (hidden) {
        setValue("");
      }
    }
  }, [hidden, value, onBlur, originalValue, type]);

  let text = value;
  if (hidden) {
    text = "(hidden)";
  } else if (typeof initialValue === "undefined" && value === "") {
    text = "(undefined)";
  }

  if (!editing) {
    return <span onDoubleClick={handleDoubleClick}>{text}</span>;
  }

  return (
    <span>
      <InputEdit
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </span>
  );
};

export default function EditableCell(props) {
  const {
    value: initialValue,
    row: { index },
    column: { id, type = "", edit, hidden = false },
    loading,
    onUpdate,
  } = props;
  const onBlur = (value) => {
    if (!isEqual(value, initialValue)) {
      onUpdate(index, id, value);
    }
  };

  return (
    <Edit
      initialValue={initialValue}
      onBlur={onBlur}
      edit= {loading === true ? false : Boolean(edit)}
      hidden={hidden}
      type={type}
    />
  );
}
