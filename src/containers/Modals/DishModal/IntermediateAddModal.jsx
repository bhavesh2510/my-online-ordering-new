import React from "react";
import { connect, useDispatch } from "react-redux";
import { addItem } from "../../../state-management/menu/actions";
import { openModal, closeModal } from "../../../state-management/modal/actions";

//import "./IntermediateAddModal.scss";
import { ADD_NEW, REPEATE_LAST, HEADER_TITLE, EXTRAS } from "../constants";
import { modalNames } from "../../../components/AppModal/constants";
import RenderModifiers from "../../../containers/Modifiers/RenderModifiers";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class IntermediateAddModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { item: props.modalState.item };
  }

  handleAddNew = () => {
    this.props.onCloseModal();
    if (this.state.item.isPizza) {
      this.props.openModal(modalNames.PIZZA_MODAL, { pizza: this.state.item });
    } else {
      this.props.openModal(modalNames.DISH_MODAL, { item: this.state.item });
    }
  };

  // toggle() {
  //   this.props.toggle();
  // }

  handleRepeatLast = () => {
    const { item } = this.state;
    const similarItems = this.props.cart.filter(({ id }) => item.id === id);
    console.log("similar items in repeat last", item);
    const lastItem = similarItems[similarItems.length - 1] || item;
    console.log("last item is", lastItem);

    this.props.addItem(
      lastItem,
      lastItem.modifiers || null,
      lastItem.subTotal,
      this.props.restaurantInfo
    );
    this.props.onCloseModal();
  };

  renderModifiers() {
    const { item } = this.state;
    const similarItems = this.props.cart.filter(({ id }) => item.id === id);
    const { modifiers } = similarItems[similarItems.length - 1] || item;

    return (
      <>
        <label>{EXTRAS}</label>
        <RenderModifiers modifier={modifiers} />
      </>
    );
  }

  renderPizzaDetails() {
    const { item } = this.state;
    const similarItems = this.props.cart.filter(({ id }) => item.id === id);

    let defaultToppings = "";

    let optionalToppings = "";

    let halfAndHalf = "";

    const similarItem = similarItems[similarItems.length - 1] || item;

    for (let i = 0; i < similarItem.defaultToppings.length; i++) {
      defaultToppings += ` ,${similarItem.defaultToppings[i].topping_name}`;
    }
    defaultToppings = defaultToppings.replace(/[\s,]+/, " ").trim();

    for (let i = 0; i < similarItem.optionalToppings.length; i++) {
      optionalToppings += ` ,${similarItem.optionalToppings[i].topping_name}`;
    }
    optionalToppings = optionalToppings.replace(/[\s,]+/, " ").trim();

    if (similarItem.firstHalf !== null) {
      halfAndHalf = `First Half: ${similarItem.firstHalf.topping_name},`;
      halfAndHalf += ` Second Half: ${similarItem.secondHalf.topping_name}`;
    }

    return (
      <>
        <section className="size-and-base-section">
          <label>Size & Base: {similarItem.selectedBase.name}</label>
        </section>
        <section className="toppings-list">
          {defaultToppings !== "" ? <label>Default Toppings: </label> : null}
          <span>{defaultToppings}</span>
          <br />
          {optionalToppings !== "" ? <label>Optional Toppings: </label> : null}
          <span>{optionalToppings}</span>
        </section>
        <section className="toppings-list">
          {halfAndHalf !== "" ? <label>Half And Half Choice: </label> : null}
          <span>{halfAndHalf}</span>
        </section>
      </>
    );
  }

  // renderFooter() {
  //   return (
  //     <footer>
  //       <button className="add-new" onClick={this.handleAddNew}>
  //         {ADD_NEW}
  //       </button>
  //       <button className="repeat-last" onClick={this.handleRepeatLast}>
  //         {REPEATE_LAST}
  //       </button>
  //     </footer>
  //   );
  // }

  render() {
    return (
      <>
        <Modal
          isOpen={true}
          toggle={this.props.onCloseModal}
          style={{ top: "10%", left: "2%" }}
        >
          <ModalHeader toggle={this.props.onCloseModal}>
            {this.state.item.name}
          </ModalHeader>
          <ModalBody style={{ maxHeight: "400px", overflowY: "scroll" }}>
            {this.state.item.isPizza
              ? this.renderPizzaDetails()
              : this.renderModifiers()}
          </ModalBody>
          <ModalFooter>
            <button
              style={{ backgroundColor: "black", color: "white" }}
              className="add-new"
              onClick={this.handleAddNew}
            >
              ADD NEW
            </button>
            <button
              style={{ backgroundColor: "black", color: "white" }}
              className="repeat-last"
              onClick={this.handleRepeatLast}
            >
              REPEAT LAST
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart: state.menu.cart,
    restaurantInfo: state.main.selectedRestaurant,
  };
}

const mapDispatchToProps = {
  addItem,
  openModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntermediateAddModal);
