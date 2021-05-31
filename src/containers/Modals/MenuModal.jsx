import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { addItem } from "../../state-management/menu/actions";
import ForcedModifiers from "../Modifiers/ForcedModifiers/ForcedModifiers";
import OptionalModifiers from "../Modifiers/OptionalModifiers/OptionalModifiers";
import { getTaxes } from "../../state-management/menu/operations";
import { truncateDecimal } from "../../state-management/menu/utils";

const MenuModal = ({ item }) => {
  const dispatch = useDispatch();
  const [radiovalue, setradiovalue] = useState();
  const [modal, setModal] = useState(false);
  const menu = useSelector((state) => state.menu);
  const allFm = menu.allForcedModifier;
  const allOm = menu.allOptionalModifier;

  const toggle = () => {
    setModal(!modal);
  };

  const [state, setState] = useState({
    selectedOptionalModifier: [],
    selectedForcedModifier: [],
    forcedPrice: 0,
    optionalPrice: 0,
    item: item,
  });

  // const radioSelect = (val) => {
  //   console.log("val", val);
  //   setradiovalue(val.target.value);
  // };

  // const getForcedModifiers = (item) => {
  //   return item?.forced_modifier
  //     .split(",")
  //     .map((fm) => allFm.find(({ fm_cat_id: fmId }) => fmId === fm));
  // };
  // const getOptionalModifiers = (item) => {
  //   return item?.optional_modifier
  //     .split(",")
  //     .map((om) => allOm.find(({ om_cat_id: omId }) => omId === om));
  // };
  // const toggle = () => {
  //   setModal(!modal);
  // };
  const onModalClick = (item) => {
    // const { menuItems } = carrtitem;
    // const item = menuItems.find(({ id }) => this.state.item.id === id);
    const { forcedPrice, optionalPrice } = state;
    const modifier = {
      forcedModifier: state.selectedForcedModifier,
      optionalModifier: state.selectedOptionalModifier,
    };
    const subTotal = forcedPrice + optionalPrice + Number(item.price);

    console.log("modifiers in handleAddItem", modifier);

    dispatch(addItem(item, modifier, subTotal, menu.restaurantInfo));
    console.log("items after modal click", item);
    setModal(!modal);
  };

  const getForcedModifiers = () => {
    if (state.item.forced_modifier !== "0") {
      const itemForcedModifiers = state.item.forced_modifier.split(",");

      return menu.allForcedModifier.filter((item) =>
        itemForcedModifiers.includes(item.fm_cat_id)
      );
    }

    return [];
  };

  // const getOptionModifiers = () => {
  //   if (this.state.item.optional_modifier !== "0") {
  //     const itemOptionalModifiers =
  //       this.state.item.optional_modifier.split(",");

  //     return this.props.allOptionalModifier.filter((item) =>
  //       itemOptionalModifiers.includes(item.om_cat_id)
  //     );
  //   }

  //   return [];
  // };

  // const handleAddItem = () => {
  //   const { menuItems } = this.props;
  //   const item = menuItems.find(({ id }) => this.state.item.id === id);
  //   const { forcedPrice, optionalPrice } = this.state;
  //   const modifier = {
  //     forcedModifier: this.state.selectedForcedModifier,
  //     optionalModifier: this.state.selectedOptionalModifier,
  //   };
  //   const subTotal = forcedPrice + optionalPrice + Number(item.price);

  //   console.log("modifiers in handleAddItem", modifier);

  //   this.setState(
  //     {
  //       forcedPrice: 0,
  //       optionalPrice: 0,
  //     },
  //     () => {
  //       this.props.addItem(item, modifier, subTotal, this.props.restaurantInfo);
  //       this.props.onCloseModal();
  //     }
  //   );
  // };

  const handleForcedModifierSelectionChange = (
    selectedForcedModifier,
    forcedPrice
  ) => {
    setState({ ...state, selectedForcedModifier, forcedPrice });
    console.log("selection change", state);
  };

  // const handleOptionalModifierSelectionChange = (
  //   selectedOptionalModifier,
  //   optionalPrice
  // ) => {
  //   this.setState({
  //     selectedOptionalModifier,
  //     optionalPrice,
  //   });
  // };

  const isPriceWithoutTax = () => {
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  };

  // const getActualPrice = (item) => {
  //   if (this.props.restaurantInfo) {
  //     return this.isPriceWithoutTax()
  //       ? Number(item.price)
  //       : truncateDecimal(
  //           Number(item.price) +
  //             Number(
  //               getTaxes(item, Number(item.price), this.props.restaurantInfo)
  //                 .tax
  //             )
  //         );
  //   }

  //   return 0;
  // };

  const getModifierPrice = (price) => {
    truncateDecimal(
      Number(price) +
        Number(getTaxes(state.item, Number(price), menu.restaurantInfo).tax)
    );
    //var isPriceWithoutTax = isPriceWithoutTax();
    // isPriceWithoutTax()
    //   ? price
    //   : truncateDecimal(
    //       Number(price) +
    //         Number(getTaxes(state.item, Number(price), menu.restaurantInfo).tax)
    //     );
  };

  // const getPrice = (item, price) => {
  //   return this.isPriceWithoutTax()
  //     ? truncateDecimal(price)
  //     : truncateDecimal(
  //         Number(price) +
  //           Number(getTaxes(item, Number(price), this.props.restaurantInfo).tax)
  //       );
  // };

  // const getTotalPrice = (item) => {
  //   const { forcedPrice, optionalPrice } = this.state;
  //   const { price } = item;
  //   const modifierPrice = forcedPrice + optionalPrice;
  //   const result = modifierPrice
  //     ? modifierPrice + Number(price)
  //     : this.getActualPrice(item);

  //   return modifierPrice ? this.getPrice(item, result) : result;
  // };

  // const isConfirmationDisabled = () => {
  //   const forcedModifers = this.getForcedModifiers();
  //   const { selectedForcedModifier } = this.state;

  //   if (forcedModifers && forcedModifers.length) {
  //     return (
  //       !selectedForcedModifier ||
  //       (selectedForcedModifier &&
  //         forcedModifers.length !== selectedForcedModifier.length)
  //     );
  //   }

  //   return false;
  // };

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
            // radioSelect={radioSelect}
            // forcedModifier={getForcedModifiers(item)}
            // detours={item.detour_ids}
            // symbol={menu.restaurantInfo.monetary_symbol}

            currency={menu.restaurantInfo.currency}
            isPriceWithoutTax={isPriceWithoutTax()}
            item={item}
            forcedModifiers={getForcedModifiers()}
            detours={item.detour_ids}
            getModifierPrice={getModifierPrice()}
            onSelectionChange={handleForcedModifierSelectionChange}
          />
          {/* <OptionalModifiers
            optionalModifier={getOptionalModifiers(item)}
            symbol={menu.restaurantInfo.monetary_symbol}
          /> */}
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
