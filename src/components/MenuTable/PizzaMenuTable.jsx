import React, { useState } from "react";
import { Button } from "react-scroll";
//import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import { modalNames } from "../../components/AppModal/constants";
import { openModal, closeModal } from "../../state-management/modal/actions";
import MenuModal from "../../containers/Modals/DishModal/DishModal";
import { addItem } from "../../state-management/menu/actions";
import { isHappyHourStillActive } from "../../state-management/menu/utils";
import DishModal from "../../containers/Modals/DishModal/DishModal";
import { getTaxes } from "../../state-management/menu/operations";
import { truncateDecimal } from "../../state-management/menu/utils";
import { connect } from "react-redux";

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
            ? item.similarItems[i].happyHourItem.subTotal
            : item.similarItems[i].happyHourItem.grandTotal;
        }

        return Number(totalPrice).toFixed(3);
      } else {
        return this.isPriceWithoutTax()
          ? Number(item.happyHourItem.subTotal).toFixed(3)
          : Number(item.happyHourItem.grandTotal).toFixed(3);
      }
    } else if (item.subTotal && item.grandTotal) {
      if (item.similarItems && item.similarItems.length > 0) {
        let totalPrice = 0;

        for (let i = 0; i < item.similarItems.length; i++) {
          totalPrice += this.isPriceWithoutTax()
            ? item.similarItems[i].subTotal || item.similarItems[i].price
            : item.similarItems[i].grandTotal ||
              this.getActualPrice(item.similarItems[i]);
        }

        return Number(totalPrice).toFixed(3);
      } else {
        return this.isPriceWithoutTax()
          ? Number(item.subTotal || item.price).toFixed(3)
          : Number(item.grandTotal).toFixed(2) ||
              Number(this.getActualPrice(item)).toFixed(3);
      }
    }
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

  render() {
    return (
      <>
        <h3
          className="nomargin_top"
          //id={category_name}
          style={{ color: "#5B53CD" }}
        >
          {/* {category_name} */}Pizza
        </h3>
        <p>Description for pizzas</p>
        <table className="table table-striped cart-list">
          <thead>
            <tr>
              <th>Item</th>

              <th>Price</th>

              {/* <th>Price</th> */}
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            {console.log("list is", this.props.list)}
            {this.props.list.map((item) => {
              let isStillActive = false;
              const sizeAndBaseCollection = this.getSizeAndBase(item);
              console.log("price is", sizeAndBaseCollection);
              //item.price = sizeAndBaseCollection[0].totalPrice;

              //item.price = sizeAndBaseCollection[0].totalPrice;
              {
                if (item.size)
                  return (
                    <tr>
                      <td>
                        <figure className="thumb_menu_list">
                          <img
                            style={{ marginTop: "10px" }}
                            src={item?.image ?? "https://cutt.ly/gkb8C6Z"}
                            alt="thumb"
                          />
                        </figure>
                        <h5 style={{ marginTop: "20px" }}>
                          {item.cname || item.name || item.title}
                        </h5>
                        <p>{item?.description || item.happyHourDisplayText}</p>
                      </td>

                      <td>
                        <strong>
                          {this.props.restaurantInfo.monetary_symbol}&nbsp;
                          {sizeAndBaseCollection[0].totalPrice}
                        </strong>
                        {/* {item.qty ? (
                          <span className="sub-total-price">
                            {this.props.restaurantInfo.monetary_symbol}&nbsp;
                            {truncateDecimal(
                              this.getItemPrice(item, isStillActive)
                            )}
                          </span>
                        ) : null} */}
                      </td>

                      <td className="options">
                        <>
                          <div style={{ display: "flex" }}>
                            {item.isPizza ? (
                              <button
                                style={{
                                  background: "#5B53CD",
                                  color: "whitesmoke",
                                  fontSize: "1rem",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "20%",
                                  border: "none",
                                  outline: "none",
                                  //paddingTop: "-15px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
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
                                <span style={{ display: "block" }}>+</span>
                              </button>
                            ) : null}
                          </div>
                        </>
                      </td>
                    </tr>
                  );
              }
            })}
          </tbody>
        </table>
        <hr />
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
