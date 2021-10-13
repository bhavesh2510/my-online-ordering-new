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

Geocode.setApiKey("AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs");
const TakeAddress = (props) => {
  const modalNames = {
    ADD_ADDRESS: "AddAddress",
    CHOOSE_ADDRESS: "ChooseAddress",
    FIND_ADDRESS: "findAddress",
  };
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const [api, setapi] = useState();
  const [handleadd, sethandleadd] = useState(false);
  const [AddressFromAdd, setAddressFromAdd] = useState();
  const [heading, setheading] = useState({
    add: "Add Delivery Address",
    change: "Delivery Address",

    addBtn: "Add",
    changeBtn: "change",
  });
  const [changeaddress, setchangeaddress] = useState({
    boolean: false,
    data: "",
    listOfAddress: false,
    headingfornoaddress: true,
  });
  const [data, setdata] = useState({
    // deliveryType: user.isTakeAway ? DELIVERY_TYPE.TAKE_AWAY : "",
    // instead of "" --> DELIVERY_TYPE.HOME_DELIVERY
    selectedAddress: user.selectedAddress,
    delivery_option: false,
    //selectedAddress: "",
    //changeaddress: [],

    isAddressesFetched: false,
    paymentMethod: "",
    booleanforpaymentmethod: 0,
    // I wonder why we need these 3 states - this needs a lot of refactoring
    openingBusinesHours: main.opening,
    closingBusinesHours: main.closing,
    businessHours: main.businessHour,
    isTakeAway: user.isTakeAway,
    orderButtonClicked: false,
    addresses: [],
    paymentOptions: [],
    deliveryCharges: "",
    // hasDeliveryOption: false,
    // hasEatInOption: false,
    // hasPickupOption: false,
    // pickupTime: settime(),
    // deliveryTime: settime(),
    checkingChangeAddress: false,
    showChangeAddress: false,

    address_error: "",
  });
  const [show, setshow] = useState(false);
  const [add, setadd] = useState({
    addresses: [],
  });

  const [defaultadd, setdefaultadd] = useState(false);
  useEffect(() => {
    fetchAddresses();
    let x = JSON.parse(window.localStorage.getItem("checkoutState"));
    if (x) {
      setchangeaddress({
        ...changeaddress,
        boolean: x.boolean,
        data: x.data,
        listOfAddress: x.listOfAddress,
        headingfornoaddress: x.headingfornoaddress,
      });
    }
  }, []);

  useEffect(() => {
    if (!defaultadd) {
      fetchAddresses();
    }
  }, [handleadd]);

  useEffect(() => {
    console.log("comments in prps", props.comments);
  }, [props.comments]);
  //   const [headingfornoaddress, setheadingfornoaddress] = useState(true);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    showAddress: false,
    deliveryType: "",
  });

  const showAddressModal = () => {
    setshow(true);
  };
  const onChangeAddressCall = () => {
    // setheadingfornoaddress(false);
    setchangeaddress({
      ...changeaddress,
      listOfAddress: true,
      boolean: false,
      headingfornoaddress: false,
    });
    localStorage.setItem("checkoutState", JSON.stringify(changeaddress));

    // setdata({ ...data, showChangeAddress: true });
    // setState({ ...state, showAddress: false });
  };
  const handleAddAddressOnPaymentForm = async () => {
    sethandleadd(false);
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
  const handleMultipleAddress = (address) => {
    props.getAddress(address);
    // dispatch(setDefaultAddress(address));

    // dispatch(setSelectedAddress(address));
    // setchangeaddress({
    //   ...changeaddress,
    //   boolean: true,
    //   data: address,
    //   showChangeAddress: false,
    // });

    //setadd({ ...add, addresses: user.selectedAddress });

    const service = new window.google.maps.DistanceMatrixService();

    // const originCord = `${origin.lat},${origin.lng}`;
    // const destinationCord = `${destination.lat},${destination.lng}`;

    const originCord = `${main.selectedRestaurant.address},${main.selectedRestaurant.city}, ${main.selectedRestaurant.zipcode}, ${main.selectedRestaurant.country}`;
    const destinationCord = `${address.address1},${address.city},${address.zipcode},${address.country}`;

    console.log("destination is", destinationCord, originCord);

    service.getDistanceMatrix(
      {
        origins: [originCord],
        destinations: [destinationCord],
        travelMode: "DRIVING",
        durationInTraffic: true,
        avoidHighways: false,
        // unitSystem: props.google.maps.UnitSystem.METRIC,
        avoidTolls: false,
      },
      (response) => {
        let reason;

        let distance;

        let status;

        console.log("response in google payemnt", response);

        if (
          response.rows[0].elements[0].distance === undefined &&
          response.destinationAddresses[0] === "0,0"
        ) {
          // user has to choose some correct address
          reason = "Please choose an address";
          status = "FAILED";
        } else if (
          response.rows[0].elements[0].status !== undefined &&
          response.rows[0].elements[0].status === "ZERO_RESULTS"
        ) {
          reason = "Sorry, Chosen address is out of delivery range!";
          status = "FAILED";
        } else {
          status = "SUCCESS";
          distance = response.rows[0].elements[0].distance.value;
        }
        console.log("distance above range", distance);
        if (!isDistanceInDeliveryRange(distance / 1000, main.deliveryRange)) {
          notification["warning"]({
            message: "This Address is out of range now !",
            style: {
              marginTop: "50px",

              color: "rgba(0, 0, 0, 0.65)",
              border: "1px solid #b7eb8f",
              backgroundColor: "#f6ffed",
            },
            placement: "topRight",
          });
        } else {
          dispatch(setSelectedAddress(address));
          setchangeaddress({
            ...changeaddress,
            boolean: true,
            data: address,
            listOfAddress: false,
            headingfornoaddress: true,
          });
          localStorage.setItem("checkoutState", JSON.stringify(changeaddress));
          setdata({
            ...data,
            changeaddress: address,
            selectedAddress: address,
            showChangeAddress: false,
            checkingChangeAddress: true,
          });
          setState({ ...state, showAddress: true });
          handleChangeDistanceCalucationCallback({ distance, status, reason });
        }

        // callback({
        //   distance,
        //   status,
        //   reason,
        // });
      }
    );

    // handleChangeDefautAddress({distance});

    // setheadingfornoaddress(true);

    //  getDeliveryCharges();

    console.log("add is", address);
  };
  const handleChangeDistanceCalucationCallback = async (result) => {
    // const final_distance =
    //   getDistanceBetweenPoints(
    //     main.selectedRestaurant.lat,
    //     main.selectedRestaurant.lon,
    //     main.destination_coordinates.lat,
    //     main.destination_coordinates.lng
    //   ) * 0.001;

    // console.log("distance in handle", result, final_distance);
    // return;
    console.log("response in google callnack", result);
    if (result.status === "SUCCESS") {
      const distance = parseFloat(result.distance * 0.001);
      console.log("response in google float", distance);
      dispatch(setDeliveryDistance(distance));
      getNewDeliveryCharges(distance);
      // getDeliveryCharges(distance);
    } else {
      console.log("error: ", result.reason);
      setdata({ ...data, address_error: result.reason });
    }
  };
  const isDistanceInDeliveryRange = (distance, { range }) => {
    console.log("new distance is distnce", distance);
    let maxDistance = 0;

    for (const dist in range) {
      const newDistance = parseFloat(range[dist].range_to);

      if (newDistance > maxDistance) {
        maxDistance = newDistance;
        console.log("new distance is", newDistance);
      }
    }

    if (distance <= maxDistance) {
      return true;
    }

    return false;
  };
  const grandTotal = Number(getGrandTotal());

  const getNewDeliveryCharges = (distance) => {
    const range = main.deliveryRange?.range;
    let cost;
    if (
      grandTotal >=
        Number(main.deliveryRange?.cost["free_delivery_eligible_amount"]) &&
      parseInt(main.deliveryRange?.cost) !== 0
    ) {
      cost = 0;
    } else if (range) {
      for (let i = 0; i < main.deliveryRange.range.length; i++) {
        if (
          distance > main.deliveryRange.range[i].range_from &&
          distance <= main.deliveryRange.range[i].range_to
        ) {
          cost = main.deliveryRange.range[i].delivery_cost;
          break;
        } else {
          cost = main.deliveryRange.cost.std_delivery_cost || 0;
        }
      }
    }

    dispatch(setDeliveryCost(cost));
    console.log("new selected range", cost);
  };
  // const getDeliveryCharges = (dist) => {
  //   console.log("distance in getdelibery", dist);
  //   var dc;
  //   if (!main.deliveryRange) return;
  //   const cost = main.deliveryRange.cost;
  //   const range = main.deliveryRange.range;
  //   const isTakeAway = user.isTakeAway;
  //   const distance = dist;
  //   console.log("distance range", range);

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

  //   console.log("details of range is", isFreeDelivery);

  //   if (isFreeDelivery || isTakeAway) {
  //     dispatch(setDeliveryCost(0));
  //     props.getdc(0);
  //     return 0;
  //   }
  //   //
  //   else if (distance === -1 || !range) {
  //     console.log("std delivery cost", stdDeliveryCost);
  //     console.log("std delivery cost", Number(stdDeliveryCost));
  //     if (stdDeliveryCost) {
  //       dispatch(setDeliveryCost(Number(stdDeliveryCost)));
  //     }
  //     props.getdc(stdDeliveryCost);
  //     return Number(stdDeliveryCost);
  //   } else if (range) {
  //     const selectedRange = range.find((rng) => {
  //       const from = Number(rng["range_from"]);
  //       const to = Number(rng["range_to"]);

  //       return distance >= from && distance <= to;
  //     });

  //     console.log("range details", selectedRange);

  //     // selectedRange
  //     //   ?( Number(selectedRange["delivery_cost"]) || 0)
  //     //   : Number(stdDeliveryCost);

  //     if (selectedRange) {
  //       if (selectedRange["delivery_cost"]) {
  //         dispatch(setDeliveryCost(selectedRange["delivery_cost"]));
  //         props.getdc(selectedRange["delivery_cost"]);
  //       } else {
  //         dispatch(setDeliveryCost(0));
  //         props.getdc(0);
  //       }
  //     } else {
  //       dispatch(setDeliveryCost(Number(stdDeliveryCost)));
  //       props.getdc(Number(stdDeliveryCost));
  //     }
  //     return selectedRange
  //       ? Number(selectedRange["delivery_cost"] || 0)
  //       : Number(stdDeliveryCost);
  //   }

  //   return 0;
  // };
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

  // useEffect(() => {
  //   fetchAddresses();
  // }, [add]);
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
    setdata({ ...data, addresses: payload.data });
    //setdata({ ...data, addresses: payload, isAddressesFetched: true });
    console.log("dtdtd", data);

    const defaultAddress = payload.data.filter(
      (address) => address.is_default === "1",
      [0]
    );
    console.log("default ebe", defaultAddress);

    console.log("length or default address", user.defaultAddress);

    console.log("defaultAddress from fetchaddress: ", defaultAddress);
    if (payload.success) {
      if (defaultAddress.length > 0) {
        setdefaultadd(true);
        dispatch(setDefaultAddress(defaultAddress));
        dispatch(setSelectedAddress(defaultAddress));
        props.getAddress(defaultAddress[0]);
        handleDefautAddress(defaultAddress[0]);

        setchangeaddress({
          ...changeaddress,
          data: defaultAddress[0],
          listOfAddress: false,
          boolean: true,
          headingfornoaddress: true,
        });
        localStorage.setItem("checkoutState", JSON.stringify(changeaddress));

        setdata({ ...data, checkingChangeAddress: true });
      }
    }

    // if (!data.selectedAddress) {
    //   console.log("passed");
    //   handleDefautAddress(defaultAddress);
    //   //  setdata({ ...data, selectedAddress: defaultAddress }); // ? will run only after refresh and no address is selected
    // }

    console.log("Selecetd Address: ", data.selectedAddress);
    // this.props.setSelectedAddress(defaultAddress)

    // this.handleMultipleAddress()
  };
  const handleDefautAddress = async (address) => {
    console.log("address in default address", address);
    const lat = main.selectedRestaurant.lat;
    const lon = main.selectedRestaurant.lon;

    // const response = await Geocode.fromAddress(address[0].address1);
    const response = await Geocode.fromAddress(address.address1);

    const { lat: customerLat, lng: customerLng } =
      response.results[0].geometry.location;

    console.log("in handleDefaut", api);
    console.log("check cooridnates in first", lat, lon);

    const service = new window.google.maps.DistanceMatrixService();

    // const originCord = `${origin.lat},${origin.lng}`;
    // const destinationCord = `${destination.lat},${destination.lng}`;

    const originCord = `${main.selectedRestaurant.address},${main.selectedRestaurant.city}, ${main.selectedRestaurant.zipcode}, ${main.selectedRestaurant.country}`;
    const destinationCord = `${address.address1},${address.city},${address.zipcode},${address.country}`;

    console.log("destination is", destinationCord, originCord);

    service.getDistanceMatrix(
      {
        origins: [originCord],
        destinations: [destinationCord],
        travelMode: "DRIVING",
        durationInTraffic: true,
        avoidHighways: false,
        // unitSystem: props.google.maps.UnitSystem.METRIC,
        avoidTolls: false,
      },
      (response) => {
        let reason;

        let distance;

        let status;

        console.log("response in google payemnt", response);

        if (
          response.rows[0].elements[0].distance === undefined &&
          response.destinationAddresses[0] === "0,0"
        ) {
          // user has to choose some correct address
          reason = "Please choose an address";
          status = "FAILED";
        } else if (
          response.rows[0].elements[0].status !== undefined &&
          response.rows[0].elements[0].status === "ZERO_RESULTS"
        ) {
          reason = "Sorry, Chosen address is out of delivery range!";
          status = "FAILED";
        } else {
          status = "SUCCESS";
          distance = response.rows[0].elements[0].distance.value;
        }

        handleDistanceCalucationCallback({ distance, status, reason });

        // callback({
        //   distance,
        //   status,
        //   reason,
        // });
      }
    );

    // api.calculateDistance(
    //   // {
    //   //   lat,
    //   //   lng: lon,
    //   // },
    //   // {
    //   //   lat: customerLat,
    //   //   lng: customerLng,
    //   // },
    //   address.address1,
    //   address.city,
    //   address.zipcode,
    //   address.country,
    //   handleDistanceCalucationCallback
    // );
  };
  const handleGoogleApi = (google) => {
    //if (!state.googleApi) setState({ ...state, googleApi: google });

    console.log("google in payment form", google);
    setapi(google);
  };
  const handleDistanceCalucationCallback = async (result) => {
    console.log("distance is", result);
    // return;
    if (result.status === "SUCCESS") {
      const distance = parseFloat(result.distance / 1000);

      dispatch(setDeliveryDistance(distance));
      getNewDeliveryCharges(distance);
    } else {
      console.log("error: ", result.reason);
      setdata({ ...data, address_error: result.reason });
    }
  };

  useEffect(() => {
    // if (main.deliveryRange) getDeliveryCharges();
    if (api) {
      var formattedpickuptime = moment(data.pickupTime, "HH:mm").format(
        "HH:mm"
      );
      var formatteddeliverytime = moment(data.deliveryTime, "HH:mm").format(
        "HH:mm"
      );
      console.log("form");
      console.log("xyz2 dek", formatteddeliverytime);
      dispatch(setPickupTime(formattedpickuptime));
      dispatch(setDeliveryTime(formatteddeliverytime));
      // fetchAddresses();
      //getDeliveryCharges();
      console.log("api is", api);
    }
  }, [api]);

  useEffect(() => {
    console.log("address from and", AddressFromAdd);
    if (AddressFromAdd) {
      handleMultipleAddress(AddressFromAdd);
    }
  }, [AddressFromAdd]);

  useEffect(() => {
    console.log("state in take address", changeaddress);
  }, [changeaddress]);

  return (
    <>
      {changeaddress.headingfornoaddress ? (
        <div
          className='box_style_2'
          style={{ cursor: "pointer" }}
          onClick={showAddressModal}
        >
          <div>
            <>
              <h2 className='delivery-head'>
                {/* Add Delivery Address{" "} */}
                {changeaddress.boolean ? heading.change : heading.add}
              </h2>

              <div
                style={{
                  marginTop: "-70px",
                  backgroundColor: "white",

                  border: "1px solid black",
                }}
                className='button-container address-add-change hide-on-mobile'
                onClick={onChangeAddressCall}
              >
                <span className='add-to-cart-button' style={{ color: "black" }}>
                  {changeaddress.boolean ? heading.changeBtn : heading.addBtn}
                </span>
              </div>

              <span
                class='address-add-change hide-on-desktop'
                style={{ marginTop: "-65px" }}
                onClick={onChangeAddressCall}
              >
                {changeaddress.boolean ? heading.changeBtn : heading.addBtn}
              </span>
            </>

            <>
              {changeaddress.boolean ? (
                <>
                  <p
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {changeaddress.data.name}
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    {changeaddress.data.address1}, &nbsp;{" "}
                    {changeaddress.data.address2} &nbsp;
                    {changeaddress.data.state == "undefined"
                      ? ""
                      : changeaddress.data.state}
                  </p>

                  <p style={{ fontSize: "15px" }}>
                    {changeaddress.data.city == "undefined"
                      ? ""
                      : changeaddress.data.city}{" "}
                    {changeaddress.data.zipcode} , &nbsp;{" "}
                    {changeaddress.data.country}
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    phone : +{menu.restaurantInfo.phone_code} &nbsp;
                    {user.user.mobile}
                  </p>
                </>
              ) : null}
            </>

            {}

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
      {changeaddress.listOfAddress ? (
        <>
          <div
            className='box_style_2'
            // style={{ cursor: "pointer" }}
            // onClick={showAddressModal}
          >
            <div>
              <h2 className='delivery-head'>Your Addresses </h2>
            </div>

            {add.addresses.map((address, i) => {
              console.log("add", address);
              return (
                <>
                  <section
                    className='address-section-paymentform'
                    style={{ backgroundColor: "#eae8ed" }}
                    // key={i}
                  >
                    <Address address={address} key={i} />
                    <ul className='address-actions'>
                      <li //onClick={() => callAddressModal(true, address)}
                      >
                        <button
                          onClick={() => handleMultipleAddress(address)}
                          style={{
                            height: "35px",

                            backgroundColor: "#302f31",
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          Deliver here
                        </button>
                        {/* <h5
                          className="actions"
                          onClick={() => handleMultipleAddress(address)}
                          style={{
                            height: "35px",
                            paddingTop: "8px",
                            backgroundColor: "#302f31",
                            color: "white",
                          }}
                        >
                          Deliver Here
                        </h5> */}
                        {/* </span> */}
                      </li>
                    </ul>
                  </section>{" "}
                  &nbsp; &nbsp; &nbsp;
                </>
              );
            })}

            <div
              style={{
                marginTop: "0px",
                backgroundColor: "white",
                color: "black",

                border: "1px solid black",
              }}
              className='button-container-add-address-mobile'
              onClick={handleAddAddressOnPaymentForm}
            >
              <p
                className='hide-on-desktop'
                style={{ marginTop: "15px", fontSize: "20px" }}
              >
                ADD
              </p>
              <span className='add-to-cart-button' style={{ color: "black" }}>
                Add
              </span>
              {/* <span className="add-to-cart-button-plus">
                <AddIcon />
              </span> */}
            </div>
          </div>
        </>
      ) : null}

      {modal.modal.modalToShow == "findAddress" ? (
        <ChooseAddress
          refetchAddresses={sethandleadd}
          bool='yes'
          getAddress={setAddressFromAdd}
          // isItFromCheckout={setfrompayment}
        />
      ) : null}
      <div style={{ display: "none" }}>
        <GoogleMap
          address={main.selectedRestaurant.address}
          lat={Number(main.selectedRestaurant.lat)}
          lng={Number(main.selectedRestaurant.lon)}
          googleApi={handleGoogleApi}
        />
      </div>
    </>
  );
};
export default TakeAddress;
