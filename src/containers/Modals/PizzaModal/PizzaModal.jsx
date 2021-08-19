import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { fetchToppings } from "../../../state-management/menu/asyncActions";
import { addItem } from "../../../state-management/menu/actions";
// import Toppings from './Toppings';
import HalfAndHalf from "./HalfAndHalf/HalfAndHalf";
import SizeAndBase from "../PizzaModal/SizeAndBase/SizeAndBase";
// import { AppLoader } from '../../../components/AppLoader';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { openModal, closeModal } from "../../../state-management/modal/actions";
import "../../Modals/PizzaModal/PizzaModal.css";
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";
import { getPizzaActualPrice } from "../../../state-management/menu/operations";
import Toppings from "../PizzaModal/Toppings/Toppings";
import FooterModifier from "../DishModal/FooterModifier";
import CloseIcon from "@material-ui/icons/Close";
import WaitingOverlay from "../../../components/WaitingOverlay/WaitingOverlay";

class PizzaModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptionalToppings: [],
      selectedDefaultToppings: [],
      selecteBaseId: null,
      selectedSizeId: null,
      halfAndHalfPizzaList: [],
      pizza: props.modalState.pizza,
      toppingsList: {},
      sizeAndBaseList: [],
      firstHalf: null,
      secondHalf: null,
      isToppingFetched: false,
    };
  }

  async componentDidMount() {
    const restaurantId = this.props.restaurantInfo["restaurant_id"];
    console.log("pixxa is", this.state.pizza);
    const sizeAndBaseList = this.getSizeAndBase(
      this.state.pizza,
      this.props.restaurantInfo
    );

    this.setState({
      sizeAndBaseList,
      selecteBaseId: sizeAndBaseList[0].baseId,
      selectedSizeId: sizeAndBaseList[0].sizeId,
    });

    const requestData = {
      restaurant_id: restaurantId,
      pizza_id: this.state.pizza.pizza_id,
      size: sizeAndBaseList[0].sizeId,
    };

    const { payload } = await this.props.fetchToppings(requestData);

    this.setState({ isToppingFetched: true });
    if (payload) {
      const toppingsList = {};

      toppingsList.defaultToppings = payload.default_toppings;
      toppingsList.optionalToppings = payload.toppings;

      this.setState({
        toppingsList,
        selectedDefaultToppings: toppingsList.defaultToppings,
        halfAndHalfPizzaList: payload.halfnhalf,
        isToppingFetched: true,
      });

      console.log("pizza state is", this.state);
    }
    //throw error if no information is available
  }

  getSizeAndBase = (pizza) => {
    const sizeAndBaseCollection = [];

    for (let i = 0; i < pizza.size.length; i++) {
      const sizeBaseObj = {
        name: pizza.size[i].pizza_size,
        baseId: null,
        sizeValue: pizza.size[i].pizza_size,
        basePrice: 0,
        sizeId: pizza.size[i].pizza_size_id,
        sizePrice: Number(pizza.size[i].price),
        totalPrice: Number(pizza.size[i].price),
      };

      // get the base price with base_size
      if (
        pizza.base !== undefined &&
        pizza.base !== null &&
        pizza.base !== "0" &&
        pizza.base !== 0
      ) {
        for (let j = 0; j < pizza.base.length; j++) {
          const sizeBaseObj = {
            name: pizza.size[i].pizza_size,
            sizeValue: pizza.size[i].pizza_size,
            basePrice: 0,
            baseId: null,
            sizeId: pizza.size[i].pizza_size_id,
            sizePrice: Number(pizza.size[i].price),
            totalPrice: Number(pizza.size[i].price),
          };

          sizeBaseObj.name += ` ${pizza.base[j].base_name}`;
          sizeBaseObj.baseId = pizza.base[j].base_id;
          const basePrice = pizza.base[j].base_price.find(
            (item) => item.base_size === pizza.size[i].pizza_size
          );

          sizeBaseObj.basePrice = Number(
            basePrice === undefined ? 0 : basePrice.base_price
          );
          sizeBaseObj.totalPrice =
            sizeBaseObj.totalPrice + sizeBaseObj.basePrice;
          sizeAndBaseCollection.push(sizeBaseObj);
        }
      } else {
        sizeAndBaseCollection.push(sizeBaseObj);
      }
    }
    sizeAndBaseCollection.sort((a, b) => a.totalPrice - b.totalPrice);

    return sizeAndBaseCollection;
  };

  getTotalPrice() {
    if (this.state.sizeAndBaseList.length === 0) {
      return 0;
    }

    const selectedSizePrice = this.state.sizeAndBaseList.find(
      (op) =>
        op.sizeId === this.state.selectedSizeId &&
        (op.baseId !== null ? op.baseId === this.state.selecteBaseId : true)
    ).totalPrice;

    let toppingsPrice = selectedSizePrice;
    const { firstHalf, secondHalf } = this.state;
    const halfNhalfPrize =
      (firstHalf ? Number(firstHalf["topping_price"]) : 0) +
      (secondHalf ? Number(secondHalf["topping_price"]) : 0);

    if (this.state.selectedOptionalToppings.length === 0) {
      return getPizzaActualPrice(
        this.state.pizza,
        toppingsPrice + halfNhalfPrize,
        this.props.restaurantInfo
      );
    }

    const toppings = [...this.state.selectedOptionalToppings];

    for (let i = 0; i < toppings.length; i++) {
      toppingsPrice += Number(toppings[i].topping_price);
    }

    return getPizzaActualPrice(
      this.state.pizza,
      toppingsPrice + halfNhalfPrize,
      this.props.restaurantInfo
    );
  }

  getNormalPrice() {
    if (this.state.sizeAndBaseList.length === 0) {
      return 0;
    }

    const selectedSizePrice = this.state.sizeAndBaseList.find(
      (op) =>
        op.sizeId === this.state.selectedSizeId &&
        op.baseId === this.state.selecteBaseId
    ).totalPrice;

    const { firstHalf, secondHalf } = this.state;
    const halfNhalfPrize =
      (firstHalf ? Number(firstHalf["topping_price"]) : 0) +
      (secondHalf ? Number(secondHalf["topping_price"]) : 0);

    let toppingsPrice = selectedSizePrice;

    if (this.state.selectedOptionalToppings.length === 0) {
      return toppingsPrice + halfNhalfPrize;
    }

    const toppings = [...this.state.selectedOptionalToppings];

    for (let i = 0; i < toppings.length; i++) {
      toppingsPrice += Number(toppings[i].topping_price);
    }

    return toppingsPrice + halfNhalfPrize;
  }

  isConfirmationDisabled() {
    const isHalfNHalf = this.state.halfAndHalfPizzaList.length > 0;

    if (
      (!isHalfNHalf && !this.state.isToppingFetched) ||
      (isHalfNHalf &&
        (this.state.firstHalf === null || this.state.secondHalf === null)) ||
      !this.state.isToppingFetched
    ) {
      return true;
    }

    return false;
  }

  handleSizeBaseChange = async (sizeBaseId) => {
    this.setState({ isToppingFetched: false });
    const sizeBase = sizeBaseId.split(",");
    console.log("id of pizza", sizeBase);

    if (sizeBase[0] === this.state.selectedSizeId) {
      this.setState({
        selecteBaseId: sizeBase[1] ? sizeBase[1] : null,
        selectedSizeId: sizeBase[0],
        isToppingFetched: true,
      });

      return;
    }

    const restaurantId = this.props.restaurantInfo["restaurant_id"];

    const requestData = {
      restaurant_id: restaurantId,
      pizza_id: this.state.pizza.pizza_id,
      size: sizeBase[0],
    };

    const { payload } = await this.props.fetchToppings(requestData);
    console.log("payload of toppings", payload);

    this.setState({ isToppingFetched: true });
    if (payload) {
      const toppingsList = {};

      toppingsList.defaultToppings = payload.default_toppings;
      toppingsList.optionalToppings = payload.toppings;

      this.setState({
        selecteBaseId: sizeBase[1] ? sizeBase[1] : null,
        selectedSizeId: sizeBase[0],
        selectedDefaultToppings: toppingsList.defaultToppings,
        toppingsList,
        firstHalf: null,
        secondHalf: null,
      });
    }
  };

  handleDefaultToppingsChange = (isChecked, topping) => {
    let newDefaultToppings = [];

    if (isChecked) {
      newDefaultToppings = [...this.state.selectedDefaultToppings];
      newDefaultToppings.push(topping);
    } else {
      newDefaultToppings = this.state.selectedDefaultToppings.filter((top) => {
        if (top.topping_id !== topping.topping_id) {
          return top;
        }
      });
    }
    this.setState({ selectedDefaultToppings: newDefaultToppings });
  };

  handleOptionalToppingsChange = (isChecked, topping) => {
    let newOptionalToppings = [];

    if (isChecked) {
      newOptionalToppings = [...this.state.selectedOptionalToppings];
      newOptionalToppings.push(topping);
    } else {
      newOptionalToppings = this.state.selectedOptionalToppings.filter(
        (top) => {
          if (top.topping_id !== topping.topping_id) {
            return top;
          }
        }
      );
    }
    this.setState({ selectedOptionalToppings: newOptionalToppings });
  };

  handleHalfAndHalfChange = (selected, item) => {
    if (selected.includes("1-")) {
      const secondHalf =
        this.state.secondHalf &&
        this.state.secondHalf.topping_id === item.topping_id
          ? null
          : this.state.secondHalf;

      this.setState({
        firstHalf: item,
        secondHalf,
      });
    } else {
      const firstHalf =
        this.state.firstHalf &&
        this.state.firstHalf.topping_id === item.topping_id
          ? null
          : this.state.firstHalf;

      this.setState({
        firstHalf,
        secondHalf: item,
      });
    }
  };

  handleAddItem = () => {
    const {
      pizza,
      firstHalf,
      secondHalf,
      selectedDefaultToppings,
      selectedOptionalToppings,
      sizeAndBaseList,
      selecteBaseId,
      selectedSizeId,
    } = this.state;
    const base = sizeAndBaseList.find(
      ({ baseId, sizeId }) =>
        (baseId ? baseId === selecteBaseId : true) && sizeId === selectedSizeId
    );
    const toppings = [...selectedDefaultToppings, ...selectedOptionalToppings];
    const subTotal = Number(this.getNormalPrice());

    let item = {
      ...pizza,
      productType: "Pizza",
      id: pizza.pizza_id,
      firstHalf,
      secondHalf,
      defaultToppings: selectedDefaultToppings,
      optionalToppings: selectedOptionalToppings,
      baseId: selecteBaseId,
      sizeId: selectedSizeId,
      size_value: base.sizeValue,
      selectedBase: base,
      toppingIdx1: toppings
        .map((item) => item["topping_id"])
        .sort((q1, q2) => Number(q1) - Number(q2))
        .join(","),
      subTotal,
      name: pizza.title,
    };

    if (firstHalf && secondHalf) {
      item = {
        ...item,
        first_half_toppings: firstHalf ? firstHalf["topping_id"] : null,
        second_half_toppings: secondHalf ? secondHalf["topping_id"] : null,
      };
    }

    this.props.addItem(item, null, subTotal, this.props.restaurantInfo);
    this.props.onCloseModal();
  };

  toggle = () => {
    this.props.onCloseModal();
  };

  render() {
    return (
      <>
        <Modal
          //className={custom - pizza - modal}
          size='lg'
          isOpen={true}
          toggle={this.toggle}
          style={{ top: "15%", left: "2%", width: "35%" }}
        >
          <ModalHeader>
            <img
              className='img-of-pizza-modal'
              // style={{ marginLeft: "-17px", marginTop: "-20px" }}
              src='https://i.ibb.co/qWc9P0d/piiza-3.jpg'
              // height="190px"
              // width="499px"
            />
            <div
              onClick={this.toggle}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "0px",
                right: "0px",
                backgroundColor: "white",
                borderRadius: "20px",
              }}
            >
              <CloseIcon
                className='pizza-modal-close'
                style={{ color: "black" }}
              />
            </div>
            <p
              className='text-pizzamodal'
              style={{
                fontWeight: "800",
                color: "#5c48d2",
                fontSize: "25px",
                marginTop: "20px",
              }}
            >
              {this.state.pizza.title}
            </p>
          </ModalHeader>
          <ModalBody style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <SizeAndBase
              currency={this.props.currency}
              onSelectionChange={this.handleSizeAndBaseSelectionChange}
              sizeAndBaseList={this.state.sizeAndBaseList}
              handleSizeBaseChange={this.handleSizeBaseChange}
            />
            {this.state.halfAndHalfPizzaList.length > 0 ? (
              <HalfAndHalf
                currency={this.props.currency}
                pizza={this.state.pizza}
                halfAndHalfPizzaList={this.state.halfAndHalfPizzaList}
                restaurantInfo={this.props.restaurantInfo}
                firstHalfId={
                  this.state.firstHalf ? this.state.firstHalf.topping_id : null
                }
                secondHalfId={
                  this.state.secondHalf
                    ? this.state.secondHalf.topping_id
                    : null
                }
                handleHalfAndHalfChange={this.handleHalfAndHalfChange}
              />
            ) : null}

            {this.state.toppingsList.defaultToppings ? (
              <Toppings
                pizza={this.state.pizza}
                currency={this.props.currency}
                toppingsList={this.state.toppingsList}
                selectedDefaultToppings={this.state.selectedDefaultToppings}
                restaurantInfo={this.props.restaurantInfo}
                handleDefaultToppingsChange={this.handleDefaultToppingsChange}
                handleOptionalToppingsChange={this.handleOptionalToppingsChange}
              />
            ) : null}
          </ModalBody>

          <FooterModifier
            buttonTitle={`ADD TO ORDER - ${this.props.currency} ${Number(
              this.getTotalPrice()
            ).toFixed(2)}`}
            btnCls='cart'
            disabled={this.isConfirmationDisabled()}
            onClick={this.handleAddItem}
          />
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    currency: state.main.selectedRestaurant.monetary_symbol,
    menuItems: state.menu.pizzas,
    restaurantInfo: state.main.selectedRestaurant,
    isLoading: state.menu.isLoading,
  };
}

const mapDispatchToProps = {
  fetchToppings,
  addItem,
  // removePizza,
};

export default connect(mapStateToProps, mapDispatchToProps)(PizzaModal);
