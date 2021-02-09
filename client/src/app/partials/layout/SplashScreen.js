import React from "react";
import { CircularProgress } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../_metronic";

class SplashScreen extends React.Component {
  render() {
    return (
      <>
        <div className="kt-splash-screen">
          <CircularProgress className="kt-splash-screen__spinner" />
        </div>
      </>
    );
  }
}

export default SplashScreen;
