import React from "react";
import {
  isHappyHourStillActive,
  setTimer,
  truncateDecimal,
} from "../../state-management/menu/utils";
const ItemList = ({
  items,
  currency,
  isPriceWithoutTax,
  timezone,
  onRemove,
}) => {
  const timeOutRef = Array.from({ length: 100 }, () => React.createRef());

  let refIndex = -1;
  function getItemPrice(item, isStillActive) {
    console.log("getItem item is", item);
    if (item.happyHourItem && isStillActive) {
      return isPriceWithoutTax
        ? truncateDecimal(item.happyHourItem.subTotal)
        : truncateDecimal(item.happyHourItem.grandTotal);
    } else if (item.subTotal && item.grandTotal) {
      return isPriceWithoutTax ? item.subTotal : item.grandTotal;
    }
  }

  function getDiscountedPrice(item, isStillActive) {
    if (item.happyHourItem && isStillActive) {
      const itemPrice = item.subTotal;
      const itemHappyHourPrice = item.happyHourItem.subTotal;

      return truncateDecimal(itemPrice - itemHappyHourPrice);
    }

    return 0;
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
                      style={{
                        borderRadius: "20%",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      className="remove_item"
                    >
                      <i className="icon_minus_alt" />
                    </button>{" "}
                    <strong>{item.qty} &nbsp;x</strong>&nbsp;
                    {item.name}
                  </td>
                  <td>
                    <strong className="float-right">
                      {`${currency} ${
                        truncateDecimal(getItemPrice(item, isStillActive)) ||
                        truncateDecimal(
                          item.qty * Number(item.price).toFixed(2)
                        )
                      }`}
                    </strong>{" "}
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
