import { getModifierIds, getDetours, isSameItem, getDetoursIds } from "./utils";
import { truncateDecimal } from "./utils";

export function updateMenuItemsWithCart(menuList, cart) {
  const updatedItems = menuList.map((item) => {
    const cartItems = cart.filter(({ id }) => item.id === id);
    //console.log("item in update item", item);
    console.log("item in update cartitem", cartItems);

    // cartItems.reduce((acc, item) => {
    //   console.log("acc is", acc);
    //   console.log("acc item is", item);
    // });

    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalHappyHourQty = cartItems.reduce(
      (acc, item) => acc + (item.happyHourItem ? item.happyHourItem.qty : 0),
      0
    );
    const cartItemsWithNonZeroQty = cartItems.filter((item) => item.qty > 0);

    if (cartItems.length) {
      return {
        ...item,
        ...cartItems[0],
        subTotal:
          cartItems.reduce((acc, item) => acc + item.subTotal, 0) ||
          Number(item.price),
        qty:
          cartItems.length > 1 ? totalQty : cartItems[cartItems.length - 1].qty,
        similarItems: cartItemsWithNonZeroQty.length
          ? cartItemsWithNonZeroQty
          : [],
        happyHourItem:
          cartItems[cartItems.length - 1].happyHourItem &&
          totalHappyHourQty !== 0
            ? {
                ...cartItems[cartItems.length - 1].happyHourItem,
                qty:
                  cartItems.length > 1
                    ? totalHappyHourQty
                    : cartItems[cartItems.length - 1].happyHourItem.qty,
              }
            : null,
      };
    }

    return getInitialMenuItem(item);
  });

  return updatedItems;
}

export function updatePizzaItemsWithCart(pizzaList, cart) {
  const updatedItems = pizzaList.map((item) => {
    const cartItems = cart.filter(({ id }) => item.pizza_id === id);
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalHappyHourQty = cartItems.reduce(
      (acc, item) => acc + (item.happyHourItem ? item.happyHourItem.qty : 0),
      0
    );
    const cartItemsWithNonZeroQty = cartItems.filter((item) => item.qty > 0);

    if (cartItems.length) {
      return {
        ...item,
        ...cartItems[0],
        subTotal:
          cartItems.reduce((acc, item) => acc + item.subTotal, 0) ||
          Number(item.price),
        qty:
          cartItems.length > 1 ? totalQty : cartItems[cartItems.length - 1].qty,
        similarItems: cartItemsWithNonZeroQty.length
          ? cartItemsWithNonZeroQty
          : [],
        happyHourItem:
          cartItems[cartItems.length - 1].happyHourItem &&
          totalHappyHourQty !== 0
            ? {
                ...cartItems[cartItems.length - 1].happyHourItem,
                qty:
                  cartItems.length > 1
                    ? totalHappyHourQty
                    : cartItems[cartItems.length - 1].happyHourItem.qty,
              }
            : null,
      };
    }

    return getInitialPizzaItem(item);
  });

  return updatedItems;
}

function getInitialMenuItem(item) {
  return {
    ...item,
    similarItems: [],
    modifiers: null,
    subTotal: 0,
    grandTotal: 0,
    fmId: "",
    omId: "",
    detours: "",
    qty: 0,
    vat: 0,
    tax: 0,
    happyHourItem: null,
    service_tax: 0,
    local_tax: 0,
    other_tax: 0,
  };
}

function getInitialPizzaItem(item) {
  return {
    ...item,
    similarItems: [],
    modifiers: null,
    subTotal: 0,
    grandTotal: 0,
    toppingIdx1: [],
    baseId: null,
    sizeId: null,
    selectedBase: null,
    defaultToppings: [],
    optionalToppings: [],
    firstHalf: null,
    secondHalf: null,
    qty: 0,
    vat: 0,
    tax: 0,
    happyHourItem: null,
    service_tax: 0,
    local_tax: 0,
    other_tax: 0,
  };
}

export function revertMenuItemsToInitialState(menuItems) {
  return menuItems.map((menuItem) => getInitialMenuItem(menuItem));
}

export function revertCartItemsToInitialState(pizzaItems) {
  return pizzaItems.map((pizzaItem) => getInitialPizzaItem(pizzaItem));
}

