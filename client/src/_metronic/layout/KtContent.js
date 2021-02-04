import React, { useRef } from "react";
import { connect } from "react-redux";
import * as builder from "../ducks/builder";

function KtContent({ children, contentContainerClasses }) {
  const ref = useRef();

  return (
    <div
      ref={ref}
      className={`kt-container ${contentContainerClasses} kt-grid__item kt-grid__item--fluid kt-grid--hor`}
    >
      {children}
    </div>
  );
}

const mapStateToProps = store => ({
  contentContainerClasses: builder.selectors.getClasses(store, {
    path: "content_container",
    toString: true
  })
});

export default connect(mapStateToProps)(KtContent);
