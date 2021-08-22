import Appheader from "../AppHeader/AppHeader";
import "../Checkout/Checkout.css";
// import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import MoneyIcon from "@material-ui/icons/Money";
import moment from "moment";
import {
  setDeliveryCost,
  setIsTakeAway,
  setPickupTime,
} from "../../state-management/user/actions";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import {
  addItem,
  removeItem,
  clearMenuState,
} from "../../state-management/menu/actions";
import { TimePicker } from "antd";
import { notification } from "antd";
import "antd/dist/antd.css";
import { getFormattedRequestPayload } from "../Checkout/utils";
import PaymentForm from "../Checkout/PaymentForm";
import {
  checkCoupons,
  placeOrder,
  couponRedeem,
} from "../../state-management/menu/asyncActions";
import axios from "axios";
import sha256 from "js-sha256";
import { CompassCalibrationOutlined } from "@material-ui/icons";
import { useHistory } from "react-router";
import { getTaxes } from "../../state-management/menu/operations";
import WaitingOverlay from "../WaitingOverlay/WaitingOverlay";
import AppHeader from "../AppHeader/AppHeader";
import Footer from "../Footer/Footer";
import RenderModifiers from "../../containers/Modifiers/RenderModifiers";
import { modalNames } from "../AppModal/constants";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { closeModal, openModal } from "../../state-management/modal/actions";
import { setComment } from "../../state-management/menu/actions";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
//import { checkCoupons } from "../../state-management/menu/asyncActions";
import { Box, Drawer, ListItem, SwipeableDrawer } from "@material-ui/core";
import LoadingBar from "../../components/LoadingBar/LoadingBar";

import RestrictUser from "../RestrictUser/RestrictUser";
const useStyle = makeStyles({
  list: {
    width: 450,
  },
  "@media (max-width:768px)": {
    list: {
      width: 250,
    },
  },
});

