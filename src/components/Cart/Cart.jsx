import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, addItem } from "../../state-management/menu/actions";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import { showLoginFormMethod } from "../../state-management/user/actions";
import { getTaxes } from "../../state-management/menu/operations";
import Login from "../../components/Login/Login";
import { useHistory } from "react-router";
import ItemList from "./ItemList";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { suppressDeprecationWarnings } from "moment";
import { notification } from "antd";

const Cart = (props) => {
  const History = useHistory();
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  let isDecimalAmount = false;
  //const grandTotal = Number(getGrandTotal());
  const deliveryCharges = 0;

  // function getDeliveryCharges() {
  //   const {
  //     deliveryRange: { cost, range },
  //     isTakeAway,
  //     distance,
  //   } = main.deliveryRange;
  //   const freeDeliveryRangeAmount = cost["free_delivery_eligible_amount"];
  //   const stdDeliveryCost = cost["std_delivery_cost"] || 0;
  //   console.log(
  //     "check delivery",
  //     parseInt(cost["free_delivery_eligible_amount"]) === 0,
  //     parseInt(cost["std_delivery_cost"]) === 0,
  //     grandTotal
  //   );
  //   const isFreeDelivery =
  //     grandTotal >= Number(cost["free_delivery_eligible_amount"]) &&
  //     parseInt(freeDeliveryRangeAmount) !== 0;

  //   if (isFreeDelivery || isTakeAway) {
  //     props.setDeliveryCost(0);
  //     return 0;
  //   }
  //   if (distance === -1 || !range) {
  //     // if(stdDeliveryCost){
  //     props.setDeliveryCost(Number(stdDeliveryCost));
  //     // }
  //     return Number(stdDeliveryCost);
  //   }

  //   if (range) {
  //     const selectedRange = range.find((rng) => {
  //       const from = Number(rng["range_from"]);
  //       const to = Number(rng["range_to"]);

  //       return distance >= from && distance <= to;
  //     });

  //     // selectedRange
  //     //   ?( Number(selectedRange["delivery_cost"]) || 0)
  //     //   : Number(stdDeliveryCost);

  //     if (selectedRange) {
  //       if (selectedRange["delivery_cost"]) {
  //         props.setDeliveryCost(selectedRange["delivery_cost"]);
  //       } else {
  //         props.setDeliveryCost(0);
  //       }
  //     } else {
  //       props.setDeliveryCost(Number(stdDeliveryCost));
  //     }
  //     return selectedRange
  //       ? Number(selectedRange["delivery_cost"] || 0)
  //       : Number(stdDeliveryCost);
  //   }

  //   return 0;
  // }

  const dispatch = useDispatch();

  const truncateDecimal = (number) => {
    return Number.isInteger(Number(number))
      ? Number(number)
      : Number(number).toFixed(2);
  };

  function getSubTotal() {
    return menu.cart.length
      ? truncateDecimal(
          menu.cart.reduce((acc, item) => {
            if (
              isHappyHourStillActive(item, menu.restaurantInfo.timezone)
                .isActive &&
              item.happyHourItem
            ) {
              return (
                acc +
                (item.happyHourItem.subTotal
                  ? Number(item.happyHourItem.subTotal)
                  : Number(item.qty) * Number(item.price))
              );
            }

            return (
              acc +
              (item.subTotal ? item.subTotal : item.qty * Number(item.price))
            );
          }, 0)
        )
      : "";
  }

  function getSubTaxTotal() {
    return props.cartlist.length
      ? truncateDecimal(
          props.cartlist.reduce((acc, item) => {
            if (
              isHappyHourStillActive(item, menu.restaurantInfo.timezone)
                .isActive &&
              item.happyHourItem
            ) {
              return (
                acc +
                (item.happyHourItem.tax
                  ? item.happyHourItem.tax
                  : item.tax || 0)
              );
            }

            return acc + Number(item.tax || 0);
          }, 0)
        )
      : "";
  }

  function getGrandTotal() {
    return props.cartlist.length
      ? truncateDecimal(
          props.cartlist.reduce((acc, item) => {
            if (
              isHappyHourStillActive(item, props.restinfo.timezone).isActive &&
              item.happyHourItem
            ) {
              return (
                acc +
                Number(
                  item.happyHourItem.grandTotal
                    ? item.happyHourItem.grandTotal
                    : item.happyHourItem.subTotal
                )
              );
            }

            return acc + (item.grandTotal ? item.grandTotal : item.subTotal);
          }, 0)
        )
      : "";
  }

  // const getItemPrice = (item, isStillActive) => {
  //   if (item.happyHourItem && isStillActive) {
  //     if (item.similarItems && item.similarItems.length > 0) {
  //       let totalPrice = 0;

  //       for (let i = 0; i < item.similarItems.length; i++) {
  //         totalPrice =
  //           totalPrice + isPriceWithoutTax()
  //             ? item.similarItems[i].happyHourItem.subTotal
  //             : item.similarItems[i].happyHourItem.grandTotal;
  //       }

  //       return Number(totalPrice).toFixed(2);
  //     } else {
  //       console.log("sub", Number(item.happyHourItem.subTotal).toFixed(2));
  //       console.log("grand", Number(item.happyHourItem.grandTotal).toFixed(2));
  //       return isPriceWithoutTax()
  //         ? Number(item.happyHourItem.subTotal).toFixed(2)
  //         : Number(item.happyHourItem.grandTotal).toFixed(2);
  //     }
  //   } else if (item.subTotal && item.grandTotal) {
  //     if (item.similarItems && item.similarItems.length > 0) {
  //       let totalPrice = 0;

  //       for (let i = 0; i < item.similarItems.length; i++) {
  //         totalPrice =
  //           totalPrice + isPriceWithoutTax()
  //             ? item.similarItems[i].subTotal || item.similarItems[i].price
  //             : item.similarItems[i].grandTotal ||
  //               getActualPrice(item.similarItems[i]);
  //       }

  //       return Number(totalPrice).toFixed(2);
  //     } else {
  //       console.log(
  //         "log",
  //         isPriceWithoutTax()
  //           ? item.subTotal || item.price
  //           : item.grandTotal || this.getActualPrice(item)
  //       );
  //       return isPriceWithoutTax()
  //         ? item.subTotal || item.price
  //         : item.grandTotal || this.getActualPrice(item);
  //     }
  //   }
  // };

  function getDiscountedPrice(item, isStillActive) {
    if (item.happyHourItem && isStillActive) {
      const itemPrice = item.subTotal;
      const itemHappyHourPrice = item.happyHourItem.subTotal;

      return truncateDecimal(itemPrice - itemHappyHourPrice);
    }

    return 0;
  }

  const isPriceWithoutTax = () => {
    console.log(
      "price without tax",
      menu.restaurantInfo["price_without_tax_flag"]
    );
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  };

  const getActualPrice = (item) => {
    if (menu.restaurantInfo) {
      // console.log("actual price", typeof(this.isPriceWithoutTax()));
      return isPriceWithoutTax()
        ? item.price
        : (
            Number(item.price) +
            Number(getTaxes(item, item.price, menu.restaurantInfo).tax)
          ).toFixed(2);
    }

    return 0;
  };

  const getBillAmount = () => {
    const finalAmount = (
      Number(deliveryCharges) + Number(getGrandTotal())
    ).toFixed(2);
    const showAmountInDecimal =
      Number(menu.restaurantInfo["show_prices_in_decimal_flag"]) === 1;

    if (showAmountInDecimal) {
      isDecimalAmount = true;
    } else {
      isDecimalAmount = finalAmount % 1 === 0;
    }

    return !showAmountInDecimal && finalAmount % 1 !== 0
      ? finalAmount
      : finalAmount;
  };

  const removeFromCart = (item) => {
    // dispatch(removeItem(item, item.modifiers, 0, menu.restaurantInfo));
    dispatch(removeItem(item, item.modifiers || null, 0, menu.restaurantInfo));
  };

  const addItemToCart = (item) => {
    dispatch(
      addItem(item, item.modifiers || 0, item.subTotal, menu.restaurantInfo)
    );
  };

  const callLoginForm = () => {
    dispatch(showLoginFormMethod());
  };

  const [warning, setwarning] = useState(false);
  const grandTotal = Number(getGrandTotal());
  const goToCheckout = () => {
    if (main.isClosed) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Oops ! Restaurant is closed. Please Try Agin Later.",
      });
    } else {
      History.push(`/restId=${menu.restaurantInfo.restaurant_id}/checkout`);
    }
  };

  return (
    <div id="cart_box">
      <h3 style={{ backgroundColor: "#6244da", color: "white" }}>
        Your order <ShoppingCartIcon style={{ float: "right" }} />
      </h3>

      <ItemList
        items={menu.cart}
        currency={menu.restaurantInfo.monetary_symbol}
        isPriceWithoutTax={
          Number(menu.restaurantInfo["price_without_tax_flag"]) == 1
        }
        timezone={menu.restaurantInfo.timezone}
        onRemove={removeFromCart}
        onAdd={addItemToCart}
        //onDelete={props.removeCartItem}
      />

      {/* <div className="row" id="options_2">
        <div className="col-xl-4 col-md-12 col-sm-12 col-4">
          <label>
            <input
              type="radio"
              defaultValue
              value="delivery"
              onChange={(e) => setradioval(e.target.value)}
              defaultChecked
              name="option_2"
              className="icheck"
            />
            Delivery
          </label>
        </div> */}
      {/* <div className="col-xl-4 col-md-12 col-sm-12 col-4">
          <label>
            <input
              type="radio"
              value="eatin"
              onChange={(e) => setradioval(e.target.value)}
              defaultValue
              name="option_2"
              className="icheck"
            />
            Eat In
          </label>
        </div> */}

      {/* <div className="col-xl-4 col-md-12 col-sm-12 col-4">
          <label>
            <input
              type="radio"
              value="takeaway"
              onChange={(e) => setradioval(e.target.value)}
              defaultValue
              name="option_2"
              className="icheck"
            />
            Take Away
          </label>
        </div>
        {console.log("value of radio is", radioval)}
      </div> */}
      {/* Edn options 2 */}
      <hr />
      <table className="table table_summary">
        <tbody>
          <tr>
            <td>
              Subtotal{" "}
              <span className="float-right">{`${
                props.restinfo.monetary_symbol
              }${getSubTotal()}`}</span>
            </td>
          </tr>
          <tr>
            <td>
              Taxes{" "}
              <span className="float-right">{`${
                props.restinfo.monetary_symbol
              }${getSubTaxTotal()}`}</span>
            </td>
          </tr>
          {/* {radioval == "takeaway" || radioval == "eatin" ? (
            <tr>
              <td style={{ display: "none" }}>
                Delivery Charges <span className="float-right">0</span>
              </td>
            </tr>
          ) : (
            <tr>
              <td>
                Delivery Charges <span className="float-right">0</span>
              </td>
            </tr>
          )} */}
          {/* <tr>
            <td>
              Delivery Charges <span className="float-right">0</span>
            </td>
          </tr> */}
          <tr>
            <td className="total">
              TOTAL{" "}
              <span className="float-right">{`${
                props.restinfo.monetary_symbol
              }${getBillAmount()}`}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      {/* {warning ? (
        <>
          <p style={{ color: "red" }}>
            Minimum cart amount is{" "}
            {main.selectedRestaurant.cost["min_order_amount"]}
          </p>
        </>
      ) : null} */}
      {user.user.isUserLoggedIn ? (
        <button
          onClick={goToCheckout}
          className="btn_full"
          href="cart.html"
          style={{ backgroundColor: "#5B53CD" }}
        >
          Checkout
        </button>
      ) : (
        <button
          onClick={callLoginForm}
          className="btn_full"
          href="cart.html"
          style={{ backgroundColor: "#5B53CD" }}
        >
          Proceed to Login
        </button>
      )}
    </div>
  );
};
export default Cart;
