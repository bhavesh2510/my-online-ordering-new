import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Button from "@material-ui/core/Button";
import "../Checkout/Checkout.css";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useEffect, useState } from "react";
import {
  setDeliveryCost,
  setIsTakeAway,
  setPickupTime,
} from "../../state-management/user/actions";
import { TimePicker } from "antd";
import { notification } from "antd";
import { PinDropSharp } from "@material-ui/icons";
const PaymentForm = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const DELIVERY_TYPE = {
    DEFAULT: "Delivery",
    TAKE_AWAY: "PickUp",
    HOME_DELIVERY: "Delivery",
    EAT_IN: "EatIn",
  };
  const settime = () => {
    console.log("format", moment().add(30, "minutes").format("HH:mm"));
    console.log("open", main.opening);
    console.log("close", main.closing);
    return moment().add(30, "minutes").format("HH:mm") >= main.opening &&
      moment().add(30, "minutes").format("HH:mm") <= main.closing
      ? moment().add(30, "minutes")
      : moment(main.opening, "HH:mm");
  };

  const [data, setdata] = useState({
    deliveryType: user.isTakeAway
      ? DELIVERY_TYPE.TAKE_AWAY
      : DELIVERY_TYPE.HOME_DELIVERY,
    selectedAddress: user.distance >= 0 ? user.selectedAddress : null,

    isAddressesFetched: false,
    paymentMethod: "",
    // I wonder why we need these 3 states - this needs a lot of refactoring
    openingBusinesHours: main.opening,
    closingBusinesHours: main.closing,
    businessHours: main.businessHour,
    isTakeAway: user.isTakeAway,
    orderButtonClicked: false,
    addresses: [],
    paymentOptions: [],
    deliveryCharges: "",
    hasDeliveryOption: false,
    hasEatInOption: false,
    hasPickupOption: false,
    pickupTime: settime(),
  });
  const [show, setshow] = useState(false);
  const [state, setState] = useState({
    showAddress: false,
    deliveryType: "",
  });
  const showAddressModal = () => {
    setshow(true);
  };

  useEffect(() => {
    // if (main.deliveryRange) getDeliveryCharges();
    dispatch(setPickupTime(data.pickupTime));

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
  }, []);

  const deliveryTypeClick = (type) => {
    setState({ ...state, showAddress: true });
    setdata({ ...data, deliveryType: type, showAddress: true });
    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };
  const deliveryTypeEatinClick = (type) => {
    setState({ ...state, showAddress: false });
    setdata({ ...data, deliveryType: type, showAddress: false });
    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };
  const deliveryTypePickupClick = (type) => {
    setState({ ...state, showAddress: false });
    setdata({ ...data, deliveryType: type, showAddress: false });

    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };
  const paymentOptionChange = (e) => {
    setdata({ ...data, paymentMethod: e });
    console.log("payment data", data);
  };

  const onPickupTimeChange = (time, timeString) => {
    // if (!data.businessHours) {
    //   setdata({ ...data, pickupTime: null });

    //   return false;
    // }
    // we are moving in circles here, we have separate opening and closing object, this is unnecessary code.
    const selectedTime = moment(time, "HH:mm");
    console.log("selected time", selectedTime);
    const businessHoursFromTo = data.businessHours.split(" - ");
    const businessHoursFrom = moment(businessHoursFromTo[0], "HH:mm");
    const businessHoursTo = moment(businessHoursFromTo[1], "HH:mm");
    console.log("from", businessHoursFrom);
    console.log("To", businessHoursTo);

    if (selectedTime > businessHoursFrom && selectedTime < businessHoursTo) {
      setdata({ ...data, pickupTime: selectedTime });
      dispatch(setPickupTime(timeString));
      notification["success"]({
        message: "Time changed Successfully",
        style: {
          marginTop: "50px",

          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        placement: "topLeft",
      });
    } else {
      setdata({ ...data, pickupTime: null });
      notification["warning"]({
        message: "Sorry, Please select time between business hours",
        style: {
          marginTop: "50px",

          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        placement: "topLeft",
      });
    }
  };
  const onClick = () => {
    props.onHandleCheckout(data);
  };
  return (
    <>
      <div className="box_style_2">
        <h2 className="delivery-head">Select Delivery type</h2>
        {data.hasDeliveryOption ? (
          <>
            <input
              className="check_payment"
              type="radio"
              name="typeofdelivery"
              id="delivery"
            />

            <label
              onClick={() => deliveryTypeClick(DELIVERY_TYPE.DEFAULT)}
              for="delivery"
              class="btn_radio"
            >
              Delivery
            </label>
          </>
        ) : null}

        {data.hasEatInOption ? (
          <>
            <input
              className="check_payment"
              type="radio"
              name="typeofdelivery"
              id="eatin"
            />
            <label
              onClick={() => deliveryTypeEatinClick(DELIVERY_TYPE.EAT_IN)}
              for="eatin"
              class="btn_radio"
            >
              Eat In
            </label>{" "}
          </>
        ) : null}

        {data.hasPickupOption ? (
          <>
            <input
              className="check_payment"
              type="radio"
              name="typeofdelivery"
              id="pickup"
            />
            <label
              onClick={() => deliveryTypePickupClick(DELIVERY_TYPE.TAKE_AWAY)}
              for="pickup"
              class="btn_radio"
            >
              Pickup
            </label>
          </>
        ) : null}
      </div>

      {state.showAddress ? (
        <div
          className="box_style_2"
          style={{ cursor: "pointer" }}
          onClick={showAddressModal}
        >
          <h2 className="delivery-head">
            Delivery Address{" "}
            <img
              src="https://i.ibb.co/TmCnRTh/Tick-Mark-Dark-512.png"
              height="90px"
              width="70px"
            />
          </h2>
          {show ? (
            <>
              <strong style={{ fontSize: "20px" }}>Home</strong>
              <br />
              <br />
              <p>Bhavesh Singh</p>
              <p>barrack no:390 room no:14 near postoffice</p>
              <p>Ulhasnagar</p>
              <p>Mumbai</p>
            </>
          ) : null}
        </div>
      ) : null}

      {user.isTakeAway ? (
        <div
          className="box_style_2"
          style={{ cursor: "pointer" }}
          onClick={showAddressModal}
        >
          <h2 className="delivery-head">Pickup Details</h2>
          <div className="pickup-details">
            <h3>
              <strong>Business hours are {main.businessHour}</strong>
            </h3>
            <br />
            <div className="address-details" style={{ color: "black" }}>
              selected pickup time : &nbsp;
              <TimePicker
                defaultValue={data.pickupTime}
                onChange={onPickupTimeChange}
                format="HH:mm"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="box_style_2">
        <h2 className="delivery-head">Choose Payment method</h2>

        {data.paymentOptions.map((val) => {
          if (val == "0")
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="cash"
                    value="0"
                    onChange={(e) => paymentOptionChange("0")}
                  />
                  <label className="payment-class" for="cash">
                    Pay With Cash &nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          else if (val == "1") {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="card"
                    value="1"
                    onChange={(e) => paymentOptionChange("1")}
                  />
                  <label className="payment-class" for="card">
                    Pay With Card &nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          } else if (val == "2") {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="cashondelivery"
                    value="2"
                    onChange={(e) => paymentOptionChange("2")}
                  />
                  <label className="payment-class" for="cashondelivery">
                    cash on delivery
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          } else if (val == "3") {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="cardondelievry"
                    value="3"
                    onChange={(e) => paymentOptionChange("3")}
                  />
                  <label className="payment-class" for="cardondelivery">
                    Card On Delivery&nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          } else if (val == "4") {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="paywithpoints"
                    value="4"
                    onChange={(e) => paymentOptionChange("4")}
                  />
                  <label className="payment-class" for="paywithpoints">
                    Open Banking &nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          } else if (val == "5") {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="paypal"
                    value="5"
                    onChange={(e) => paymentOptionChange("5")}
                  />
                  <label className="payment-class" for="paypal">
                    PayPal &nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          } else {
            return (
              <>
                <div className="payment_select">
                  <input
                    type="radio"
                    name="payment"
                    id="others"
                    value="6"
                    onChange={(e) => paymentOptionChange("6")}
                  />
                  <label className="payment-class" for="others">
                    Other &nbsp;
                    <AccountBalanceWalletIcon />
                  </label>
                </div>
              </>
            );
          }
        })}
        <table className="table table_summary">
          <tbody>
            <tr>
              <Button
                onClick={onClick}
                style={{
                  backgroundColor: "#6244da",
                  color: "white",
                  width: "100%",
                  padding: "10px",
                }}
              >
                proceed to pay <strong>&nbsp;</strong>
              </Button>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default PaymentForm;