const Checkout = () => {
  //const format = "HH:mm";
  const History = useHistory();

  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);

  const [couponisapplied, setcouponisapplied] = useState(false);
  const [amountaftercouponapplied, setamountaftercouponapplied] = useState();
  const [couponappliedname, setcouponappliedname] = useState();
  const [couponamount, setcouponamount] = useState();
  const [couponId, setcouponId] = useState();
  const [couponredeemed, setcouponredeemed] = useState(false);
  const [couponredeemedmessage, setcouponredeemedmessage] = useState();
  const [coupontypeisdiscount, setcoupontypeisdiscount] = useState(false);

  useEffect(() => {
    console.log("coupon id is", couponId);
  }, [couponId]);
  useEffect(() => {
    console.log("coupon id is amount", couponamount);
  }, [couponamount]);

  const dispatch = useDispatch();
  let refIndex = -1;
  const timeOutRef = Array.from({ length: 100 }, () => React.createRef());
  const DELIVERY_TYPE = {
    DEFAULT: "Delivery",
    TAKE_AWAY: "PickUp",
    HOME_DELIVERY: "Delivery",
    EAT_IN: "EatIn",
  };
  const [data, setdata] = useState({
    // displayloader: false,
    deliveryType: user.isTakeAway
      ? DELIVERY_TYPE.TAKE_AWAY
      : DELIVERY_TYPE.HOME_DELIVERY,
    //selectedAddress: user.distance >= 0 ? user.selectedAddress : null,

    isAddressesFetched: false,
    paymentMethod: "",
    // I wonder why we need these 3 states - this needs a lot of refactoring
    openingBusinesHours: main.opening,
    closingBusinesHours: main.closing,
    businessHours: main.businessHour,
    isTakeAway: user.isTakeAway,
    orderButtonClicked: false,
    // addresses: [],
    paymentOptions: [],
    deliveryCharges: "",
    hasDeliveryOption: false,
    hasEatInOption: false,
    hasPickupOption: false,
    pickupTime:
      moment().add(30, "minutes").format("HH:mm") >= main.opening &&
      moment().add(30, "minutes").format("HH:mm") <= main.closing
        ? moment().add(30, "minutes")
        : moment(main.opening, "HH:mm"),
  });
  const [show, setshow] = useState(false);
  let isDecimalAmount = false;
  const [state, setState] = useState({
    showAddress: false,
    deliveryType: "",
  });

  const truncateDecimal = (number) => {
    return Number.isInteger(Number(number))
      ? Number(number)
      : Number(number).toFixed(2);
  };
  const grandTotal = Number(getGrandTotal());
  const [billPercentAmount, setbillPercentAmount] = useState();
  const [restrict, setRestrict] = useState(false);

  useEffect(() => {
    if (!user.user.isUserLoggedIn) {
      setRestrict(true);
    }
    if (main.deliveryRange)
      //getDeliveryCharges();
      //dispatch(setPickupTime(data.pickupTime));
      //getDeliveryCharges();

      console.log("xyz", data.pickupTime);

    const deliveryOptions = !(
      main.selectedRestaurant.order_option === "" ||
      main.selectedRestaurant.order_option === null ||
      main.selectedRestaurant.order_option === undefined
    );

    data.hasDeliveryOption = main.selectedRestaurant.order_option
      .split(",")
      .includes("delivery");
    data.hasEatInOption = main.selectedRestaurant.order_option
      .split(",")
      .includes("eatin");
    data.hasPickupOption = main.selectedRestaurant.order_option
      .split(",")
      .includes("pickup");

    data.paymentOptions = main.selectedRestaurant.payment_option_ids.split(",");

    setdata({
      ...data,
    });
    console.log("dtaa is", data);
    setbillPercentAmount(getBillAmount() / 100);
  }, []);

  const isPriceWithoutTax = () => {
    console.log(
      "price without tax",
      menu.restaurantInfo["price_without_tax_flag"]
    );
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  };

  function getItemPrice(item, isStillActive) {
    console.log("getItem item is", item);
    if (item.happyHourItem && isStillActive) {
      return isPriceWithoutTax
        ? truncateDecimal(item.happyHourItem.grandTotal)
        : truncateDecimal(item.happyHourItem.grandTotal);
    } else {
      return isPriceWithoutTax ? item.grandTotal : item.grandTotal;
    }

    // if (item.happyHourItem && isStillActive) {
    //   if (item.similarItems && item.similarItems.length > 0) {
    //     let totalPrice = 0;

    //     for (let i = 0; i < item.similarItems.length; i++) {
    //       totalPrice += this.isPriceWithoutTax()
    //         ? item.similarItems[i].happyHourItem.subTotal
    //         : item.similarItems[i].happyHourItem.grandTotal;
    //     }

    //     return Number(totalPrice).toFixed(2);
    //   } else {
    //     console.log("sub", Number(item.happyHourItem.subTotal).toFixed(2));
    //     console.log("grand", Number(item.happyHourItem.grandTotal).toFixed(2));
    //     return this.isPriceWithoutTax()
    //       ? Number(item.happyHourItem.subTotal).toFixed(2)
    //       : Number(item.happyHourItem.grandTotal).toFixed(2);
    //   }
    // } else if (item.subTotal && item.grandTotal) {
    //   if (item.similarItems && item.similarItems.length > 0) {
    //     let totalPrice = 0;

    //     for (let i = 0; i < item.similarItems.length; i++) {
    //       totalPrice += isPriceWithoutTax()
    //         ? item.similarItems[i].subTotal || item.similarItems[i].price
    //         : item.similarItems[i].grandTotal ||
    //           getActualPrice(item.similarItems[i]);
    //     }

    //     return Number(totalPrice).toFixed(2);
    //   } else {
    //     console.log(
    //       "log",
    //       isPriceWithoutTax()
    //         ? item.subTotal || item.price
    //         : item.grandTotal || this.getActualPrice(item)
    //     );
    //     return isPriceWithoutTax()
    //       ? item.subTotal || item.price
    //       : item.grandTotal || this.getActualPrice(item);
    //   }
    // }
  }

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

  // const deliveryCharges = 0;
  const getBillAmount = () => {
    var finalAmount;
    if (couponisapplied) {
      var finalAmount =
        (Number(user.delivery_cost) + Number(getGrandTotal())).toFixed(2) -
        couponamount;
    } else {
      var finalAmount = (
        Number(user.delivery_cost) + Number(getGrandTotal())
      ).toFixed(2);
    }
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

  const getDeliveryCharges = () => {
    console.log("we are in getd");
    if (!main.deliveryRange) return;
    const cost = main.deliveryRange.cost;
    const range = main.deliveryRange.range;
    const isTakeAway = user.isTakeAway;
    const distance = user.distance;

    const freeDeliveryRangeAmount = cost["free_delivery_eligible_amount"];
    const stdDeliveryCost = cost["std_delivery_cost"] || 0;
    console.log(
      "check delivery",
      parseInt(cost["free_delivery_eligible_amount"]) === 0,
      parseInt(cost["std_delivery_cost"]) === 0,
      grandTotal
    );

    const isFreeDelivery =
      grandTotal >= Number(cost["free_delivery_eligible_amount"]) &&
      parseInt(freeDeliveryRangeAmount) !== 0;

    if (isFreeDelivery || isTakeAway) {
      dispatch(setDeliveryCost(0));
      return 0;
    }
    //

    if (distance === -1 || !range) {
      console.log("std delivery cost", stdDeliveryCost);
      console.log("std delivery cost", Number(stdDeliveryCost));
      if (stdDeliveryCost) {
        dispatch(setDeliveryCost(Number(stdDeliveryCost)));
      }
      return Number(stdDeliveryCost);
    }

    if (range) {
      const selectedRange = range.find((rng) => {
        const from = Number(rng["range_from"]);
        const to = Number(rng["range_to"]);

        return distance >= from && distance <= to;
      });

      // selectedRange
      //   ?( Number(selectedRange["delivery_cost"]) || 0)
      //   : Number(stdDeliveryCost);

      if (selectedRange) {
        if (selectedRange["delivery_cost"]) {
          dispatch(setDeliveryCost(selectedRange["delivery_cost"]));
          console.log("range", selectedRange["delivery_cost"]);
        } else {
          dispatch(setDeliveryCost(0));
        }
      } else {
        dispatch(setDeliveryCost(Number(stdDeliveryCost)));
      }
      return selectedRange
        ? Number(selectedRange["delivery_cost"] || 0)
        : Number(stdDeliveryCost);
    }

    return 0;
  };

  const [updatedcouponamount, setupdatedcouponamount] = useState();
  const handleAddItem = (item) => {
    dispatch(
      addItem(item, item.modifiers || 0, item.subTotal, menu.restaurantInfo)
    );
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item, item.modifiers || null, 0, menu.restaurantInfo));
  };

  const getSavedAmount = () => {
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
                (item.grandTotal -
                  ((item.happyHourItem && item.happyHourItem.grandTotal) || 0))
              );
            }

            return acc;
          }, 0)
        )
      : "";
  };

  const savedAmount = Math.abs(getSavedAmount());

  const sendpaymentreq = (type, orderId) => {
    var errorurl = `https://ciboapp.me/feedmii/?/restId=${menu.restaurantInfo.restaurant_id}/paymentfailed`;
    var failedurl = `https://ciboapp.me/feedmii/?/restId=${menu.restaurantInfo.restaurant_id}/paymentfailed`;
    //var failedurl = `http://localhost:3000/feedmii/?/restId=${menu.restaurantInfo.restaurant_id}/paymentfailed`;
    var accepturl = `https://ciboapp.me/feedmii/?/restId=${menu.restaurantInfo.restaurant_id}/ordersuccess?orderid=${orderId}`;
    //var accepturl = `http://localhost:3000/feedmii/?/restId=${menu.restaurantInfo.restaurant_id}/ordersuccess?orderid=${orderId}`;
    var callbackurl = "https://ciboapp.com/api/mobileApi/v2/app/callback";
    var mkey = menu.restaurantInfo.merchant_key;
    var sec = menu.restaurantInfo.secret;
    var userid = "123";

    let str = `${getBillAmount()}${callbackurl}${
      menu.restaurantInfo.currency
    }${errorurl}${failedurl}${mkey}${orderId}${accepturl}${sec}`;

    let mac = sha256(str);

    const paymentdata = {
      name: user.user.firstName,
      email: user.user.email,
      phone: user.user.mobile,
      user_id: userid,
      order_id: `${orderId}`,
      merchant_key: mkey,
      amount: getBillAmount(),
      currency: menu.restaurantInfo.currency,
      mac: mac,
      redirect_type: type,
      accept_url: accepturl,
      failed_url: failedurl,
      error_url: errorurl,
      callback_url: callbackurl,
    };

    axios
      .post("https://paymentz.z-pay.co.uk/api/payment-link", paymentdata)
      .then((response) => {
        console.log(response.data);
        window.location.href = response.data.data.paymentLink;
      });
  };

  const getOrderId = () => {
    return new Date().getTime().toString();
  };
  const handleCheckout = async (deliveryDetails) => {
    console.log("deliveryDetails is ", deliveryDetails);
    var cpamount = couponamount;
    var cpid = couponId;
    console.log("couponamount is ", cpamount);

    if (!deliveryDetails.delivery_option) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Please select Order Option",
      });
    } else if (deliveryDetails.booleanforpaymentmethod == 0) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Please select payment method",
      });
    } else if (main.isClosed) {
      return notification["warning"]({
        description: "Restaurant is closed",
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message:
          "This restaurant is not taking any orders right now, please visit later",
      });
    } else if (
      deliveryDetails.deliveryType == "Delivery" &&
      grandTotal < Number(main.selectedRestaurant.cost["min_order_amount"])
    ) {
      return notification["warning"]({
        description: `Minimum amount required for delivery is ${menu.restaurantInfo.monetary_symbol} ${main.selectedRestaurant.cost["min_order_amount"]}`,
        message: "Minimum amount for delivery did not meet",
        style: {
          marginTop: "90px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
      });
    } else {
      setdata({ ...state, displayloader: true });
      // return;

      const orderId = getOrderId();
      var savedAmount = "1";
      const response_format = getFormattedRequestPayload(
        // props.phone_code,
        user,
        user.selectedPickUpTime,
        menu.restaurantInfo,
        deliveryDetails,
        orderId,
        getSubTotal(),
        getSubTaxTotal(),
        getBillAmount(),
        menu.cart,
        user.distance,
        savedAmount,
        // getSavedAmount(),
        getDeliveryCharges(),
        user.user.phonecode,
        user.selectedDeliveryTime,
        cpid,
        cpamount
      );

      console.log("payload is", response_format);

      const response = await dispatch(
        placeOrder(
          getFormattedRequestPayload(
            // props.phone_code,
            user,
            user.user.selectedPickUpTime,

            menu.restaurantInfo,
            deliveryDetails,
            orderId,
            getSubTotal(),
            getSubTaxTotal(),
            getBillAmount(),
            menu.cart,
            user.distance,
            savedAmount,
            // getSavedAmount(),
            getDeliveryCharges(),
            user.user.phonecode,
            user.user.selectedDeliveryTime,
            cpid,
            cpamount
          ),
          user.user.token
        )
      );
      console.log("reponse is", response);
      const {
        data: { RESULT, message },
      } = response;
      console.log("response is", response);
      console.log("results", RESULT);
      if (RESULT == "SUCCESS") {
        console.log("if statement", deliveryDetails.paymentMethod);
        if (deliveryDetails.paymentMethod == "1") {
          sendpaymentreq("1", orderId);
          dispatch(
            couponRedeem(
              user.user.clientId,
              menu.restaurantInfo.restaurant_id,
              couponId
            )
          );

          //dispatch(clearMenuState());
        } else if (deliveryDetails.paymentMethod == "4") {
          sendpaymentreq("2", orderId);
          dispatch(
            couponRedeem(
              user.user.clientId,
              menu.restaurantInfo.restaurant_id,
              couponId
            )
          );

          // dispatch(clearMenuState());
        } else {
          dispatch(
            couponRedeem(
              user.user.clientId,
              menu.restaurantInfo.restaurant_id,
              couponId
            )
          );
          dispatch(clearMenuState());
          History.push(
            `/restId=${menu.restaurantInfo.restaurant_id}/ordersuccess?orderid=${response_format.order_id}`
          );
        }
      }
    }
  };

  function showPizzaDetails(pizza) {
    dispatch(
      openModal(modalNames.RENDER_PIZZADETAILS_CHECKOUT, {
        item: {
          ...pizza,
        },
      })
    );
  }

  const [comm, setcomm] = useState();
  function handleComments(e) {
    dispatch(setComment(e.target.value));
    setcomm(e.target.value);
  }

  const [discountnumber, setdiscountnumber] = useState();
  const [maxdiscountnumber, setmaxdiscountnumber] = useState();
  useEffect(() => {
    if (coupontypeisdiscount) {
      var amt = (Number(user.delivery_cost) + Number(getGrandTotal())).toFixed(
        2
      );
      var fp = amt / 100;
      var cp = truncateDecimal(fp * discountnumber);
      // setupdatedcouponamount(cp);
      console.log("cp & max", cp, maxdiscountnumber);
      if (maxdiscountnumber > cp || maxdiscountnumber == 0) {
        setcouponamount(cp);
      } else if (maxdiscountnumber < cp) {
        setcouponamount(maxdiscountnumber);
      }
    }
  }, [getBillAmount()]);

  useEffect(() => {
    console.log("updated coupon amount is", discountnumber);
  }, [maxdiscountnumber]);

  const [draweropen, setdraweropen] = useState(false);
  const classes = useStyle();

  const redeemCoupon = async (code, couponId) => {
    setdata({ ...state, displayloader: true });
    const response = await dispatch(
      checkCoupons(
        user.user.clientId,
        moment().format("yyyy-MM-DD"),
        menu.restaurantInfo.restaurant_id,
        code
      )
    );

    if (response.data.status == "200") {
      if (response.data.data.type == "amount") {
        setcoupontypeisdiscount(false);
        setamountaftercouponapplied(
          getBillAmount() - response.data.data.amount
        );
        setcouponisapplied(true);
        setcouponappliedname(response.data.data.coupon_name);
        setcouponamount(response.data.data.amount);
        setcouponId(response.data.data.coupon_id);
        setcouponredeemed(false);
      } else if (response.data.data.type == "discount") {
        setcoupontypeisdiscount(true);
        console.log("updated coupon amount is", response.data.data.discount);
        setdiscountnumber(response.data.data.discount);

        var billPercentAmount = getBillAmount() / 100;
        var percent_amount = truncateDecimal(
          response.data.data.discount * billPercentAmount
        );

        var max_amount = truncateDecimal(response.data.data.max_discount);
        setmaxdiscountnumber(truncateDecimal(response.data.data.max_discount));
        //  var max_amount = 30;

        // setmaxdiscountnumber(truncateDecimal(30.0));

        if (max_amount > percent_amount || max_amount == 0) {
          setcouponisapplied(true);
          setcouponappliedname(response.data.data.coupon_name);
          setcouponamount(percent_amount);
          setcouponId(response.data.data.coupon_id);
          setcouponredeemed(false);
        } else if (max_amount < percent_amount) {
          setcouponisapplied(true);
          setcouponappliedname(response.data.data.coupon_name);
          setcouponamount(max_amount);
          setcouponId(response.data.data.coupon_id);
          setcouponredeemed(false);
        }
      }
    } else if (response.data.status == "201") {
      var amount = 0;
      setcouponisapplied(false);
      setcouponredeemed(true);
      setcouponamount(amount);

      setcouponredeemedmessage(response.data.message);
    }
    console.log("response of redeem", setamountaftercouponapplied);

    setdraweropen(false);
    setdata({ ...state, displayloader: false });
  };

  return (
    <>
      {restrict ? (
        <>
          <RestrictUser />
        </>
      ) : (
        <>
          <AppHeader />
          {data.displayloader ? <LoadingBar /> : null}
          <div
            className='container margin_60_35'
            style={{
              transform: "none",

              marginTop: "50px",
            }}
          >
            <div className='row' style={{ transform: "none" }}>
              <div
                className='col-lg-5 hide-on-desktop'
                id='sidebar'
                style={{
                  position: "relative",
                  overflow: "visible",
                  boxSizing: "border-box",
                  minHeight: "1px",
                }}
              >
                <div
                  className='theiaStickySidebar'
                  style={{
                    paddingTop: "0px",
                    paddingBottom: "1px",
                    position: "static",
                    transform: "none",
                  }}
                >
                  <div
                    id='cart-box'
                    style={{
                      backgroundColor: "#eae8ed",
                      width: "100%",
                      borderRadius: "20px",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      Your Orders{" "}
                      <span style={{ color: "#666171" }}>
                        ( {menu.cart.length} items )
                      </span>
                    </p>
                    <table
                      className='table table_summary'
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        {menu.cart.map((val) => {
                          if (val.isHappyHourActive) {
                            const result = isHappyHourStillActive(
                              val,
                              menu.restaurantInfo.timezone
                            );
                            console.log("items in itemlist", val);

                            var isStillActive = result.isActive;
                            if (isStillActive) {
                              refIndex++;
                              setTimer(result.distance, timeOutRef[refIndex]);
                            }
                          }
                          return (
                            <>
                              <tr>
                                <td style={{ width: "37%" }}>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "15px",
                                      color: "black",
                                    }}
                                  >
                                    <b>{val.name}</b>
                                    <br />
                                    {val.modifiers ? (
                                      <>
                                        <div style={{ fontSize: "12px" }}>
                                          <RenderModifiers
                                            modifier={val.modifiers}
                                          />
                                        </div>
                                      </>
                                    ) : null}

                                    {val.productType == "Pizza" ? (
                                      <>
                                        <p
                                          className='text-pizzamodal'
                                          style={{
                                            marginTop: "10px",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            color: "black",
                                          }}
                                          onClick={() => showPizzaDetails(val)}
                                        >
                                          view details
                                        </p>
                                      </>
                                    ) : null}
                                  </div>
                                  <br />
                                </td>
                                <td
                                  className='qty-table'
                                  style={{ width: "30%" }}
                                >
                                  <div className='main-qty'>
                                    <div
                                      className='plus'
                                      onClick={() => handleAddItem(val)}
                                    >
                                      +
                                    </div>
                                    <div
                                      className='minus'
                                      onClick={() => handleRemoveItem(val)}
                                    >
                                      -
                                    </div>
                                    <div className='qty'>{val.qty}</div>
                                  </div>
                                </td>
                                <td>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "15px",
                                      color: "#bd1e44",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <span className='float-right'>
                                      {" "}
                                      {`${menu.restaurantInfo.monetary_symbol}`}
                                      {` ${truncateDecimal(
                                        getItemPrice(val, isStillActive)
                                      )}`}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    <table className='table table_summary'>
                      <tbody>
                        <tr>
                          <td>
                            <div
                              className='parent-textarea'
                              style={{ height: "51px" }}
                            >
                              <textarea
                                onChange={(e) => handleComments(e)}
                                maxLength='140'
                                className='textarea-class'
                                placeholder='Any suggestions for restro ?'
                              ></textarea>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />

                    <div
                      className='coupon-container'
                      onClick={() => setdraweropen(true)}
                    >
                      <p className='coupon-text'>Apply Coupon</p>
                    </div>
                    <SwipeableDrawer
                      anchor={"right"}
                      open={draweropen}
                      onClose={() => setdraweropen(false)}
                      onOpen={() => {}}
                    >
                      <div className={classes.list}>
                        <div style={{ marginTop: "20%" }}>
                          <h3
                            style={{
                              marginLeft: "40px",
                              color: "black",
                              fontSize: "23px",
                              fontWeight: "700",
                            }}
                          >
                            Available Coupons{" "}
                            <CloseIcon
                              onClick={() => setdraweropen(false)}
                              style={{
                                float: "right",
                                marginRight: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </h3>

                          {menu.coupons
                            ? menu.coupons.map((coupon) => {
                                var valid_from = moment(
                                  coupon.date_start
                                ).format("MMMM Do YYYY");
                                var valid_to = moment(coupon.date_end).format(
                                  "MMMM Do YYYY"
                                );
                                console.log("valid from date", valid_from);
                                return (
                                  <>
                                    <div className='coupon-code-container'>
                                      <div>
                                        <div>
                                          <div className='coupon-code-parent'>
                                            <p className='ccode-text'>
                                              {coupon.coupon_name}
                                            </p>
                                          </div>
                                          <br />
                                          <div className='coupon-code-border'>
                                            <div className='coupon-img'></div>
                                            <div className='coupon-text-1'>
                                              Description For Future use
                                            </div>
                                            <div className='coupon-text-2'>
                                              coupon is valid from {valid_from}{" "}
                                              to {valid_to}
                                            </div>
                                            <button
                                              className='apply-coupon-btn'
                                              onClick={() =>
                                                redeemCoupon(
                                                  coupon.code,
                                                  coupon.coupon_id
                                                )
                                              }
                                            >
                                              APPLY COUPON
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <br />
                                  </>
                                );
                              })
                            : null}
                        </div>
                      </div>
                    </SwipeableDrawer>

                    <table className='table table_summary'>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Subtotal{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getSubTotal()}`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Taxes{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getSubTaxTotal()}`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Delivery Charges
                            <span className='float-right'>{`${menu.restaurantInfo.monetary_symbol} ${user.delivery_cost}  `}</span>
                          </td>
                        </tr>

                        {couponisapplied ? (
                          <>
                            <tr>
                              <td
                                className='total'
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "750",
                                  color: "#25A09E",
                                }}
                              >
                                {couponappliedname} Offer
                                <span className='float-right'>
                                  - {menu.restaurantInfo.monetary_symbol}{" "}
                                  {couponamount}
                                </span>
                              </td>
                            </tr>
                            <br />
                          </>
                        ) : null}

                        {couponredeemed ? (
                          <>
                            <tr>
                              <td
                                className='total'
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "750",
                                  color: "red",
                                }}
                              >
                                {couponredeemedmessage} !
                              </td>
                            </tr>
                            <br />
                          </>
                        ) : null}

                        <tr>
                          <td
                            className='total'
                            style={{ fontWeight: "700", color: "black" }}
                          >
                            TOTAL{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getBillAmount()}`}</span>
                          </td>
                        </tr>
                        <br />
                        {savedAmount ? (
                          <>
                            <tr>
                              <div
                                className='savings'
                                style={{ width: "100%", marginLeft: "0px" }}
                              >
                                <p
                                  className='para-savings'
                                  style={{ margin: "auto" }}
                                >
                                  YOU SAVED{" "}
                                  {` ${savedAmount} ${menu.restaurantInfo.monetary_symbol}`}{" "}
                                  ON THE BILL
                                </p>
                              </div>
                            </tr>
                          </>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='col-lg-7'>
                <PaymentForm
                  comm={comm}
                  onHandleCheckout={handleCheckout}
                  deliveryCharges={getDeliveryCharges}
                />
              </div>
              <div
                className='col-lg-5 hide-on-mobile'
                id='sidebar'
                style={{
                  position: "relative",
                  overflow: "visible",
                  boxSizing: "border-box",
                  minHeight: "1px",
                }}
              >
                <div
                  className='theiaStickySidebar'
                  style={{
                    paddingTop: "0px",
                    paddingBottom: "1px",
                    position: "static",
                    transform: "none",
                  }}
                >
                  <div
                    id='cart-box'
                    style={{
                      backgroundColor: "#eae8ed",
                      width: "80%",
                      borderRadius: "20px",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      Your Orders{" "}
                      <span style={{ color: "#666171" }}>
                        ( {menu.cart.length} items )
                      </span>
                    </p>
                    <table
                      className='table table_summary'
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        {menu.cart.map((val) => {
                          if (val.isHappyHourActive) {
                            const result = isHappyHourStillActive(
                              val,
                              menu.restaurantInfo.timezone
                            );
                            console.log("items in itemlist", val);

                            var isStillActive = result.isActive;
                            if (isStillActive) {
                              refIndex++;
                              setTimer(result.distance, timeOutRef[refIndex]);
                            }
                          }
                          return (
                            <>
                              <tr>
                                <td style={{ width: "37%" }}>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "15px",
                                      color: "black",
                                    }}
                                  >
                                    <b>{val.name}</b>
                                    <br />
                                    {val.modifiers ? (
                                      <>
                                        <div style={{ fontSize: "12px" }}>
                                          <RenderModifiers
                                            modifier={val.modifiers}
                                          />
                                        </div>
                                      </>
                                    ) : null}

                                    {val.productType == "Pizza" ? (
                                      <>
                                        <p
                                          className='text-pizzamodal'
                                          style={{
                                            marginTop: "10px",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            color: "black",
                                          }}
                                          onClick={() => showPizzaDetails(val)}
                                        >
                                          view details
                                        </p>
                                      </>
                                    ) : null}
                                  </div>
                                  <br />
                                </td>
                                <td
                                  className='qty-table'
                                  style={{ width: "30%" }}
                                >
                                  <div className='main-qty'>
                                    <div
                                      className='plus'
                                      onClick={() => handleAddItem(val)}
                                    >
                                      +
                                    </div>
                                    <div
                                      className='minus'
                                      onClick={() => handleRemoveItem(val)}
                                    >
                                      -
                                    </div>
                                    <div className='qty'>{val.qty}</div>
                                  </div>
                                </td>
                                <td>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "15px",
                                      color: "#bd1e44",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <span className='float-right'>
                                      {" "}
                                      {`${menu.restaurantInfo.monetary_symbol}`}
                                      {` ${truncateDecimal(
                                        getItemPrice(val, isStillActive)
                                      )}`}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    <table className='table table_summary'>
                      <tbody>
                        <tr>
                          <td>
                            <div
                              className='parent-textarea'
                              style={{ height: "51px" }}
                            >
                              <textarea
                                onChange={(e) => handleComments(e)}
                                maxLength='140'
                                className='textarea-class'
                                placeholder='Any suggestions for restro ?'
                              ></textarea>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div
                      className='coupon-container'
                      onClick={() => setdraweropen(true)}
                    >
                      <p className='coupon-text'>Apply Coupon</p>
                    </div>
                    <SwipeableDrawer
                      anchor={"right"}
                      open={draweropen}
                      onClose={() => setdraweropen(false)}
                      onOpen={() => {}}
                    >
                      <div className={classes.list}>
                        <div style={{ marginTop: "20%" }}>
                          <h3
                            style={{
                              marginLeft: "40px",
                              color: "black",
                              fontSize: "23px",
                              fontWeight: "700",
                            }}
                          >
                            Available Coupons{" "}
                            <CloseIcon
                              onClick={() => setdraweropen(false)}
                              style={{
                                float: "right",
                                marginRight: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </h3>

                          {menu.coupons
                            ? menu.coupons.map((coupon) => {
                                var valid_from = moment(
                                  coupon.date_start
                                ).format("MMMM Do YYYY");
                                var valid_to = moment(coupon.date_end).format(
                                  "MMMM Do YYYY"
                                );
                                console.log("valid from date", valid_from);
                                return (
                                  <>
                                    <div className='coupon-code-container'>
                                      <div>
                                        <div>
                                          <div className='coupon-code-parent'>
                                            <p className='ccode-text'>
                                              {coupon.coupon_name}
                                            </p>
                                          </div>
                                          <br />
                                          <div className='coupon-code-border'>
                                            <div className='coupon-img'></div>
                                            <div className='coupon-text-1'>
                                              Description For Future use
                                            </div>
                                            <div className='coupon-text-2'>
                                              coupon is valid from {valid_from}{" "}
                                              to {valid_to}
                                            </div>
                                            <button
                                              className='apply-coupon-btn'
                                              onClick={() =>
                                                redeemCoupon(
                                                  coupon.code,
                                                  coupon.coupon_id
                                                )
                                              }
                                            >
                                              APPLY COUPON
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <br />
                                  </>
                                );
                              })
                            : null}
                        </div>
                      </div>
                    </SwipeableDrawer>

                    <hr />
                    <table className='table table_summary'>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Subtotal{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getSubTotal()}`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Taxes{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getSubTaxTotal()}`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "700", color: "black" }}>
                            Delivery Charges
                            <span className='float-right'>{`${menu.restaurantInfo.monetary_symbol} ${user.delivery_cost}  `}</span>
                          </td>
                        </tr>

                        {couponisapplied ? (
                          <>
                            <tr>
                              <td
                                className='total'
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "750",
                                  color: "#25A09E",
                                }}
                              >
                                {couponappliedname} Offer
                                <span className='float-right'>
                                  - {menu.restaurantInfo.monetary_symbol}{" "}
                                  {couponamount}
                                </span>
                              </td>
                            </tr>
                            <br />
                          </>
                        ) : null}

                        {couponredeemed ? (
                          <>
                            <tr>
                              <td
                                className='total'
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "750",
                                  color: "red",
                                }}
                              >
                                {couponredeemedmessage} !
                              </td>
                            </tr>
                            <br />
                          </>
                        ) : null}

                        <tr>
                          <td
                            className='total'
                            style={{ fontWeight: "700", color: "black" }}
                          >
                            TOTAL{" "}
                            <span className='float-right'>{`${
                              menu.restaurantInfo.monetary_symbol
                            } ${getBillAmount()}`}</span>
                          </td>
                        </tr>
                        <br />
                        {savedAmount ? (
                          <>
                            <tr>
                              <div
                                className='savings'
                                style={{ width: "100%", marginLeft: "0px" }}
                              >
                                <p
                                  className='para-savings'
                                  style={{ margin: "auto" }}
                                >
                                  YOU SAVED{" "}
                                  {` ${savedAmount} ${menu.restaurantInfo.monetary_symbol}`}{" "}
                                  ON THE BILL
                                </p>
                              </div>
                            </tr>
                          </>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};
export default Checkout;
