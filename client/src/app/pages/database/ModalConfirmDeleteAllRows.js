import React from "react";
import Modal from "react-bootstrap/Modal";

export default function ModalConfirmDeleteAllRows({
  show = false,
  onHide,
  modelName,
  onConfirmed,
}) {
  const [text, setText] = React.useState("");
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>ต้องการลบแถวทั้งหมด?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="kt-font-dark">
          ยืนยันการดำเนินการนี้ โปรดพิมพ์ <strong>{modelName}</strong>{" "}
          เพื่อยืนยัน
        </p>
        <input
          className="form-control"
          placeholder="ชื่อ Model ปัจจุบัน"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <button
          className="btn btn-danger btn-block mt-3 font-weight-bold"
          disabled={modelName !== text}
          onClick={onConfirmed}
        >
          ล้างข้อมูล Model นี้
        </button>
      </Modal.Body>
    </Modal>
  );
}
