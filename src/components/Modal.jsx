import { useState } from "react";

function Modal(props) {
  if (!props.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