function getNewQuantity(itemExisted, qty, buyQty, getQty) {
  if (itemExisted.happyHourItem && itemExisted.happyHourItem.qty) {
    if (buyQty > getQty) {
      return qty % (buyQty + getQty) === 0
        ? (qty / (buyQty + getQty)) * getQty
        : itemExisted.happyHourItem.freeQty;
    } else if (buyQty === getQty) {
      const reminder = qty % (buyQty + getQty);

      return reminder > buyQty || reminder === 0
        ? (itemExisted.happyHourItem.freeQty || 0) + 1
        : itemExisted.happyHourItem.freeQty || 0;
    } else {
      const val = qty % (buyQty + getQty);

      if (val && val % getQty === 0) {
        return (
          (itemExisted.happyHourItem.freeQty || 0) +
          (qty % (buyQty + getQty)) / getQty
        );
      } else if (qty % (buyQty + getQty) === 0) {
        return (qty / (buyQty + getQty)) * getQty;
      }

      return itemExisted.happyHourItem.freeQty;
    }
  }

  return itemExisted.happyHourItem ? itemExisted.happyHourItem.freeQty : 0;
}

function getHappyHoursSubTotalAndQuantity(item) {
  switch (item.happyHourDetail.type) {
    case "Discount": {
      const newTotal = item.grandTotal / item.qty || Number(item.price);
      const grandTotal =
        item.grandTotal -
        item.qty * (newTotal * (Number(item.happyHourDetail.discount) / 100));

      return {
        subTotal: grandTotal - item.tax,
        grandTotal,
        qty: item.qty,
      };
    }
    case "Amount": {
      const grandTotal =
        item.grandTotal -
        Number(item.qty) * Number(item.happyHourDetail.amount);

      return {
        subTotal: grandTotal - item.tax,
        grandTotal,
        qty: item.qty,
      };
    }
    default: {
      const buyQty = Number(item.happyHourDetail["buy_qty"]);
      const getQty = Number(item.happyHourDetail["get_qty"]);

      if (item.qty >= buyQty) {
        const freeQty = getNewQuantity(item, item.qty, buyQty, getQty);
        const freeSubTotal = freeQty
          ? item.subTotal - freeQty * (item.subTotal / item.qty)
          : item.subTotal;
        const freeGrandTotal = freeQty
          ? item.grandTotal - freeQty * (item.grandTotal / item.qty)
          : item.grandTotal;

        return {
          qty: item.qty,
          subTotal: freeSubTotal,
          grandTotal: freeGrandTotal,
          freeQty,
        };
      }

      return {
        subTotal: item.subTotal,
        grandTotal: item.grandTotal,
        qty: item.qty,
        freeQty: 0,
      };
    }
  }
}

