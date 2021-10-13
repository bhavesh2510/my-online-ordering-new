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
  setDeliveryTime,
  setDefaultAddress,
  setDeliveryDistance,
} from "../../state-management/user/actions";
import { TimePicker } from "antd";
import { notification } from "antd";
import { NaturePeopleOutlined, PinDropSharp } from "@material-ui/icons";
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
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import DeliveryType from "./DeliveryType";
import TakeAddress from "./TakeAddress";
import SelectTimingsForDelivery from "./SelectTimingsForDelivery";
import SelectTimingsForPickup from "./SelectTimingsForPickup";
Geocode.setApiKey("AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs");

const PaymentForm = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const [showpickup, setshowpickup] = useState(false);
  const [getOrderType, setgetOrderType] = useState();
  const [getTime, setgetTime] = useState();
  const [getAddress, setgetAddress] = useState();
  const [listofpayment, setlistofpayment] = useState([]);
  const [getpaymentoption, setgetpaymentoption] = useState();
  const [deliveryCharges, setdeliveryCharges] = useState();
  const [renderDeliveryType, setrenderDeliveryType] = useState(false);
  const [renderTakeAddress, setrenderTakeAddress] = useState(false);

  const dispatch = useDispatch();

  const [frompayment, setfrompayment] = useState(false);

  // useEffect(async () => {
  //   console.log("not from checkout", frompayment);
  //   if (frompayment) {
  //     setTimeout(async () => {
  //       const { payload } = await dispatch(
  //         fetchAddressesList(user.user.clientId)
  //       );
  //       console.log("payload after 2 seconds", payload);
  //     }, 2000);
  //   }
  // }, [frompayment]);

  // useEffect(() => {
  //   setdata({ ...data, comments: props.comm });
  // }, [props.comm]);
  // const [data, setdata] = useState({
  //   // deliveryType: user.isTakeAway ? DELIVERY_TYPE.TAKE_AWAY : "",
  //   // instead of "" --> DELIVERY_TYPE.HOME_DELIVERY
  //   selectedAddress: user.selectedAddress,
  //   delivery_option: false,
  //   //selectedAddress: "",
  //   //changeaddress: [],

  //   isAddressesFetched: false,
  //   paymentMethod: "",
  //   booleanforpaymentmethod: 0,
  //   // I wonder why we need these 3 states - this needs a lot of refactoring
  //   openingBusinesHours: main.opening,
  //   closingBusinesHours: main.closing,
  //   businessHours: main.businessHour,
  //   isTakeAway: user.isTakeAway,
  //   orderButtonClicked: false,
  //   addresses: [],
  //   paymentOptions: [],
  //   deliveryCharges: "",
  //   // hasDeliveryOption: false,
  //   // hasEatInOption: false,
  //   // hasPickupOption: false,
  //   // pickupTime: settime(),
  //   // deliveryTime: settime(),
  //   checkingChangeAddress: false,
  //   showChangeAddress: false,

  //   address_error: "",
  // });

  console.log("props comments", props.comm);

  // const initialize = async () => {
  //   // check if user logged in, else return
  //   if (!user.user.isUserLoggedIn) {
  //     return;
  //   }
  //   // this.props.setPickupTime(this.state.pickupTime);
  //   fetchAddresses();
  // };

  useEffect(() => {
    // dispatch(setSelectedAddress(user.defaultAddress));
    // const time = new Date().toLocaleTimeString();

    const deliveryOptions = !(
      main.selectedRestaurant.order_option === "" ||
      main.selectedRestaurant.order_option === null ||
      main.selectedRestaurant.order_option === undefined
    );

    setlistofpayment(main.selectedRestaurant.payment_option_ids.split(","));
    dispatch(setDeliveryCost(0));
    // let x = JSON.parse(window.localStorage.getItem("deliveryType"));
    // let y = JSON.parse(window.localStorage.getItem("checkoutState"));
    let z = JSON.parse(window.localStorage.getItem("paymentType"));

    // if (x) {
    //   setrenderDeliveryType(true);
    // } else if (y) {
    //   setrenderTakeAddress(true);
    // } else
    if (z) {
      setgetpaymentoption(z);
    }
  }, []);

  const paymentOptionChange = (e) => {
    setgetpaymentoption(e);
    localStorage.setItem("paymentType", JSON.stringify(e));
  };

  const onClick = () => {
    let data = {
      deliveryType: getOrderType,
      selectedAddress: getAddress,
      paymentMethod: getpaymentoption,
      comments: props.comm,
      PickupTime: getTime,
      DeliveryTime: getTime,
    };
    console.log("new data from child in on click", data);
    if (!getOrderType) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Please select Order Option",
      });
    } else if (getOrderType == "Delivery" && !getAddress) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Please select Atleast one address",
      });
    } else if (!getpaymentoption) {
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
      getOrderType == "Delivery" &&
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
      props.onHandleCheckout(data);
    }
  };

  const getDisabledMinutes = () => {
    let minutes = [];
    for (let i = 0; i < moment().minute() + 30; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  // const handleChangeDefautAddress = async (address) => {
  //   console.log("address in default address change", address);
  //   const lat = main.selectedRestaurant.lat;
  //   const lon = main.selectedRestaurant.lon;

  //   const response = await Geocode.fromAddress(address);

  //   var geocoder = new window.google.maps.Geocoder();
  //   var address = `${address.zipcode}`;

  //   geocoder.geocode({ address: address }, function (results, status) {
  //     var latitude = results[0].geometry.location.lat();
  //     var longitude = results[0].geometry.location.lng();
  //     console.log("geocoder", latitude, results);
  //   });

  //   const { lat: customerLat, lng: customerLng } =
  //     response.results[0].geometry.location;

  //   console.log("in handleDefaut", api);
  //   // api.calculateDistance(
  //   //   // {
  //   //   //   lat,
  //   //   //   lng: lon,
  //   //   // },
  //   //   // {
  //   //   //   lat: customerLat,
  //   //   //   lng: customerLng,
  //   //   // },
  //   //   address.address1,
  //   //   address.city,
  //   //   address.zipcode,
  //   //   address.country,

  //   //   handleChangeDistanceCalucationCallback
  //   // );
  // };

  const grandTotal = Number(getGrandTotal());

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

  const [handleadd, sethandleadd] = useState(false);

  // useEffect(async () => {
  //   if (handleadd) {
  //     const { payload } = await dispatch(
  //       fetchAddressesList(user.user.clientId)
  //     );
  //     console.log("payload in fetchadderss", payload);

  //     setadd({ ...add, addresses: payload.data });
  //     sethandleadd(false);
  //   }
  // }, [handleadd]);

  const [showAddres, setShowAddres] = useState(false);

  useEffect(() => {
    console.log("order type info", getpaymentoption);
  }, [getpaymentoption]);

  return (
    <>
      <div className='box_style_2 delivery-container'>
        <DeliveryType
          showAddress={setShowAddres}
          getordertype={setgetOrderType}
          showPickup={setshowpickup}
        />
      </div>

      {showAddres ? (
        <TakeAddress getAddress={setgetAddress} getdc={setdeliveryCharges} />
      ) : null}

      {showpickup ? (
        <SelectTimingsForPickup getpickuptime={setgetTime} />
      ) : null}

      {showAddres ? (
        <SelectTimingsForDelivery getdeliverytime={setgetTime} />
      ) : null}

      <div className='box_style_2' style={{ marginTop: "-30px" }}>
        <h2 className='delivery-head'>Payment method</h2>

        <div className='payment-container'>
          {listofpayment.map((val) => {
            if (val == "1") {
              return (
                <>
                  {/* <div className="payment_select"> */}
                  {/* <input
                    type="radio"
                    name="payment"
                    id="card"
                    value="1"
                    onChange={(e) => paymentOptionChange("1")}
                  />
                  <label className="payment-class" for="card">
                    Pay With Card

                     &nbsp; <CreditCardIcon />
                  </label> */}

                  <input
                    className='check_payment'
                    type='radio'
                    name='payment'
                    id='card'
                    value='1'
                    onChange={(e) => paymentOptionChange("1")}
                    checked={getpaymentoption == "1"}
                  />

                  <label
                    className='payment-class'
                    for='card'
                    class='btn_radio_for_payment'
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Pay With Card
                  </label>

                  {/* </div> */}
                </>
              );
            } else if (val == "2") {
              return (
                <>
                  {/* <div className="payment_select"> */}
                  {/* <input
                    type="radio"
                    name="payment"
                    id="cashondelivery"
                    value="2"
                    onChange={(e) => paymentOptionChange("2")}
                  />
                  <label className="payment-class" for="cashondelivery">
                    cash on delivery &nbsp;
                    <AccountBalanceWalletIcon />
                  </label> */}

                  <input
                    className='check_payment'
                    type='radio'
                    name='payment'
                    id='cashondelivery'
                    value='2'
                    onChange={(e) => paymentOptionChange("2")}
                    checked={getpaymentoption == "2"}
                  />

                  <label
                    className='payment-class'
                    for='cashondelivery'
                    class='btn_radio_for_payment'
                    style={{ whiteSpace: "nowrap" }}
                  >
                    cash on delivery
                  </label>
                  {/* </div> */}
                </>
              );
            } else if (val == "5") {
              return (
                <>
                  {/* <div className="payment_select"> */}
                  {/* <input
                    type="radio"
                    name="payment"
                    id="paywithpoints"
                    value="4"
                    onChange={(e) => paymentOptionChange("4")}
                  />
                  <label className="payment-class" for="paywithpoints">
                    Open Banking &nbsp;
                    <AccountBalanceIcon />
                  </label> */}

                  <input
                    className='check_payment'
                    type='radio'
                    name='payment'
                    id='paywithpoints'
                    value='4'
                    onChange={(e) => paymentOptionChange("4")}
                    checked={getpaymentoption == "4"}
                  />

                  <label
                    className='payment-class'
                    for='paywithpoints'
                    class='btn_radio_for_payment'
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Open Banking
                  </label>

                  {/* <CreditCardIcon />
                  <AccountBalanceIcon />
                  <AccountBalanceWalletIcon /> */}

                  {/* </div> */}
                </>
              );
            }
          })}
        </div>
        <div className='paymentform-btn-container'>
          <Button
            onClick={onClick}
            style={{
              backgroundColor: "#5c48d2",
              color: "white",
              width: "100%",
              padding: "10px",
              textTransform: "none",
              fontSize: "17px",
              borderRadius: "10px",
            }}
          >
            Proceed To Pay<strong>&nbsp;</strong>
          </Button>
        </div>
      </div>
    </>
  );
};
export default PaymentForm;
