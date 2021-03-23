import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ForcedModifiers from "../Modifiers/ForcedModifiers/ForcedModifiers";
import OptionalModifiers from "../Modifiers/OptionalModifiers/OptionalModifiers";

const MenuModal = ({item}) => {
  const [modal, setModal] = useState(false);
  const menu = useSelector((state)=>state.menu)
  const allFm = menu.allForcedModifier;
  const allOm = menu.allOptionalModifier;
  const getForcedModifiers = (item) => {
    return item?.forced_modifier.split(",").map((fm)=>allFm.find(({fm_cat_id: fmId})=>fmId === fm));
  }
  const getOptionalModifiers = (item) =>{
    return item?.optional_modifier.split(',').map((om)=>allOm.find(({om_cat_id:omId})=>omId === om))
  }
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        style={{
          backgroundColor: "#5B53CD",
          height: "40",
          width: "40",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
        }}
        onClick={toggle}
      >
        <span style={{ margin: "auto auto" }}>+</span>
      </Button>
      {console.log("Item passed to the modal", item)}
      {console.log("forcedModifiers", getForcedModifiers(item))}
      <Modal style={{ top:"25%" }} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {item.title || item.cname || item.name}
        </ModalHeader>
        <ModalBody>
          <ForcedModifiers
            forcedModifier={getForcedModifiers(item)}
            detours = {item.detour_ids}
            symbol={menu.restaurantInfo.monetary_symbol}
          />
          <OptionalModifiers
            optionalModifier={getOptionalModifiers(item)}
            symbol={menu.restaurantInfo.monetary_symbol}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            style={{ backgroundColor: "green", border: "none" }}
            onClick={toggle}
          >
            Add Items
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
