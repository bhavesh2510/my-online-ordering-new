import React from "react";
import { ModalFooter, Button } from "reactstrap";
import "./CssForModal.css";

const FooterModifier = ({
  btnCls = "",
  buttonTitle,
  disabled = false,
  onClick,
}) => (
  <ModalFooter>
    <Button
      className={`${disabled ? "disabled" : ""}`}
      style={{ width: "100%", backgroundColor: "black", color: "whitesmoke" }}
      onClick={onClick}
    >
      {buttonTitle}
    </Button>
  </ModalFooter>
);
export default FooterModifier;
