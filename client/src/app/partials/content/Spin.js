import React from "react";
import { CircularProgress } from "@material-ui/core";

export default function Spin({ children, spinning }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {spinning && (
        <div
          style={{
            position: "absolute",
            zIndex: 4,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            opacity: 1
          }}
        >
          <CircularProgress className="kt-splash-screen__spinner" />
        </div>
      )}
      {children}
    </div>
  );
}
