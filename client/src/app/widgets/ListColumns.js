import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import "react-perfect-scrollbar/dist/css/styles.css";

export default function ListColumns({ columns = [], data = [] }) {
  const ref = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    const headerEl = ref.current.querySelector(".kt-widget6__head");
    setBodyHeight(ref.current.offsetHeight - headerEl.offsetHeight - 45);
  }, [ref]);

  return (
    <div
      ref={ref}
      className="kt-widget6"
      style={{
        paddingTop: 25,
        paddingBottom: 25,
        height: "100%",
        width: "100%",
      }}
    >
      <div className="kt-widget6__head">
        <div
          className="kt-widget6__item"
          style={{ paddingLeft: 25, paddingRight: 25 }}
        >
          {columns.map(({ name }) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
      {bodyHeight && (
        <PerfectScrollbar
          className="kt-widget6__body"
          style={{ height: bodyHeight }}
        >
          {data.map((object, i) => (
            <div
              key={"item-" + (i + 1)}
              className="kt-widget6__item"
              style={{ paddingLeft: 25, paddingRight: 25 }}
            >
              {columns.map(({ field }) => (
                <span key={object[field]}>{object[field]}</span>
              ))}
            </div>
          ))}
        </PerfectScrollbar>
      )}
    </div>
  );
}
