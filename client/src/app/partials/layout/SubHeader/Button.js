import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  color = "primary",
  disabled = false,
  className,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={clsx(
        `btn kt-subheader__btn-${color}`,
        { disabled },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Tag>
  );
}
