import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Button from "@material-ui/core/Button";
import "../Checkout/Checkout.css";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import {
  setDeliveryCost,
  setSelectedAddress,
  setIsTakeAway,
  setPickupTime,
  setDefaultAddress,
  setDeliveryDistance,
} from "../../state-management/user/actions";
import { TimePicker } from "antd";
import { notification } from "antd";
import { PinDropSharp } from "@material-ui/icons";
import Address from "../ManageAddress/Address";
import { fetchAddressesList } from "../../state-management/user/asyncActions";
import GoogleMap from "../GoogleMap/GoogleMap";
import Geocode from "react-geocode";
import AddAddress from "../ChooseAddress/AddAddress";
import { useTheme } from "@material-ui/core";
import { truncateDecimal } from "../../state-management/menu/utils";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import ChooseAddress from "../ChooseAddress/ChooseAddress";
import { openModal, closeModal } from "../../state-management/modal/actions";
import { displayAddressModal } from "../../state-management/menu/actions";
Geocode.setApiKey("AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs");

const PaymentForm = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
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
  const [api, setapi] = useState();

  const [add, setadd] = useState({
    addresses: [],
  });
  useEffect(() => {
    fetchAddressesList();
  }, [add]);

  const [data, setdata] = useState({
    deliveryType: user.isTakeAway
      ? DELIVERY_TYPE.TAKE_AWAY
      : DELIVERY_TYPE.HOME_DELIVERY,
    selectedAddress: user.selectedAddress,
    //selectedAddress: "",
    //changeaddress: [],

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
    showChangeAddress: false,

    address_error: "",
  });

  const initialize = async () => {
    // check if user logged in, else return
    if (!user.user.isUserLoggedIn) {
      return;
    }
    // this.props.setPickupTime(this.state.pickupTime);
    fetchAddresses();
  };

  const [show, setshow] = useState(false);
  const [state, setState] = useState({
    showAddress: false,
    deliveryType: "",
  });

  const handleGoogleApi = (google) => {
    //if (!state.googleApi) setState({ ...state, googleApi: google });

    console.log("google in payment form", google);
    setapi(google);
  };

  const showAddressModal = () => {
    setshow(true);
  };

  useEffect(() => {
    // if (main.deliveryRange) getDeliveryCharges();
    if (api) {
      dispatch(setPickupTime(data.pickupTime));
      fetchAddresses();
      //getDeliveryCharges();
    }
  }, [api]);

  useEffect(() => {
    dispatch(setSelectedAddress(user.defaultAddress));

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
    //getDeliveryCharges();
  };
  const deliveryTypeEatinClick = (type) => {
    setState({ ...state, showAddress: false });
    setdata({
      ...data,
      deliveryType: type,
      showAddress: false,
      showChangeAddress: false,
    });
    dispatch(setIsTakeAway(type === DELIVERY_TYPE.TAKE_AWAY));
  };
  const deliveryTypePickupClick = (type) => {
    setState({ ...state, showAddress: false });
    setdata({
      ...data,
      deliveryType: type,
      showAddress: false,
      showChangeAddress: false,
    });

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

  const getMinHours = () => {
    const businessHoursFrom = parseInt(
      data.businessHours.split("-")[0].split(":")[0]
    );

    const minHours = [];
    for (let i = 0; i < businessHoursFrom; i++) {
      minHours.push(i);
    }
    // console.log(minHours);
    return minHours;
  };

  // ? Get the businesss hours end from businessHours props
  const getMaxHours = () => {
    const businessHoursTo = parseInt(
      data.businessHours.split("-")[1].split(":")[0]
    );
    const maxHours = [];
    if (Number(data.businessHours.split("-")[1].split(":")[1] > 0)) {
      for (let i = businessHoursTo + 1; i < 24; i++) {
        maxHours.push(i);
      }
    } else {
      for (let i = businessHoursTo; i < 24; i++) {
        maxHours.push(i);
      }
      // console.log( Number((this.state.businessHours.split("-")[1].split(":")[1]) <0))
    }

    // console.log(this.state.businessHours.split("-")[1].split(":")[1]);
    return maxHours;
  };
  const getDisabledHours = () => {
    let hours = [...getMinHours(), ...getMaxHours()]; //? restricting business hours in timer, so no need for seperate validation for pickup time
    if (moment().minute() > 30) {
      for (let i = 0; i < moment().hour() + 1; i++) {
        hours.push(i);
      }
    }

    for (let i = 0; i < moment().hour(); i++) {
      hours.push(i);
    }
    // console.log(hours);
    return hours;
  };

  const getDisabledMinutes = () => {
    let minutes = [];
    for (let i = 0; i < moment().minute() + 30; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  useEffect(() => {
    console.log("datat is", add);
  }, [add]);

  const fetchAddresses = async () => {
    setdata({ ...data, isAddressesFetched: false });
    // const {
    //   payload: { data: addresses },
    // } = await dispatch(fetchAddressesList(user.user.clientId));

    const { payload } = await dispatch(fetchAddressesList(user.user.clientId));
    console.log("payload in fetchadderss", payload);
    var arr = [];
    arr.push(payload.data);
    setadd({ ...add, addresses: payload.data });
    //setdata({ ...data, addresses: payload, isAddressesFetched: true });
    console.log("dtdtd", data);

    const defaultAddress = payload.data.filter(
      (address) => address.is_default === "1",
      [0]
    );
    console.log("defaultAddress from fetchaddress: ", defaultAddress);
    dispatch(setDefaultAddress(defaultAddress));
    handleDefautAddress(defaultAddress);

    if (!data.selectedAddress) {
      console.log("passed");
      handleDefautAddress(defaultAddress);
      //  setdata({ ...data, selectedAddress: defaultAddress }); // ? will run only after refresh and no address is selected
    }

    console.log("Selecetd Address: ", data.selectedAddress);
    // this.props.setSelectedAddress(defaultAddress)

    // this.handleMultipleAddress()
  };

  const handleDefautAddress = async (address) => {
    console.log("address in default address", address);
    const lat = main.selectedRestaurant.lat;
    const lon = main.selectedRestaurant.lon;

    const response = await Geocode.fromAddress(address[0].address1);

    const { lat: customerLat, lng: customerLng } =
      response.results[0].geometry.location;

    console.log("in handleDefaut", api);
    api.calculateDistance(
      {
        lat,
        lng: lon,
      },
      {
        lat: customerLat,
        lng: customerLng,
      },
      handleDistanceCalucationCallback
    );
  };

  const handleDistanceCalucationCallback = async (result) => {
    console.log("distance is", result);
    // return;
    if (result.status === "SUCCESS") {
      const distance = parseFloat(result.distance / 1000);

      dispatch(setDeliveryDistance(distance));

      //getDeliveryCharges();
    } else {
      console.log("error: ", result.reason);
      setdata({ ...data, address_error: result.reason });
    }
  };

  const onChangeAddressCall = () => {
    setdata({ ...data, showChangeAddress: true });
    setState({ ...state, showAddress: false });
  };

  const handleMultipleAddress = (address) => {
    // dispatch(setDefaultAddress(address));
    dispatch(setSelectedAddress(address));

    //setadd({ ...add, addresses: user.selectedAddress });
    setdata({
      ...data,
      changeaddress: address,
      selectedAddress: address,
      showChangeAddress: false,
    });
    setState({ ...state, showAddress: true });
    handleChangeDefautAddress(address);

    //  getDeliveryCharges();

    console.log("add is");
  };

  const handleChangeDefautAddress = async (address) => {
    console.log("address in default address", address);
    const lat = main.selectedRestaurant.lat;
    const lon = main.selectedRestaurant.lon;

    const response = await Geocode.fromAddress(address.address1);

    const { lat: customerLat, lng: customerLng } =
      response.results[0].geometry.location;

    console.log("in handleDefaut", api);
    api.calculateDistance(
      {
        lat,
        lng: lon,
      },
      {
        lat: customerLat,
        lng: customerLng,
      },
      handleChangeDistanceCalucationCallback
    );
  };

  const handleChangeDistanceCalucationCallback = async (result) => {
    console.log("distance is", result);
    // return;
    if (result.status === "SUCCESS") {
      const distance = parseFloat(result.distance / 1000);
      dispatch(setDeliveryDistance(distance));
    } else {
      console.log("error: ", result.reason);
      setdata({ ...data, address_error: result.reason });
    }
  };

  const grandTotal = Number(getGrandTotal());
  const getDeliveryCharges = () => {
    if (!main.deliveryRange) return;
    const cost = main.deliveryRange.cost;
    const range = main.deliveryRange.range;
    const isTakeAway = user.isTakeAway;
    const distance = user.distance;
    console.log("distance range", range);

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

    console.log("details of range is", isFreeDelivery);

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

      console.log("range details", selectedRange);

      // selectedRange
      //   ?( Number(selectedRange["delivery_cost"]) || 0)
      //   : Number(stdDeliveryCost);

      if (selectedRange) {
        if (selectedRange["delivery_cost"]) {
          dispatch(setDeliveryCost(selectedRange["delivery_cost"]));
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
  useEffect(() => {
    console.log("new data", data);
  }, [data]);

  const modalNames = {
    ADD_ADDRESS: "AddAddress",
    CHOOSE_ADDRESS: "ChooseAddress",
    FIND_ADDRESS: "findAddress",
  };

  const [handleadd, sethandleadd] = useState(false);
  const handleAddAddressOnPaymentForm = async () => {
    dispatch(displayAddressModal(true));
    dispatch(
      openModal(modalNames.FIND_ADDRESS, {
        addAddress: true,
        existingDefaultAddress: state.addresses
          ? state.addresses &&
            state.addresses.find((addr) => addr["is_default"] === "1")
          : null,
      })
    );

    // setdata({
    //   ...data,
    //   changeaddress: user.selectedAddress,
    //   showChangeAddress: false,
    // });

    // setState({ ...state, showAddress: true });
  };

  useEffect(async () => {
    if (handleadd) {
      const { payload } = await dispatch(
        fetchAddressesList(user.user.clientId)
      );
      console.log("payload in fetchadderss", payload);

      setadd({ ...add, addresses: payload.data });
      sethandleadd(false);
    }
  }, [handleadd]);

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
          <div>
            <h2 className="delivery-head">
              Delivery Address{" "}
              <img
                src="https://i.ibb.co/TmCnRTh/Tick-Mark-Dark-512.png"
                height="50px"
                width="50px"
              />
            </h2>

            <span class="address-change" onClick={onChangeAddressCall}>
              Change
            </span>

            <>
              {console.log("address is", data.selectedAddress)}

              <>
                {data.changeaddress ? (
                  <>
                    <p
                      style={{
                        textTransform: "uppercase",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {data.changeaddress.name}
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      {data.changeaddress.address1}, &nbsp;{" "}
                      {data.changeaddress.address2} &nbsp;
                      {data.changeaddress.state}, &nbsp;
                    </p>

                    <p style={{ fontSize: "15px" }}>
                      {data.changeaddress.city} - &nbsp;
                      {data.changeaddress.zipcode} , &nbsp;{" "}
                      {data.changeaddress.country}
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        textTransform: "uppercase",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {user.defaultAddress[0].name}
                    </p>
                    <p style={{ fontSize: "15px" }}>
                      {user.defaultAddress[0].address1}, &nbsp;{" "}
                      {user.defaultAddress[0].address2} &nbsp;
                      {user.defaultAddress[0].state}, &nbsp;
                    </p>

                    <p style={{ fontSize: "15px" }}>
                      {user.defaultAddress[0].city} - &nbsp;
                      {user.defaultAddress[0].zipcode} , &nbsp;{" "}
                      {user.defaultAddress[0].country}
                    </p>
                  </>
                )}
              </>

              {}
            </>
            {/* {show ? (
              <>
                <span class="address-change" onClick={onChangeAddressCall}>
                  Change
                </span>
              </>
            ) : null} */}
          </div>

          {/* {show ? (
            <>
              {console.log("address is", data.selectedAddress)}

              <p
                style={{
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                {data.selectedAddress[0].name}
              </p>
              <p style={{ fontSize: "15px" }}>
                {data.selectedAddress[0].address1}, &nbsp;{" "}
                {data.selectedAddress[0].address2} &nbsp;
                {data.selectedAddress[0].state}, &nbsp;
              </p>

              <p style={{ fontSize: "15px" }}>
                {data.selectedAddress[0].city} - &nbsp;
                {data.selectedAddress[0].zipcode} , &nbsp;{" "}
                {data.selectedAddress[0].country}
              </p>
            </>
          ) : null} */}
        </div>
      ) : null}

      {data.showChangeAddress ? (
        <>
          <div
            className="box_style_2"
            // style={{ cursor: "pointer" }}
            // onClick={showAddressModal}
          >
            <div>
              <h2 className="delivery-head">Your Addresses </h2>
            </div>

            {add.addresses.map((address, i) => {
              console.log("add", address);
              return (
                <>
                  <section
                    className="address-section-paymentform"
                    // key={i}
                  >
                    <Address address={address} key={i} />
                    <ul className="address-actions">
                      <li //onClick={() => callAddressModal(true, address)}
                      >
                        <span>
                          <h5
                            className="actions"
                            onClick={() => handleMultipleAddress(address)}
                            style={{
                              height: "35px",
                              paddingTop: "8px",
                            }}
                          >
                            Deliver Here
                          </h5>
                        </span>
                      </li>
                    </ul>
                  </section>
                </>
              );
            })}
            <div
              className="checkout-add-address"
              onClick={handleAddAddressOnPaymentForm}
              style={{
                width: "100%",
                backgroundColor: "#f1f1f1",
                height: "70px",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  margin: "20px",
                  fontSize: "25px",
                  paddingLeft: "20px",
                  paddingTop: "18px",
                  textTransform: "uppercase",
                }}
              >
                <AddIcon />
                &nbsp; Add New Address
              </p>
            </div>
          </div>
        </>
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
                disabledHours={getDisabledHours}
                onChange={onPickupTimeChange}
                format="HH:mm"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ display: "none" }}>
        <GoogleMap
          address={main.selectedRestaurant.address}
          lat={Number(main.selectedRestaurant.lat)}
          lng={Number(main.selectedRestaurant.lon)}
          googleApi={handleGoogleApi}
        />
      </div>

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

      {modal.modal.modalToShow == "findAddress" ? (
        <ChooseAddress refetchAddresses={sethandleadd} />
      ) : null}
    </>
  );
};
export default PaymentForm;
