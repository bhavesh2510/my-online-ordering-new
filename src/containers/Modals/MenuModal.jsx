import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { addItem } from "../../state-management/menu/actions";
import ForcedModifiers from "../Modifiers/ForcedModifiers/ForcedModifiers";
import OptionalModifiers from "../Modifiers/OptionalModifiers/OptionalModifiers";

const MenuModal = ({ item }) => {
  const dispatch = useDispatch();
  const [radiovalue, setradiovalue] = useState();
  const [modal, setModal] = useState(false);
  const menu = useSelector((state) => state.menu);
  const allFm = menu.allForcedModifier;
  const allOm = menu.allOptionalModifier;

  const radioSelect = (val) => {
    console.log("val", val);
    setradiovalue(val.target.value);
  };

  const getForcedModifiers = (item) => {
    return item?.forced_modifier
      .split(",")
      .map((fm) => allFm.find(({ fm_cat_id: fmId }) => fmId === fm));
  };
  const getOptionalModifiers = (item) => {
    return item?.optional_modifier
      .split(",")
      .map((om) => allOm.find(({ om_cat_id: omId }) => omId === om));
  };
  const toggle = () => {
    setModal(!modal);
  };

  // const clickev = (e) => {
  //   //console.log("items after click is", item.name);
  //   getForcedModifiers(item);

  //   //dispatch(addToCart(item.name, getForcedModifiers(item)));
  //   setModal(!modal);
  // };

  const onModalClick = (item) => {
    dispatch(addItem(item, item.modifiers, radiovalue, menu.restaurantInfo));
    console.log("items after modal click", item);
    setModal(!modal);
  };

  return (
    <div>
      <button
        style={{
          background: "#5B53CD",
          color: "whitesmoke",
          fontSize: "1.3rem",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "none",
          outline: "none",
          display: "flex",
          justifyContent: "center",
        }}
        onClick={toggle}
      >
        <span style={{ margin: "auto auto" }}>+</span>
      </button>
      {console.log("Item passed to the modal", item)}
      {console.log("forcedModifiers", getForcedModifiers(item))}
      <Modal style={{ top: "25%" }} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {item.title || item.cname || item.name}
        </ModalHeader>
        <ModalBody style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <ForcedModifiers
            radioSelect={radioSelect}
            forcedModifier={getForcedModifiers(item)}
            detours={item.detour_ids}
            symbol={menu.restaurantInfo.monetary_symbol}
          />
          <OptionalModifiers
            optionalModifier={getOptionalModifiers(item)}
            symbol={menu.restaurantInfo.monetary_symbol}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => onModalClick(item)}
            style={{ backgroundColor: "green", border: "none" }}
            // onClick={toggle}
          >
            Add Items {radiovalue}
          </Button>{" "}
          <Button
            style={{ backgroundColor: "red", border: "none" }}
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MenuModal;