export function addItem(
  item,
  modifiers,
  subTotal,
  menuList,
  cart,
  restaurantInfo,
  pizzas
) {
  // console.log("modifiers in opertaion", modifiers.forcedModifier[0]);

  console.log("subTotal is", subTotal);

  const itemFmId = modifiers
    ? getModifierIds(modifiers.forcedModifier) || item.fmId
    : "";
  const itemOmId = modifiers
    ? getModifierIds(modifiers.optionalModifier) || item.omId
    : "";
  const itemDetours = modifiers ? getDetours(modifiers.forcedModifier) : "";
  //const detourid = getDetoursIds(modifiers.forcedModifier) || item.detours;
  console.log("current item is", item);
  const itemExisted = cart.find((cartItem) =>
    isSameItem(item, modifiers, cartItem)
  );
  const { isHappyHourActive } = item;
  console.log("itemFmId opertaion", itemFmId);
  console.log("itemExisted opertaion", itemExisted);
  // console.log("id of itemDetours opertaion", detoursIds);
  const minQty = Number(item.min_qty) === 0 ? 1 : Number(item.min_qty);
  //var newItem;

  // if (!itemExisted) {
  //   var newItem = {
  //     ...item,
  //     qty: minQty,
  //     fmId: itemFmId,
  //     omId: itemOmId,
  //     detours: itemDetours,
  //     // selectedDetourId: detoursIds,
  //     modifiers,
  //     subTotal: subTotal * minQty || Number(item.price) * minQty,
  //     happyHourItem: null,
  //   };
  // } else if (itemFmId && itemExisted) {
  //   if (!itemFmId && itemExisted) {
  //     var newItem = {
  //       ...itemExisted,
  //       qty: itemExisted.qty + 1,

  //       subTotal:
  //         itemExisted.subTotal +
  //         (item.subTotal / itemExisted.qty || Number(item.price)),
  //     };
  //   } else if (itemExisted.modifiers !== null) {
  //     var newItem = {
  //       ...itemExisted,
  //       qty: itemExisted.qty + 1,

  //       subTotal: item.subTotal - itemExisted.subTotal / itemExisted.qty + 1,
  //     };
  //   }
  // }

  let newItem = itemExisted
    ? {
        ...itemExisted,
        qty: itemExisted.qty + 1,

        // subTotal:
        //   itemExisted.subTotal +
        //   (item.subTotal / itemExisted.qty || Number(item.price)),

        subTotal:
          (itemExisted.subTotal / itemExisted.qty) * (itemExisted.qty + 1),
      }
    : {
        ...item,
        qty: minQty,
        fmId: itemFmId,
        omId: itemOmId,
        detours: itemDetours,
        // selectedDetourId: detoursIds,
        modifiers,
        subTotal: subTotal * minQty || Number(item.price) * minQty,
        happyHourItem: null,
      };

  console.log("new Item", newItem);
  const taxes = getTaxes(item, newItem.subTotal, restaurantInfo);

  newItem = {
    ...newItem,
    grandTotal: newItem.subTotal + taxes.tax,
    ...taxes,
  };

  newItem = {
    ...newItem,
    happyHourItem: isHappyHourActive
      ? {
          ...getHappyHoursSubTotalAndQuantity(newItem),
          ...taxes,
        }
      : null,
  };

  const updatedCart = itemExisted
    ? cart.map((item) => {
        if (isSameItem(newItem, modifiers, item)) {
          if (!modifiers) {
            return newItem;
          }
          console.log("old item", item);
          console.log("old new item", newItem);
          if (modifiers) {
            var old_modifier_array = [];
            var new_modifier_array = [];
            item.modifiers.forcedModifier.map((currval, i) => {
              new_modifier_array.push(currval.optionalModifiers);
            });

            modifiers.forcedModifier.map((currval, i) => {
              old_modifier_array.push(currval.optionalModifiers);
            });

            console.log("old item", old_modifier_array);
            console.log("old new item", new_modifier_array);

            if (old_modifier_array[0].length == new_modifier_array[0].length) {
              return newItem;
            } else {
              return item;
            }
          }
        } else if (!itemExisted && newItem.id === item.id) {
          return {
            ...item,
            grandTotal: subTotal + taxes.taxSubtotal,
            ...taxes,
          };
        }

        return item;
      })
    : [...cart, newItem];
  console.log("updated cart", updatedCart);

  return {
    cart: updatedCart,
    menuItems: updateMenuItemsWithCart(menuList, updatedCart),
    pizzas: updatePizzaItemsWithCart(pizzas, updatedCart),
  };
}

function getHappyHourDetailsForRemovedItem(item, qty) {
  switch (item.happyHourDetail.type) {
    case "Amount":
    case "Discount": {
      const subTotal =
        item.happyHourItem.subTotal - item.happyHourItem.subTotal / item.qty;
      const grandTotal =
        item.happyHourItem.grandTotal -
        item.happyHourItem.grandTotal / item.qty;

      return {
        subTotal,
        grandTotal,
        qty,
      };
    }
    default: {
      const happyQty = item.happyHourItem.qty - item.happyHourItem.freeQty;
      const happySubTotal =
        item.happyHourItem.subTotal - item.happyHourItem.subTotal / happyQty;
      const happyGrandTotal =
        item.happyHourItem.grandTotal -
        item.happyHourItem.grandTotal / happyQty;
      const buyQty = Number(item.happyHourDetail["buy_qty"]);
      const getQty = Number(item.happyHourDetail["get_qty"]);
      const reminder = item.happyHourItem.qty % (buyQty + getQty);

      if (
        (item.happyHourItem.freeQty &&
          ((buyQty > getQty &&
            item.happyHourItem.qty % (buyQty + getQty) === 0) ||
            (buyQty < getQty &&
              (item.happyHourItem.qty % (buyQty + getQty)) % getQty === 0))) ||
        (buyQty === getQty && (reminder === 0 || reminder > buyQty))
      ) {
        return {
          qty,
          freeQty: item.happyHourItem.freeQty - 1,
          subTotal: item.happyHourItem.subTotal,
          grandTotal: item.happyHourItem.grandTotal,
        };
      }

      return {
        qty,
        freeQty: item.happyHourItem.freeQty,
        subTotal: happySubTotal,
        grandTotal: happyGrandTotal,
      };
    }
  }
}

