import React, { useState } from "react";
import { Button } from "react-scroll";
//import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import { modalNames } from "../../components/AppModal/constants";
import { openModal, closeModal } from "../../state-management/modal/actions";
import MenuModal from "../../containers/Modals/DishModal/DishModal";
import { addItem, removeItem } from "../../state-management/menu/actions";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import DishModal from "../../containers/Modals/DishModal/DishModal";
import { getTaxes } from "../../state-management/menu/operations";
import { truncateDecimal } from "../../state-management/menu/utils";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import RemoveIcon from "@material-ui/icons/Remove";
import img1 from "./388@2x.png";
import img2 from "./387@2x.png";
import img3 from "./389@2x.png";
import img4 from "./391@2x.png";
import img5 from "./390@2x.png";
class PizzaMenuTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.refIndex = -1;
    this.timeOutRef = Array.from({ length: 1000 }, () => React.createRef());
  }

  getPizzaActualPrice(pizza, price) {
    return this.isPriceWithoutTax()
      ? Number(price).toFixed(2)
      : (
          Number(price).toFixed(3) +
          Number(getTaxes(pizza, Number(price), this.props.restaurantInfo).tax)
        ).toFixed(3);
  }

  isPriceWithoutTax() {
    return Number(this.props.restaurantInfo["price_without_tax_flag"]).toFixed(
      3
    );
  }

  getItemPrice(item, isStillActive) {
    if (item.happyHourItem && isStillActive) {
      if (item.similarItems && item.similarItems.length > 0) {
        let totalPrice = 0;

        for (let i = 0; i < item.similarItems.length; i++) {
          totalPrice += this.isPriceWithoutTax()
            ? item.similarItems[i].happyHourItem.grandTotal
            : item.similarItems[i].happyHourItem.grandTotal;
        }

        return Number(totalPrice).toFixed(3);
      } else {
        return this.isPriceWithoutTax()
          ? Number(item.happyHourItem.grandTotal).toFixed(3)
          : Number(item.happyHourItem.grandTotal).toFixed(3);
      }
    } else if (item.subTotal && item.grandTotal) {
      if (item.similarItems && item.similarItems.length > 0) {
        let totalPrice = 0;

        for (let i = 0; i < item.similarItems.length; i++) {
          totalPrice += this.isPriceWithoutTax()
            ? item.similarItems[i].grandTotal || item.similarItems[i].price
            : item.similarItems[i].grandTotal ||
              this.getActualPrice(item.similarItems[i]);
        }

        return Number(totalPrice).toFixed(3);
      } else {
        return this.isPriceWithoutTax()
          ? Number(item.grandTotal || item.price).toFixed(3)
          : Number(item.grandTotal).toFixed(2) ||
              Number(this.getActualPrice(item)).toFixed(3);
      }
    }
  }

  getTotalPrice(pizza) {
    var tax = pizza / 100;
    var x = tax * 25;

    // console.log("actual price", typeof(this.isPriceWithoutTax()));
    return (Number(pizza) + Number(x)).toFixed(2);
  }

  getSizeAndBase(pizza) {
    const sizeAndBaseCollection = [];

    for (let i = 0; i < (pizza.size && pizza.size.length); i++) {
      const sizeBaseObj = {
        name: pizza.size[i].pizza_size,
        baseId: null,
        basePrice: 0,
        sizeId: pizza.size[i].pizza_size_id,
        sizePrice: this.getPizzaActualPrice(pizza, pizza.size[i].price),
        totalPrice: this.getPizzaActualPrice(pizza, pizza.size[i].price),
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
            basePrice: 0,
            baseId: null,
            sizeId: pizza.size[i].pizza_size_id,
            sizePrice: this.getPizzaActualPrice(pizza, pizza.size[i].price),
            totalPrice: this.getPizzaActualPrice(pizza, pizza.size[i].price),
          };

          sizeBaseObj.name += ` ${pizza.base[j].base_name}`;
          sizeBaseObj.baseId = pizza.base[j].base_id;
          const basePrice = pizza.base[j].base_price.find(
            (item) => item.base_size === pizza.size[i].pizza_size
          );

          sizeBaseObj.basePrice = this.getPizzaActualPrice(
            pizza,
            basePrice === undefined ? 0 : basePrice.base_price
          );
          sizeBaseObj.totalPrice =
            Number(sizeBaseObj.totalPrice) + Number(sizeBaseObj.basePrice);
          sizeAndBaseCollection.push(sizeBaseObj);
        }
      } else {
        sizeAndBaseCollection.push(sizeBaseObj);
      }
    }
    sizeAndBaseCollection.sort((a, b) => a.totalPrice - b.totalPrice);

    return sizeAndBaseCollection;
  }

  openPizzaModal(pizza, baseId, sizeId) {
    // open Pizza modal having default topppings
    // and half and half
    console.log("pizza qty is", pizza);
    if (pizza.qty) {
      this.props.openModal(modalNames.INTERMEDIATE_ADD_MODAL, {
        item: pizza,
        baseId,
        sizeId,
      });
    } else {
      this.props.openModal(modalNames.PIZZA_MODAL, {
        pizza,
        baseId,
        sizeId,
      });
    }
  }

  myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");

    moreText.style.display = "inline";
    btnText.style.display = "none";
  }

  removefromcart(item) {
    this.props.removeforpizza(item);
  }

  render() {
    return (
      <>
        <h4 className="category-name-head text-pizzamodal" id="Pizza">
          Pizza
        </h4>

        <>
          {this.props.list.map((item) => {
            console.log("pizza item", item);
            let isStillActive = false;

            var refIndex = -1;
            var timeOutRef = Array.from({ length: 100 }, () =>
              React.createRef()
            );
            if (item.isHappyHourActive) {
              const result = isHappyHourStillActive(
                item,
                this.props.restaurantInfo.timezone
              );

              isStillActive = result.isActive;
              if (isStillActive) {
                refIndex++;
                setTimer(result.distance, timeOutRef[refIndex]);
              }
            }
            const minQty =
              Number(item.min_qty) === 0 ? 0 : Number(item.min_qty);

            const sizeAndBaseCollection = this.getSizeAndBase(item);
            console.log("price is", sizeAndBaseCollection);
            //item.price = sizeAndBaseCollection[0].totalPrice;

            //item.price = sizeAndBaseCollection[0].totalPrice;
            if (item.size)
              return (
                <>
                  <div>
                    <div className="parent-menutable">
                      <div className="parent-flex">
                        <div className="left-menutable-img">
                          <div className="img-cover-menutable">
                            <img
                              className="food-image"
                              src={item?.image ?? "https://cutt.ly/gkb8C6Z"}
                              //src="https://cutt.ly/gkb8C6Z"
                            ></img>
                          </div>
                        </div>

                        <div className="food-details">
                          <div className="inner-food-details-div">
                            <div className="specific-food-details">
                              <h4 className="food-item-name">
                                {item.cname || item.name || item.title}
                              </h4>

                              <div className="food-icons">
                                <div className="food-icon-child">
                                  {item.lactose_free === "1" ? (
                                    <span title="Lactose Free">
                                      <img
                                        className="properties-img"
                                        alt="lactose free"
                                        src={img1}
                                      />
                                    </span>
                                  ) : null}
                                  {item.nuts_free === "1" ? (
                                    <span
                                      title="Nuts Free"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <img
                                        className="properties-img"
                                        alt="nuts free"
                                        src={img3}
                                      />
                                    </span>
                                  ) : null}
                                  {item.is_hot === "1" ? (
                                    <span
                                      title="Hot"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <img
                                        className="properties-img"
                                        alt="hot"
                                        src={img4}
                                      />
                                    </span>
                                  ) : null}
                                  {item.is_vegan === "1" ? (
                                    <span
                                      title="It's Vegan"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <img
                                        className="properties-img"
                                        alt="it's vegan"
                                        src={img5}
                                      />
                                    </span>
                                  ) : null}
                                  {item.gluten_free === "1" ? (
                                    <span
                                      title="Gluten Free"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <img
                                        className="properties-img"
                                        alt="gluten free"
                                        src={img2}
                                      />
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="item-price-parent-div">
                                <span className="item-price">
                                  {this.props.restaurantInfo.monetary_symbol}
                                  &nbsp;
                                  {this.getTotalPrice(
                                    sizeAndBaseCollection[0].totalPrice
                                  )}
                                </span>
                              </div>
                            </div>

                            {item.isPizza ? (
                              <>
                                {item.qty ? (
                                  <>
                                    <div className="after-first-add-container">
                                      <div className="after-first-add-parent">
                                        <div className="after-first-add-child">
                                          <div
                                            className="left-after-add"
                                            onClick={() =>
                                              this.removefromcart(item)
                                            }
                                          >
                                            <RemoveIcon fontSize="small" />
                                          </div>
                                          <div className="middle-after-add">
                                            <span className="qty-after-add">
                                              {item.qty}
                                            </span>
                                          </div>

                                          <div
                                            className="right-after-add"
                                            onClick={() =>
                                              this.openPizzaModal(
                                                item,
                                                isHappyHourStillActive(
                                                  item,
                                                  this.props.restaurantInfo
                                                    .timezone
                                                ).isActive
                                              )
                                            }
                                          >
                                            <AddIcon fontSize="small" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="specific-add-button">
                                    <div
                                      className="button-container"
                                      onClick={() =>
                                        this.openPizzaModal(
                                          item,
                                          isHappyHourStillActive(
                                            item,
                                            this.props.restaurantInfo.timezone
                                          ).isActive
                                        )
                                      }
                                    >
                                      <span className="add-to-cart-button">
                                        Add
                                      </span>
                                      <span className="add-to-cart-button-plus">
                                        <AddIcon />
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : null}
                          </div>
                          {item.isHappyHourActive && isStillActive ? (
                            <>
                              <p
                                className="food-description"
                                style={{ color: "red", fontWeight: "600" }}
                              >
                                {item.happyHourDetail.happyHourDisplayText}
                              </p>
                              <p className="food-description">
                                <AccessTimeIcon style={{ color: "red" }} />{" "}
                                &nbsp;{" "}
                                <span
                                  style={{ color: "red", fontWeight: "700" }}
                                  ref={timeOutRef[refIndex]}
                                />
                              </p>
                            </>
                          ) : null}

                          {item.description ? (
                            <>
                              <p className="food-description">
                                {item.description.slice(0, 100)}
                                <span id="dots">...</span>
                                <span
                                  id="myBtn"
                                  className="read-more"
                                  onClick={this.myFunction}
                                >
                                  read more
                                </span>
                                <p
                                  className="food-description"
                                  id="more"
                                  style={{ display: "none" }}
                                >
                                  {item.description.slice(101, 10000)}
                                </p>
                              </p>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              );
          })}
        </>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    restaurantInfo: state.main.selectedRestaurant,
    happyHourItems: state.menu.happyHours,
  };
}

const mapDispatchToProps = {
  openModal,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(PizzaMenuTable);
