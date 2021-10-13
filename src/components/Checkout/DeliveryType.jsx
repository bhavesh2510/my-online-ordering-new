import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeliveryCost,
  setSelectedAddress,
  setIsTakeAway,
  setPickupTime,
  setDeliveryTime,
  setDefaultAddress,
  setDeliveryDistance,
} from "../../state-management/user/actions";
import moment from "moment";

const DeliveryType = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const [timeinbusinesshour, settimeinbusinesshour] = useState(false);
  const [headingfornoaddress, setheadingfornoaddress] = useState(false);

  const dispatch = useDispatch();
  const DELIVERY_TYPE = {
    DEFAULT: "Delivery",
    TAKE_AWAY: "PickUp",
    HOME_DELIVERY: "Delivery",
    EAT_IN: "EatIn",
  };

  const settime = () => {
    var moment = require("moment-timezone");

    var local_time = moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)
      .add(30, "minutes")

      .format("HH:mm");

    console.log("open", main.opening);
    console.log("close", main.closing);
    return moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)
      .add(30, "minutes")
      .format("HH:mm") >= main.opening &&
      moment
        .tz(moment(), `${menu.restaurantInfo.timezone}`)
        .add(30, "minutes")
        .format("HH:mm") <= main.closing
      ? moment
          .tz(moment(), `${menu.restaurantInfo.timezone}`)
          .add(30, "minutes")
      : moment(main.opening, "HH:mm");
  };
  const [state, setState] = useState({
    showAddress: false,
    deliveryType: "",
  });

  useEffect(() => {
    console.log("state of delivery type", state);
  }, [state]);

  const [data, setdata] = useState({
    deliveryType: user.isTakeAway ? DELIVERY_TYPE.TAKE_AWAY : "",
    // instead of "" --> DELIVERY_TYPE.HOME_DELIVERY

    // I wonder why we need these 3 states - this needs a lot of refactoring

    hasDeliveryOption: false,
    hasEatInOption: false,
    hasPickupOption: false,
    pickupTime: settime(),
    deliveryTime: settime(),
    checkingChangeAddress: false,
    showChangeAddress: false,

    address_error: "",
  });
  useEffect(() => {
    let a = JSON.parse(window.localStorage.getItem("deliveryType"));
    console.log("a in del is", a);
    if (a == "Delivery") {
      deliveryTypeClick(DELIVERY_TYPE.DEFAULT);
    } else if (a == "PickUp") {
      deliveryTypePickupClick(DELIVERY_TYPE.TAKE_AWAY);
    }

    // props.getordertype("");
    const time = moment
      .tz(moment(), `${menu.restaurantInfo.timezone}`)

      .format("HH:mm");
    const current_time = moment(time, "hh:mm A").format("HH:mm");
    if (main.selectedRestaurant.order_option) {
      setdata({
        ...data,
        hasDeliveryOption: main.selectedRestaurant.order_option
          .split(",")
          .includes("delivery"),
        hasEatinOption: main.selectedRestaurant.order_option
          .split(",")
          .includes("eatin"),
        hasPickupOption: main.selectedRestaurant.order_option
          .split(",")
          .includes("pickup"),
      });
    }
    if (current_time > main.opening && current_time < main.closing) {
      settimeinbusinesshour(true);
    }
  }, []);

  const deliveryTypeClick = (type) => {
    let a = document.getElementById("delivery");
    console.log("id of delivery", a);
    props.showAddress(true);
    props.showPickup(false);
    props.getordertype(type);
    setState({ ...state, showAddress: true, deliveryType: type });

    setdata({
      ...data,
      deliveryType: type,
      showAddress: true,
      delivery_option: true,
    });
    localStorage.setItem("deliveryType", JSON.stringify(type));

    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
    // getDeliveryCharges(user.distance);
    if (headingfornoaddress) {
      //   getDeliveryCharges(user.distance);
      //setdata({ ...data, checkingChangeAddress: true });
    }
  };
  const deliveryTypeEatinClick = (type) => {
    props.showAddress(false);
    props.showPickup(false);
    props.getordertype(type);

    dispatch(setDeliveryCost(0));
    setState({ ...state, showAddress: false, deliveryType: type });

    setdata({
      ...data,
      deliveryType: type,
      showAddress: false,
      showChangeAddress: false,
      delivery_option: true,
    });
    localStorage.setItem("deliveryType", JSON.stringify(type));
    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };
  const deliveryTypePickupClick = (type) => {
    props.showAddress(false);
    props.showPickup(true);
    props.getordertype(type);

    dispatch(setDeliveryCost(0));
    setState({ ...state, showAddress: false, deliveryType: type });
    setdata({
      ...data,
      deliveryType: type,
      showAddress: false,
      showChangeAddress: false,
      delivery_option: true,
    });
    localStorage.setItem("deliveryType", JSON.stringify(type));

    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };

  return (
    <>
      <h2 className='delivery-head-type'>Delivery type</h2>
      <div className='container-for-mobile  margin-for-desktop'>
        {data.hasDeliveryOption ? (
          <>
            <input
              className='check_payment'
              type='radio'
              name='typeofdelivery'
              id='delivery'
              checked={state.deliveryType === "Delivery"}
            />

            <label
              onClick={() => deliveryTypeClick(DELIVERY_TYPE.DEFAULT)}
              for='delivery'
              class='btn_radio'
            >
              Delivery
            </label>
          </>
        ) : null}

        {data.hasEatInOption && timeinbusinesshour ? (
          <>
            <input
              className='check_payment'
              type='radio'
              name='typeofdelivery'
              id='eatin'
            />
            <label
              onClick={() => deliveryTypeEatinClick(DELIVERY_TYPE.EAT_IN)}
              for='eatin'
              class='btn_radio'
            >
              Eat In
            </label>{" "}
          </>
        ) : null}

        {data.hasPickupOption ? (
          <>
            <input
              className='check_payment'
              type='radio'
              name='typeofdelivery'
              id='PickUp'
              checked={state.deliveryType === "PickUp"}
            />
            <label
              onClick={() => deliveryTypePickupClick(DELIVERY_TYPE.TAKE_AWAY)}
              for='PickUp'
              class='btn_radio'
            >
              Pickup
            </label>
          </>
        ) : null}
      </div>
    </>
  );
};
export default DeliveryType;