export function removeItem(item, menuList, cart, restaurantInfo, pizzas) {
  const updatedCart = cart.map((cartItem) => {
    if (isSameItem(item, item.modifiers, cartItem)) {
      const minQty = Number(item.min_qty) === 0 ? 1 : Number(item.min_qty);

      let subtractQty = 1;

      if (minQty > 0 && cartItem.qty === minQty) {
        subtractQty = minQty;
      }
      const qty = cartItem.qty - subtractQty;
      const subTotal = cartItem.subTotal - cartItem.subTotal / cartItem.qty;
      const { isHappyHourActive } = cartItem;
      const taxes = getTaxes(item, subTotal, restaurantInfo);
      const happyHrDetails =
        cartItem.happyHourItem && isHappyHourActive
          ? getHappyHourDetailsForRemovedItem(
              cartItem,
              qty,
              subTotal,
              taxes.tax
            )
          : null;

      return {
        ...cartItem,
        qty,
        subTotal: qty > 0 ? subTotal : 0,
        grandTotal: qty > 0 ? subTotal + taxes.tax : 0,
        fmId: qty > 0 ? cartItem.fmId : "",
        omId: qty > 0 ? cartItem.omId : "",
        detours: qty > 0 ? cartItem.detours : "",
        modifiers: qty > 0 ? item.modifiers : null,
        ...taxes,
        happyHourItem:
          qty && isHappyHourActive && happyHrDetails && happyHrDetails.qty
            ? {
                ...happyHrDetails,
                ...taxes,
              }
            : null,
      };
    }

    return cartItem;
  });

  return {
    cart: updatedCart.filter((item) => item.qty > 0),
    menuItems: updateMenuItemsWithCart(menuList, updatedCart),
    pizzas: updatePizzaItemsWithCart(pizzas, updatedCart),
  };
}

export function removeCartItem(item, menuList, pizzas, cart) {
  const updatedCart = cart.filter((_, i) => i !== item.index);
  const updatedMenuItems = menuList.map((menuItem) => {
    if (menuItem.id === item.id) {
      return getInitialMenuItem(menuItem);
    }

    return menuItem;
  });

  const updatedPizzaItems = pizzas.map((pizza) => {
    if (pizza.pizza_id === item.id) {
      return getInitialPizzaItem(pizza);
    }

    return pizza;
  });

  return {
    cart: updatedCart,
    menuItems:
      item.qty > 0
        ? updateMenuItemsWithCart(menuList, updatedCart)
        : updatedMenuItems,
    pizzas:
      item.qty > 0 && item.isPizza
        ? updatePizzaItemsWithCart(pizzas, updatedCart)
        : updatedPizzaItems,
  };
}

export function getTaxes(item, subTotal, restaurantInfo) {
  const {
    is_localtax: isLocal,
    is_othertax: isOther,
    is_vat: isVat,
    is_servicetax: isService,
  } = item;
  const {
    local_tax: localTax,
    vat: vatAmt,
    service_tax: serviceTax,
    other_tax: otherTax,
  } = restaurantInfo;
  const service = Number(isService) ? subTotal * (Number(serviceTax) / 100) : 0;
  const vat = Number(isVat) ? subTotal * (Number(vatAmt) / 100) : 0;
  const local = Number(isLocal) ? subTotal * (Number(localTax) / 100) : 0;
  const other = Number(isOther) ? subTotal * (Number(otherTax) / 100) : 0;
  const tax = service + vat + local + other;

  return {
    vatAmt: vat,
    tax,
    serviceTax: service,
    localTax: local,
    otherTax: other,
  };
}

export function getPizzaActualPrice(pizza, price, restaurantInfo) {
  const isPriceWithoutTax = Number(restaurantInfo["price_without_tax_flag"]);

  return isPriceWithoutTax
    ? Number(price)
    : truncateDecimal(
        Number(price) +
          Number(getTaxes(pizza, Number(price), restaurantInfo).tax)
      );
}

export function getSelectedCategoryId(categoryList) {
  console.log("sub cate in operations", categoryList);
  if (categoryList.length) {
    const subCategory = categoryList[0]["sub_category"]
      ? categoryList[0]["sub_category"][0]
      : null;

    return subCategory ? subCategory["category_id"] : "";
  }
}

