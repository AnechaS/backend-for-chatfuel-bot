import React, { useMemo } from "react";

export default function Logo({ color, colorObject, size }) {
  const colorText = useMemo(() => {
    if (typeof colorObject[color] !== "undefined") {
      return colorObject[color];
    }

    return colorObject.white;
  }, [color, colorObject]);

  return (
    <>
      <div className="brand-logo">
        <span
          className="brand-logo--text"
          style={{ color: colorText, fontSize: `${size}px` }}
        >
          {process.env.REACT_APP_NAME}
        </span>
      </div>
    </>
  );
}

Logo.defaultProps = {
  color: "white",
  colorObject: {
    black: "#595d6e",
    white: "#ffffff"
  },
  size: 21
};
