import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

const DELIVERY_TYPE = {
  DEFAULT: "Delivery",
  TAKE_AWAY: "PickUp",
  HOME_DELIVERY: "Delivery",
  EAT_IN: "EatIn",
};

function getFormmatedItems(items, restaurant) {
  console.log("items in formatlikst", items);

  return items.map((item) => {
    let forced_modifiers = "";
    const {
      is_localtax: isLocal,
      is_othertax: isOther,
      is_vat: isVat,
      is_servicetax: isService,
      modifiers: modifiers,
    } = item;

    forced_modifiers = modifiers;
    console.log("map modi", forced_modifiers);

    // var Fm = [];
    // Fm = modifiers;
    let detours = {};
    let detourLength = [];
    let is_detour = "";
    let jsonDetour = "";
    if (forced_modifiers !== null) {
      const { forcedModifier: Fm } = forced_modifiers;
      Fm.map((fmi) => {
        if (fmi.detour) {
          detourLength.push(fmi.detour);
          detours[fmi.id] = fmi.detour;
        }
      });
      if (detourLength.length > 0) {
        // array exists and is not empty
        // console.log("entering valid detourLength");
        is_detour = 1;
        jsonDetour = JSON.stringify(detours);
      } else {
        is_detour = 0;
        jsonDetour = "";
      }
    }

    //? Assigning is_detour

    // console.log("detoursOp",jsonDetour, "  is_detour: ", is_detour, " detourLength ",detourLength.length, detourLength )
    console.log(item.qty, typeof item.qty);
    return {
      ...item,
      tax:
        (item.happyHourItem
          ? Number(item.happyHourItem.tax)
          : Number(item.tax)) / Number(item.qty),
      subTotal: item.happyHourItem
        ? item.happyHourItem.grandTotal
        : item.subTotal,
      happy_hour_id: item.happyHourDetail
        ? item.happyHourDetail["happy_hours_id"]
        : "",
      happy_hour_amount: item.happyHourItem
        ? Math.abs(
            Number(item.grandTotal) - Number(item.happyHourItem.subTotal)
          )
        : 0,
      productId: item.id,
      comments: "0",
      type: item.productType,
      tax_total: item.happyHourItem ? item.happyHourItem.tax : item.tax,
      tax_sub_total: item.happyHourItem ? item.happyHourItem.tax : item.tax,
      timestamp: new Date().getTime().toString(),
      ticket_status: "New",
      qty: item.happyHourItem
        ? Number(item.happyHourItem.qty)
        : Number(item.qty),
      price: item.subTotal / item.qty,
      service_tax: Number(isService) ? restaurant["service_tax"] : 0,
      vat: Number(isVat) ? restaurant["vat"] : 0,
      local_tax: Number(isLocal) ? restaurant["local_tax"] : 0,
      other_tax: Number(isOther) ? restaurant["other_tax"] : 0,
      detours: jsonDetour,
      is_detour: is_detour,
    };
  });
}

export function getFormattedRequestPayload(
  user,
  selectedPickUpTime,
  restaurant,
  delivery,
  orderId,
  subTotal,
  subTaxTotal,
  grandTotal,
  cartList,
  distance,
  savedAmount,
  deliveryCharges,
  phone_code,
  delivery_time
) {
  // const menu = useSelector((state) => state.menu);
  console.log("arguments", cartList);
  console.log("user in utils", user);
  //const user1 = useSelector((state) => state.user);

  const formattedItems = getFormmatedItems(cartList, restaurant);

  const localTaxItem = formattedItems.find((item) => item["local_tax"] !== 0);
  const serviceTaxItem = formattedItems.find(
    (item) => item["service_tax"] !== 0
  );
  const otherTaxItem = formattedItems.find((item) => item["other_tax"] !== 0);
  const vatTaxItem = formattedItems.find((item) => item["vat"] !== 0);
  var moment = require("moment-timezone");

  var local_time = moment
    .tz(moment(), `${restaurant.timezone}`)

    .format("HH:mm");
  console.log("timezon in util", local_time);
  const payload = {
    ...user,
    ...restaurant,
    order_id: orderId,
    rest_id: restaurant.restaurant_id,
    delivery_date: moment().format("yyyy-MM-DD"),
    order_date: moment().format("yyyy-MM-DD"),
    order_time: moment.tz(moment(), `${restaurant.timezone}`).format("HH:mm"),
    is_online: "1",
    payment_method: delivery.paymentMethod,
    comments: delivery.comments,
    order_status: "New",
    type: "open",
    member_id: user.user.clientId,
    firstname: user.user.firstName,
    lastname: user.user.lastName,
    email: user.user.email,
    mobile: user.user.mobile,
    delivery_phone: user.user.mobile,
    total: subTotal,
    tax: subTaxTotal,
    grand_total: grandTotal,
    paid: "0",
    payment_status: "",
    transaction_id: "",
    happy_hours_discount: savedAmount,
    Items: formattedItems,
    service_tax: serviceTaxItem ? serviceTaxItem["service_tax"] : 0,
    vat: vatTaxItem ? vatTaxItem["vat"] : 0,
    local_tax: localTaxItem ? localTaxItem["local_tax"] : 0,
    other_tax: otherTaxItem ? otherTaxItem["other_tax"] : 0,
    comments: delivery.comments,
    delivery_cost: deliveryCharges,
    phone_code: phone_code,
  };

  console.log("Formatted Request Payload", payload);

  var x;

  if (delivery.deliveryType == DELIVERY_TYPE.DEFAULT) {
    if (user.selectedAddress.state) {
      x = user.selectedAddress.state;
    } else if (user.selectedAddress[0].state) {
      x = user.selectedAddress[0].state;
    } else {
      x = "";
    }
  }

  return delivery.deliveryType !== DELIVERY_TYPE.TAKE_AWAY &&
    delivery.deliveryType !== DELIVERY_TYPE.EAT_IN
    ? {
        ...payload,

        street:
          delivery.selectedAddress.address1 +
            delivery.selectedAddress.address2 ||
          delivery.selectedAddress[0].address1 +
            delivery.selectedAddress[0].address2,
        delivery_city:
          user.selectedAddress.city || user.selectedAddress[0].city,
        delivery_state: x,
        // user.selectedAddress.state || user.selectedAddress[0].state,
        delivery_country:
          user.selectedAddress.country || user.selectedAddress[0].country,
        delivery_zipcode:
          user.selectedAddress.zipcode || user.selectedAddress[0].zipcode,
        delivery_mobile: user.user.mobile,
        mobile: user.user.mobile,
        delivery_phone: user.user.mobile,
        // mobile: user.selectedAddress.phone || user.selectedAddress[0].phone,
        // delivery_phone:
        //   user.selectedAddress.phone || user.selectedAddress[0].phone,
        delivery_option: delivery.deliveryType.toLowerCase(),
        order_location: null,
        time_for_delivery: user.selectedDeliveryTime,
        delivery_time: user.selectedDeliveryTime,
        delivery_cost: deliveryCharges,
        phone: "",
      }
    : {
        ...payload,
        street: "",
        delivery_city: "",
        delivery_state: "",
        delivery_country: "",
        delivery_zipcode: "",
        delivery_option: delivery.deliveryType.toLowerCase(),
        order_location: null,
        time_for_delivery: "",
        delivery_time: "",
        distance: "",
        phone: user.user.mobile,
        delivery_phone: user.user.mobile,
      };
}
//console.log("check", getFormattedRequestPayload());