// happy hours related.
export function updateHappyHourInfoToMenuItems(menuList, restInfo, happyHours) {
  // check for each Item if happy hour is avaliable
  // If available then add happy hour related info in item object
  // like happy hour data(type, discount) , time left for availing offer

  const menuItems = menuList.map(function (item) {
    const result = isAvailableInHappyHours(item, restInfo, happyHours);
    // if item don't have offer Id return as it is

    if (!result.isHappyHourActive) {
      item.isHappyHourActive = false;
    } else {
      // update happy hours details Item object and return
      item.isHappyHourActive = true;
      item.happyHourDetail = result.happyHourDetail;
    }

    return item;
  });

  return menuItems;
}

export function isAvailableInHappyHours(item, restInfo, happyHours) {
  // check if this item is available in happy hours or not
  const result = {
    isHappyHourActive: false,
    happyHourDetail: {},
    timeoutIndex: 0,
  };

  const options = {
    timeZone: restInfo.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const getRestaurantTimeNDay = new Date().toLocaleString("en-SG", options);

  const currentDay = getRestaurantTimeNDay.split(",")[0].trim();

  const currentTime = getRestaurantTimeNDay.split(",")[2].trim();

  const currentMonthDay = `${getRestaurantTimeNDay
    .split(",")[1]
    .trim()
    .split(" ")[0]
    .trim()} ${getRestaurantTimeNDay
    .split(",")[1]
    .trim()
    .split(" ")[1]
    .trim()}`;

  const currentYear = getRestaurantTimeNDay
    .split(",")[1]
    .trim()
    .split(" ")[2]
    .trim();

  const happyHourIds = item.happy_hours_id.split(",");

  let countDownTime;

  let countDownDateTime;

  let timeoutIndex = 0;

  let found;

  for (let i = 0; i < happyHourIds.length; i++) {
    found = happyHours.find((element) => {
      if (
        element.happy_hours_id === happyHourIds[i] &&
        isDayAvailable(currentDay, element) &&
        isAvailableInTimeLimit(element, currentTime)
      ) {
        // if length is 1 then straight away return element
        countDownTime = `${element.time_to}:00`;
        countDownDateTime = `${currentDay}, ${currentMonthDay} ${currentYear}, ${countDownTime}`;

        if (happyHourIds.length === 1) {
          return element;
        } else if (element.type === "Buy_n_Get") {
          //
          return element;
        } else if (i === happyHourIds.length - 1) {
          return element;
        }
      }
    });
  }

  if (found !== undefined) {
    result.isHappyHourActive = true;
    result.happyHourDetail = found;
    result.happyHourDetail.countDownDate = countDownDateTime;
    //setTimer(getRestaurantTimeNDay, countDownDateTime);
    result.happyHourDetail.happyHourTimeOutIndex = timeoutIndex;
    timeoutIndex++;

    if (found.type === "Buy_n_Get") {
      result.happyHourDetail.happyHourDisplayText = `Pay for ${Number(
        found.buy_qty
      )} get upto ${Number(found.get_qty) + Number(found.buy_qty)}`;
    } else if (found.type === "Amount") {
      result.happyHourDetail.happyHourDisplayText = `Get ${restInfo.monetary_symbol} ${found.amount} Off`;
    } else {
      result.happyHourDetail.happyHourDisplayText = `Get ${found.discount}% Off`;
    }
  }

  return result;
}

export function isDayAvailable(day, happyHour) {
  let result = false;
  const found = happyHour.day
    .split(",")
    .find((element) => element.toLowerCase() === day.toLowerCase());

  if (found !== undefined) {
    result = true;
  }

  return result;
}

export function isAvailableInTimeLimit(item, time) {
  const currentHour = parseInt(time.split(":")[0]);

  const currentMinute = parseInt(time.split(":")[1]);

  const timeFromHour = parseInt(item.time_from.split(":")[0]);

  const timeFromMinute = parseInt(item.time_from.split(":")[1]);

  const timeToHour = parseInt(item.time_to.split(":")[0]);

  const timeToMinute = parseInt(item.time_to.split(":")[1]);

  if (
    (currentHour > timeFromHour ||
      (currentHour === timeFromHour && currentMinute >= timeFromMinute)) &&
    (currentHour < timeToHour ||
      (currentHour === timeToHour && currentMinute <= timeToMinute))
  ) {
    return true;
  }

  return false;
}
