import React from "react";
import {
  isHappyHourStillActive,
  setTimer,
  truncateDecimal,
} from "../../state-management/menu/utils";
import { useDispatch, useSelector } from "react-redux";
import { getTaxes } from "../../state-management/menu/operations";
import RenderModifiers from "../../containers/Modifiers/RenderModifiers";
import "./Cart.css";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
const ItemList = ({
  items,
  currency,
  isPriceWithoutTax,
  timezone,
  onRemove,
  onAdd,
}) => {
  const timeOutRef = Array.from({ length: 100 }, () => React.createRef());
  const menu = useSelector((state) => state.menu);
  let refIndex = -1;

  function getDiscountedPrice(item, isStillActive) {
    if (item.happyHourItem && isStillActive) {
      const itemPrice = item.subTotal;
      const itemHappyHourPrice = item.happyHourItem.subTotal;

      return truncateDecimal(itemPrice - itemHappyHourPrice);
    }

    return 0;
  }
  function isPriceWithoutTax() {
    console.log(
      "price without tax",
      menu.restaurantInfo["price_without_tax_flag"]
    );
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  }
  function renderHappyHourOffers(item, isStillActive) {
    if (isStillActive && item.happyHourItem) {
      switch (item.happyHourDetail.type) {
        case "Discount":
        case "Amount": {
          const discountedPrice = getDiscountedPrice(item, isStillActive);

          return <span>{`You saved: ${currency} ${discountedPrice}`}</span>;
        }
        default: {
          const extraQty = item.happyHourItem.freeQty;

          return extraQty ? (
            <span>{`You recieved : ${extraQty} ${
              extraQty > 1 ? "extra quantities" : "extra quantity"
            }`}</span>
          ) : null;
        }
      }
    }

    return null;
  }

  function renderPizzaDetails(item) {
    let defaultToppings = "";

    let optionalToppings = "";

    let halfAndHalf = "";

    for (let i = 0; i < item.defaultToppings.length; i++) {
      defaultToppings += `, ${item.defaultToppings[i].topping_name}`;
    }
    defaultToppings = defaultToppings.replace(/[\s,]+/, " ").trim();

    for (let i = 0; i < item.optionalToppings.length; i++) {
      optionalToppings += ` ,${item.optionalToppings[i].topping_name}`;
    }
    optionalToppings = optionalToppings.replace(/[\s,]+/, " ").trim();

    if (item.firstHalf !== null) {
      halfAndHalf = `First Half: ${item.firstHalf.topping_name},`;
      halfAndHalf += ` Second Half: ${item.secondHalf.topping_name}`;
    }

    return (
      <>
        <section className="size-and-base-section">
          <label>Size & Base: {item.selectedBase.name}</label>
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

  function getItemPrice(item, isStillActive) {
    console.log("items in itemlits", item);
    // if (item.modifiers !== null) {
    //   if (item.modifiers && item.happyHourItem && isStillActive) {
    //     return isPriceWithoutTax
    //       ? truncateDecimal(item.happyHourItem.subTotal)
    //       : truncateDecimal(item.happyHourItem.grandTotal);
    //   } else if (item.modifiers !== null && item.subTotal && item.grandTotal) {
    //     alert("now we re in subtotal dishes");
    //     return isPriceWithoutTax ? item.grandTotal : item.grandTotal;
    //   }
    // }

    if (item.happyHourItem && isStillActive) {
      if (item.similarItems && item.similarItems.length > 0) {
        let totalPrice = 0;

        for (let i = 0; i < item.similarItems.length; i++) {
          totalPrice += isPriceWithoutTax()
            ? item.similarItems[i].happyHourItem.subTotal
            : item.similarItems[i].happyHourItem.grandTotal;
        }

        return Number(totalPrice).toFixed(2);
      } else {
        console.log("sub", Number(item.happyHourItem.subTotal).toFixed(2));
        console.log("grand", Number(item.happyHourItem.grandTotal).toFixed(2));
        return isPriceWithoutTax()
          ? Number(item.happyHourItem.subTotal).toFixed(2)
          : Number(item.happyHourItem.grandTotal).toFixed(2);
      }
    } else if (item.subTotal && item.grandTotal) {
      if (item.similarItems && item.similarItems.length > 0) {
        let totalPrice = 0;

        for (let i = 0; i < item.similarItems.length; i++) {
          totalPrice += isPriceWithoutTax()
            ? item.similarItems[i].subTotal || item.similarItems[i].price
            : item.similarItems[i].grandTotal ||
              getActualPrice(item.similarItems[i]);
        }

        return Number(totalPrice).toFixed(2);
      } else {
        console.log(
          "log",
          isPriceWithoutTax()
            ? item.subTotal || item.price
            : item.grandTotal || getActualPrice(item)
        );
        return isPriceWithoutTax()
          ? item.subTotal || item.price
          : item.grandTotal || getActualPrice(item);
      }
    }
  }

  function getModifierPrice(item, isStillActive) {
    if (item.happyHourItem && isStillActive) {
      return isPriceWithoutTax
        ? truncateDecimal(item.happyHourItem.subTotal)
        : truncateDecimal(item.happyHourItem.grandTotal);
    } else if (item.subTotal && item.grandTotal) {
      return isPriceWithoutTax ? item.grandTotal : item.grandTotal;
    }
  }

  function getPizzaItemPrice(item, isStillActive) {
    console.log("getItem item is", item);
    if (item.happyHourItem && isStillActive) {
      return isPriceWithoutTax
        ? truncateDecimal(item.happyHourItem.subTotal)
        : truncateDecimal(item.happyHourItem.grandTotal);
    } else if (item.subTotal && item.grandTotal) {
      return isPriceWithoutTax ? item.grandTotal : item.grandTotal;
    }
  }
  function getActualPrice(item) {
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
  }

  function renderPizzaDetails(item) {
    let defaultToppings = "";

    let optionalToppings = "";

    let halfAndHalf = "";

    for (let i = 0; i < item.defaultToppings.length; i++) {
      defaultToppings += `, ${item.defaultToppings[i].topping_name}`;
    }
    defaultToppings = defaultToppings.replace(/[\s,]+/, " ").trim();

    for (let i = 0; i < item.optionalToppings.length; i++) {
      optionalToppings += ` ,${item.optionalToppings[i].topping_name}`;
    }
    optionalToppings = optionalToppings.replace(/[\s,]+/, " ").trim();

    if (item.firstHalf !== null) {
      halfAndHalf = `First Half: ${item.firstHalf.topping_name},`;
      halfAndHalf += ` Second Half: ${item.secondHalf.topping_name}`;
    }

    return (
      <>
        <section
          className="size-and-base-section"
          style={{ marginTop: "10px" }}
        >
          <label style={{ fontSize: "12px" }}>Size & Base:&nbsp; </label>
          <span
            style={{
              fontSize: "12px",
            }}
          >
            {item.selectedBase.name}
          </span>
        </section>
        <section className="toppings-list">
          {defaultToppings !== "" ? (
            <label style={{ fontSize: "12px", lineHeight: "0" }}>
              Default Toppings:&nbsp;{" "}
            </label>
          ) : null}
          <span
            style={{
              textTransform: "lowercase",
              fontSize: "12px",
              lineHeight: "0",
            }}
          >
            {defaultToppings}
          </span>

          {optionalToppings !== "" ? (
            <label style={{ fontSize: "12px", lineHeight: "0" }}>
              Optional Toppings:{" "}
            </label>
          ) : null}
          <span
            style={{
              textTransform: "lowercase",
              fontSize: "12px",
              lineHeight: "0",
            }}
          >
            {optionalToppings}
          </span>
        </section>
        <section className="toppings-list">
          {halfAndHalf !== "" ? (
            <label style={{ fontSize: "12px", lineHeight: "0" }}>
              Half And Half Choice:{" "}
            </label>
          ) : null}
          <span
            style={{
              textTransform: "lowercase",
              fontSize: "12px",
              lineHeight: "0",
            }}
          >
            {halfAndHalf}
          </span>
        </section>
      </>
    );
  }

  return (
    <>
      <table className="table table_summary">
        <tbody>
          {items.map((item, i) => {
            if (item.isHappyHourActive) {
              const result = isHappyHourStillActive(item, timezone);

              var isStillActive = result.isActive;
              if (isStillActive) {
                refIndex++;
                setTimer(result.distance, timeOutRef[refIndex]);
              }
            }

            return (
              <>
                <tr>
                  <td>
                    <button
                      onClick={() => onRemove(item)}
                      className="cart-button"
                    >
                      <i className="icon_minus_alt" />
                    </button>
                    {/* <button onClick={() => onAdd(item)} className="cart-button">
                      <i className="icon_plus_alt" />
                    </button>{" "}  */}
                    <strong>{item.qty}x</strong>
                    <strong>{item.name} &nbsp;</strong>
                    <br />
                    {item.modifiers ? (
                      <>
                        <p
                          style={{
                            // marginTop: "10px",
                            marginLeft: "5px",
                            fontSize: "10px",
                          }}
                        >
                          <RenderModifiers modifier={item.modifiers} />
                        </p>
                      </>
                    ) : null}
                    {item.productType == "Pizza"
                      ? renderPizzaDetails(item)
                      : null}
                  </td>
                  {console.log("items in itemlist", item)}
                  <td>
                    <p style={{ textAlign: "right" }}>
                      {`${currency} ${truncateDecimal(
                        getItemPrice(item, isStillActive)
                      )}`}
                    </p>
                  </td>
                </tr>
              </>
            );
          })}

          {/* })} */}
        </tbody>
      </table>
    </>
  );
};
export default ItemList;
