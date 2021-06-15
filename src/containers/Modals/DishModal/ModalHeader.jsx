import React from "react";
import "./CssForModal.css";
//import closeImage from '../../../../assets/images/svg/close.svg';

const ModalHeader = ({ title, onClose }) => (
  <header className="modal-header">
    <div className="header-content">
      <span className="title">{title}</span>
      {/* <img
        src={closeImage}
        onClick={onClose}
        className="close-button"
      /> */}
    </div>
  </header>
);
export default ModalHeader;
