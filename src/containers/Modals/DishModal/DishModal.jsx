import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { addItem, removeItem } from "../../../state-management/menu/actions";
import { truncateDecimal } from "../../../state-management/menu/utils";
import ForcedModifiers from "../../Modifiers/ForcedModifiers/ForcedModifiers";
import OptionalModifiers from "../../Modifiers/OptionalModifiers/OptionalModifiers";
// import ModalHeader from "./ModalHeader";
import FooterModifier from "./FooterModifier";
import "./DishModal.css";
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";
import { getTaxes } from "../../../state-management/menu/operations";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { openModal, closeModal } from "../../../state-management/modal/actions";
import { modalNames } from "../../../components/AppModal/constants";

const DishModal = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const modal = useSelector((state) => state.modal);
  const [modalM, setModalM] = useState(false);

  const [state, setState] = useState({
    selectedOptionalModifier: [],
    selectedForcedModifier: [],
    forcedPrice: 0,
    optionalPrice: 0,
    item: modal.modal.state.item,
  });

  const getForcedModifiers = () => {
    if (state.item.forced_modifier !== "0") {
      const itemForcedModifiers = state.item.forced_modifier.split(",");

      return menu.allForcedModifier.filter((item) =>
        itemForcedModifiers.includes(item.fm_cat_id)
      );
    }

    return [];
  };

  const getOptionModifiers = () => {
    if (state.item.optional_modifier !== "0") {
      const itemOptionalModifiers = state.item.optional_modifier.split(",");

      return menu.allOptionalModifier.filter((item) =>
        itemOptionalModifiers.includes(item.om_cat_id)
      );
    }

    return [];
  };

  const [detourid, setdetourid] = useState();

  useEffect(() => {
    console.log("check id", setdetourid);
  });
  const handleAddItem = () => {
    const current_item = modal.modal.state.item;
    const similarItems = menu.cart.filter(({ id }) => current_item.id === id);

    console.log("similar item in dish modal", similarItems);
    const menuItems = menu.menuItems;
    const item = menuItems.find(({ id }) => state.item.id === id);
    const { forcedPrice, optionalPrice } = state;
    const modifier = {
      forcedModifier: state.selectedForcedModifier,
      optionalModifier: state.selectedOptionalModifier,
    };
    const subTotal = forcedPrice + optionalPrice + Number(item.price);
    console.log("modifier in dish modal", modifier);

    console.log("modifiers in handleAddItem", modifier);
    console.log("item in modifier", item);
    console.log("subtotal in dish", subTotal);

    // if (modifier.forcedModifier[0].optionalModifiers[0].id) {
    //   setdetourid(modifier.forcedModifier[0].optionalModifiers[0].id);
    // }

    dispatch(addItem(item, modifier, subTotal, menu.restaurantInfo));
    dispatch(closeModal());

    setState({ ...state, forcedPrice: 0, optionalPrice: 0 });
  };

  const handleForcedModifierSelectionChange = (
    selectedForcedModifier,
    forcedPrice
  ) => {
    setState({ ...state, selectedForcedModifier, forcedPrice });
    console.log("selection change", state);
  };

  const handleOptionalModifierSelectionChange = (
    selectedOptionalModifier,
    optionalPrice
  ) => {
    setState({ ...state, selectedOptionalModifier, optionalPrice });
  };

  const isPriceWithoutTax = () => {
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  };

  const getActualPrice = (item) => {
    if (menu.restaurantInfo) {
      return isPriceWithoutTax()
        ? Number(item.price)
        : truncateDecimal(
            Number(item.price) +
              Number(
                getTaxes(item, Number(item.price), menu.restaurantInfo).tax
              )
          );
    }

    return 0;
  };

  const getModifierPrice = (price) =>
    isPriceWithoutTax()
      ? price
      : truncateDecimal(
          Number(price) +
            Number(getTaxes(state.item, Number(price), menu.restaurantInfo).tax)
        );

  const getPrice = (item, price) => {
    return isPriceWithoutTax()
      ? truncateDecimal(price)
      : truncateDecimal(
          Number(price) +
            Number(getTaxes(item, Number(price), menu.restaurantInfo).tax)
        );
  };

  const getTotalPrice = (item) => {
    const { forcedPrice, optionalPrice } = state;
    const { price } = item;
    const modifierPrice = forcedPrice + optionalPrice;
    const result = modifierPrice
      ? modifierPrice + Number(price)
      : getActualPrice(item);

    return modifierPrice ? getPrice(item, result) : result;
  };

  const isConfirmationDisabled = () => {
    const forcedModifers = getForcedModifiers();
    const { selectedForcedModifier } = state;

    if (forcedModifers && forcedModifers.length) {
      return (
        !selectedForcedModifier ||
        (selectedForcedModifier &&
          forcedModifers.length !== selectedForcedModifier.length)
      );
    }

    return false;
  };

  // renderFooter() {
  //   const { menuItems } = this.props;
  //   const item = menuItems.find(({ id }) => this.state.item.id === id);
  //   console.log(
  //     "Forced modifiers with Detours ",
  //     this.state.selectedForcedModifier
  //   );
  //   console.log(
  //     "Optional modifiers with Detours ",
  //     this.state.selectedOptionalModifier
  //   );
  //   console.log("Detours ", this.state.item.detour_ids);
  //   return (
  //
  //   );
  // }

  const menuItems = menu.menuItems;
  console.log("menu item", menuItems);
  const itemForFooter = menuItems.find(({ id }) => state.item.id === id);
  console.log("Forced modifiers with Detours ", state.selectedForcedModifier);
  console.log(
    "Optional modifiers with Detours ",
    state.selectedOptionalModifier
  );
  console.log("Detours ", state.item.omCats);

  useEffect(() => {
    console.log("omCats", state.item);
  }, [state]);

  const toggle = () => {
    setModalM(!modalM);
    dispatch(closeModal());
  };
  return (
    <>
      <Modal
        isOpen={true}
        toggle={toggle}
        style={{ top: "15%", left: "2%", width: "35%", borderRadius: "20px" }}
      >
        <ModalHeader toggle={toggle} style={{ borderBottom: "none" }}>
          <span
            style={{ fontSize: "20px", fontWeight: "700", marginLeft: "16px" }}
          >
            {state.item.name}
          </span>
        </ModalHeader>
        <ModalBody
          style={{
            maxHeight: "400px",
            overflowY: "scroll",
            marginTop: "-15px",
          }}
        >
          <ForcedModifiers
            currency={menu.restaurantInfo.currency}
            isPriceWithoutTax={isPriceWithoutTax()}
            item={state.item}
            forcedModifiers={getForcedModifiers()}
            detours={state.item.detour_ids}
            getModifierPrice={getModifierPrice}
            onSelectionChange={handleForcedModifierSelectionChange}
          />
          {console.log("detour id", state.item.detour_ids)}
          <OptionalModifiers
            getModifierPrice={getModifierPrice}
            currency={menu.restaurantInfo.currency}
            optionalModifier={getOptionModifiers()}
            onSelectionChange={handleOptionalModifierSelectionChange}
          />
        </ModalBody>
        {console.log("confirm disabke is", isConfirmationDisabled)}
        <FooterModifier
          buttonTitle={`ADD TO ORDER - ${
            menu.restaurantInfo.currency
          } ${getTotalPrice(itemForFooter)}`}
          btnCls="cart"
          disabled={isConfirmationDisabled()}
          onClick={handleAddItem}
        />
      </Modal>
    </>
  );
  return (
    <>
      <div className="dish-modal">
        <ModalHeader
          title={state.item.name}
          //onClose={this.props.onCloseModal}
        />
        {/* <SimpleBarReact className="main-content">
          <div className="modifiers-list">
            <h1>Check</h1>
            <ForcedModifier
              currency={menu.restaurantInfo.currency}
              isPriceWithoutTax={isPriceWithoutTax()}
              item={state.item}
              forcedModifiers={getForcedModifiers()}
              detours={state.item.detour_ids}
              getModifierPrice={getModifierPrice}
              onSelectionChange={handleForcedModifierSelectionChange}
            />
            <OptionalModifier
              getModifierPrice={getModifierPrice}
              currency={menu.restaurantInfo.currency}
              optionalModifier={getOptionModifiers()}
              onSelectionChange={handleOptionalModifierSelectionChange}
            />
          </div>
        </SimpleBarReact>
        <ModalFooter
          buttonTitle={`ADD TO ORDER - ${
            menu.restaurantInfo.currency
          } ${getTotalPrice(itemForFooter)}`}
          btnCls="cart"
          disabled={isConfirmationDisabled()}
          onClick={handleAddItem}
        /> */}
      </div>
    </>
  );
};

export default DishModal;

// function mapStateToProps(state) {
//   return {
//     allForcedModifier: state.menu.allForcedModifier,
//     allOptionalModifier: state.menu.allOptionalModifier,
//     currency: state.main.selectedRestaurant.monetary_symbol,
//     menuItems: state.menu.menuItems,
//     restaurantInfo: state.main.selectedRestaurant,
//   };
// }

// const mapDispatchToProps = {
//   addItem,
//   removeItem,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(DishModal);
