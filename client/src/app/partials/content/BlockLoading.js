import React from "react";
import clsx from "clsx";
import Spin from "./Spin";

export default function BlockLoading({
  spinning,
  error,
  message,
  messageSize,
  messageColor,
  btnRefetchTitle,
  btnRefetchColor,
  btnRefetchSize,
  onRefetch,
  children,
}) {
  if (!spinning && !error) {
    return <>{children}</>;
  }

  return (
    <Spin spinning={spinning}>
      {!spinning && error && (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "100%", width: "100%" }}
        >
          <div
            className={clsx(
              `mb-2 kt-font-${messageColor}`,
              messageSize && `kt-font-${messageSize}`
            )}
          >
            {message}
          </div>

          <button
            className={clsx(
              `btn btn-${btnRefetchColor}`,
              btnRefetchSize && `btn-${btnRefetchSize}`
            )}
            onClick={onRefetch}
          >
            {btnRefetchTitle}
          </button>
        </div>
      )}
    </Spin>
  );
}

BlockLoading.defaultProps = {
  spinning: false,
  error: false,
  message: (
    <>
      <strong>อ๊ะ!</strong> ดูเหมือนว่าจะมีข้อผิดพลาดในการร้องขอข้อมูล
    </>
  ),
  messageColor: "dark",
  btnRefetchTitle: "โหลดอีกครั้ง",
  btnRefetchColor: "warning",
};
