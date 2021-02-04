import React from "react";
import clsx from "clsx";

export function Button({
  children,
  color,
  size,
  onClick,
  disabled,
  spinner,
  colorSpinner = "primary",
  spinnerLeft = true,
  spinnerRight = false,
  spinnerSize,
  className,
  ...rest
}) {
  return (
    <button
      className={clsx(
        "btn",
        {
          [`btn-${color}`]: color,
          [`btn-${size}`]: size
        },
        spinner && [
          "kt-spinner",
          {
            "kt-spinner--left": spinnerLeft && !spinnerRight,
            "kt-spinner--right": spinnerRight,
            [`kt-spinner--${colorSpinner}`]: colorSpinner,
            [`kt-spinner--${spinnerSize}`]: spinnerSize
          }
        ],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
