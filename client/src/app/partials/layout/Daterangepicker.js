import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const $ = window.$;

export default function Daterangepicker({ children, options, cb }) {
  const ref = useRef(null);

  useEffect(() => {
    const $el = $(ref.current);
    $el.daterangepicker(options, cb);

    // console.log($el.daterangepicker);
  }, [options, cb]);

  return React.cloneElement(children, {
    ref
  });
}

Daterangepicker.propTypes = {
  children: PropTypes.node.isRequired,
  cb: PropTypes.func
};
