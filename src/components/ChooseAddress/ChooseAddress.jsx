import "../../components/ChooseAddress/ChooseAddress.css";
import CloseIcon from "@material-ui/icons/Close";
import "../../state-management/menu/actions";
import { useEffect, useState } from "react";
import { setDeliveryOption } from "../../state-management/user/actions";
import IconButton from "@material-ui/core/IconButton";
import { displayAddressModal } from "../../state-management/menu/actions";
import { useDispatch, useSelector } from "react-redux";
// import GooglePlacesAutocomplete, {
//   geocodeByPlaceId,
// } from "react-google-places-autocomplete";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { setPhoneCode } from "../../state-management/user/actions";
import Geocode from "react-geocode";
import { Menu } from "@material-ui/core";
//import Button from "@material-ui/core/Button";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import TextField from "@material-ui/core/TextField";
import { openModal, closeModal } from "../../state-management/modal/actions";
import AddAddress from "./AddAddress";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { setDestinationCoordinates } from "../../state-management/main/actions";
import { declareTypeAlias } from "@babel/types";
import { notification } from "antd";

Geocode.setApiKey("AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs");

const ChooseAddress = (props) => {
  const main = useSelector((state) => state.main);
  const user = useSelector((state) => state.user);
  const menu = useSelector((state) => state.menu);

  const [latlng, setlatlng] = useState();
  const [addressdetail, setaddressdetail] = useState({
    address: "",
    addressLine1: "",

    state: "",
    city: "",
    country: "",
    zipcode: "",
  });
  useEffect(() => {
    console.log(" address details", addressdetail);
  }, [addressdetail]);

  const [customersnumber, setcustomersnumber] = useState({
    address_1: "",
  });
  const [customeraddress1, setcustomeraddress1] = useState();
  const [customerstate, setcustomerstate] = useState();
  const [customercity, setcustomercity] = useState();
  const [customercountry, setcustomercountry] = useState();
  const [customerzipcode, setcustomerzipcode] = useState();
  const [customerpostaltown, setcustomerpostaltown] = useState();
  const [shownextaddresspage, setshownextaddresspage] = useState(false);

  const [state, setState] = useState({
    selectedItem: null,
    mapCentre: {
      lat: main.selectedRestaurant.lat,
      lng: main.selectedRestaurant.lon,
    },
    restaurantCordinate: {
      //TODO: check with Sandip why it was necessary to add this on state when its just one time thing :/
      lat: menu.restaurantInfo.lat,
      lng: menu.restaurantInfo.lon,
    },
    customerCordinates: {
      lat: "",
      lng: "",
    },
    address: "",
    addressLine1: "",
    displayAutocomplete: true,
    state: "",
    city: "",
    country: "",
    zipcode: "",
    errorMessage: false,
    errorMessageForNullDestination: false,
    distance: 0,
    googleApi: "",
  });
  const phonecodetoCountryMaping = {
    AF: "+93",
    AL: "+355",
    DZ: "+213",
    AD: "+376",
    AO: "+244",
    AG: "+1-268",
    AR: "+54",
    AM: "+374",
    AU: "+61",
    AT: "+43",
    AZ: "+374-97",
    BS: "+1-242",
    BH: "+973",
    BD: "+880",
    BB: "+1-246",
    BY: "+375",
    BE: "+32",
    BZ: "+501",
    BJ: "+229",
    BT: "+975",
    BO: "+591",
    BA: "+387",
    BW: "+267",
    BR: "+55",
    BN: "+673",
    BG: "+359",
    BF: "+226",
    BI: "+257",
    KH: "+855",
    CM: "+237",
    CA: "+1",
    CV: "+238",
    CF: "+236",
    TD: "+235",
    CL: "+56",
    CN: "+86",
    CO: "+57",
    KM: "+269",
    CD: "+243",
    CG: "+242",
    CR: "+506",
    CI: "+225",
    HR: "+385",
    CU: "+53",
    CY: "+90-392",
    CZ: "+420",
    DK: "+45",
    DJ: "+253",
    DM: "+1-767",
    DO: "+1-829",
    EC: "+593",
    EG: "+20",
    SV: "+503",
    GQ: "+240",
    ER: "+291",
    EE: "+372",
    ET: "+251",
    FJ: "+679",
    FI: "+358",
    FR: "+33",
    GA: "+241",
    GM: "+220",
    GE: "+995",
    DE: "+49",
    GH: "+233",
    GR: "+30",
    GD: "+1-473",
    GT: "+502",
    GN: "+224",
    GW: "+245",
    GY: "+592",
    HT: "+509",
    HN: "+504",
    HU: "+36",
    IS: "+354",
    IN: "+91",
    ID: "+62",
    IR: "+98",
    IQ: "+964",
    IE: "+353",
    IL: "+972",
    IT: "+39",
    JM: "+1-876",
    JP: "+81",
    JO: "+962",
    KZ: "+7",
    KE: "+254",
    KI: "+686",
    KP: "+850",
    KR: "+82",
    KW: "+965",
    KG: "+996",
    LA: "+856",
    LV: "+371",
    LB: "+961",
    LS: "+266",
    LR: "+231",
    LY: "+218",
    LI: "+423",
    LT: "+370",
    LU: "+352",
    MK: "+389",
    MG: "+261",
    MW: "+265",
    MY: "+60",
    MV: "+960",
    ML: "+223",
    MT: "+356",
    MH: "+692",
    MR: "+222",
    MU: "+230",
    MX: "+52",
    FM: "+691",
    MD: "+373-533",
    MC: "+377",
    MN: "+976",
    ME: "+382",
    MA: "+212",
    MZ: "+258",
    MM: "+95",
    NA: "+264",
    NR: "+674",
    NP: "+977",
    NL: "+31",
    NZ: "+64",
    NI: "+505",
    NE: "+227",
    NG: "+234",
    NO: "+47",
    OM: "+968",
    PK: "+92",
    PW: "+680",
    PA: "+507",
    PG: "+675",
    PY: "+595",
    PE: "+51",
    PH: "+63",
    PL: "+48",
    PT: "+351",
    QA: "+974",
    RO: "+40",
    RU: "+7",
    RW: "+250",
    KN: "+1-869",
    LC: "+1-758",
    VC: "+1-784",
    WS: "+685",
    SM: "+378",
    ST: "+239",
    SA: "+966",
    SN: "+221",
    RS: "+381",
    SC: "+248",
    SL: "+232",
    SG: "+65",
    SK: "+421",
    SI: "+386",
    SB: "+677",
    SO: "+252",
    ZA: "+27",
    ES: "+34",
    LK: "+94",
    SD: "+249",
    SR: "+597",
    SZ: "+268",
    SE: "+46",
    CH: "+41",
    SY: "+963",
    TJ: "+992",
    TZ: "+255",
    TH: "+66",
    TL: "+670",
    TG: "+228",
    TO: "+676",
    TT: "+1-868",
    TN: "+216",
    TR: "+90",
    TM: "+993",
    TV: "+688",
    UG: "+256",
    UA: "+380",
    AE: "+971",
    GB: "+44",
    US: "+1",
    UY: "+598",
    UZ: "+998",
    VU: "+678",
    VA: "+379",
    VE: "+58",
    VN: "+84",
    YE: "+967",
    ZM: "+260",
    ZW: "+263",
    TW: "+886",
    CX: "+61",
    CC: "+61",
    NF: "+672",
    NC: "+687",
    PF: "+689",
    YT: "+262",
    GP: "+590",
    PM: "+508",
    WF: "+681",
    CK: "+682",
    NU: "+683",
    TK: "+690",
    GG: "+44",
    IM: "+44",
    JE: "+44",
    AI: "+1-264",
    BM: "+1-441",
    IO: "+246",
    VG: "+1-284",
    KY: "+1-345",
    FK: "+500",
    GI: "+350",
    MS: "+1-664",
    SH: "+290",
    TC: "+1-649",
    MP: "+1-670",
    PR: "+1-787",
    AS: "+1-684",
    GU: "+1-671",
    VI: "+1-340",
    HK: "+852",
    MO: "+853",
    FO: "+298",
    GL: "+299",
    GF: "+594",
    MQ: "+596",
    RE: "+262",
    AX: "+358-18",
    AW: "+297",
    AN: "+599",
    SJ: "+47",
    AC: "+247",
    TA: "+290",
    CS: "+381",
    PS: "+970",
    EH: "+212",
  };

  const dispatch = useDispatch();
  const closeLoginModal = () => {
    // dispatch(displayAddressModal(false));
    dispatch(closeModal());
  };

  // const handleSelect = async (props) => {
  //   alert("yo");
  //   const result = await geocodeByPlaceId(props["place_id"]);
  //   console.log("select", result);
  //   const lat = result[0].geometry.location.lat();
  //   const lng = result[0].geometry.location.lng();

  //   console.log("resultr", result);

  //   const cordinates = {
  //     lat,
  //     lng,
  //   };

  //   setState({ ...state, lat, lng }, () => {
  //     handleMarkerPostionChange(cordinates);
  //     //state.googleApi.setMarkerPosition(cordinates);
  //   });
  // };

  const handleGoogleApi = (google) => {
    if (!state.googleApi) setState({ ...state, googleApi: google });

    console.log("api", google);
  };

  const handleMarkerPostionChange = async (position) => {
    dispatch(setDestinationCoordinates(position));
    if (position) {
      const { lat, lng } = position;
      console.log("position is", position);

      setlatlng(position);

      setState({
        ...state,
        errorMessage: false,
        mapCentre: {
          lat,
          lng,
        },
      });

      const response = await Geocode.fromLatLng(lat, lng);

      console.log("response ", response);

      const address = response.results[0].formatted_address;

      console.log("address ", address);

      // get the distance b/w user and restaurant
      // and check if it's in the range of delivery

      // setState({ ...state, address });
      //setaddressdetail({ ...addressdetail, address });
      // get address, city, state, country, zipcode.
      const addressComponents = response.results[0].address_components;

      console.log("addressComponents", addressComponents);
      dispatch(setDestinationCoordinates(addressComponents));

      for (let i = 0; i < addressComponents.length; i++) {
        switch (addressComponents[i].types[0]) {
          case "street_number": {
            // setaddressdetail({
            //   ...addressdetail,
            //   addressLine1: addressComponents[i].long_name,
            // });
            setcustomersnumber({ address_1: addressComponents[i].long_name });

            break;
          }
          case "route": {
            // setaddressdetail((prevState) => ({
            //   ...addressdetail,
            //   addressLine1:
            //     addressComponents[i].long_name + " " + prevState.addressLine1,
            // }));

            if (main.selectedRestaurant.country == "United Kingdom") {
              setcustomersnumber((prevState) => ({
                address_1:
                  prevState.address_1 + " " + addressComponents[i].long_name,
              }));
            } else {
              setcustomersnumber((prevState) => ({
                address_1:
                  addressComponents[i].long_name + " " + prevState.address_1,
              }));
            }

            break;
          }
          case "locality": {
            // setaddressdetail({
            //   ...addressdetail,
            //   city: addressComponents[i].long_name,
            // });

            setcustomercity(addressComponents[i].long_name);

            break;
          }
          case "postal_town": {
            // setaddressdetail({
            //   ...addressdetail,
            //   city: addressComponents[i].long_name,
            // });

            setcustomerpostaltown(addressComponents[i].long_name);

            break;
          }

          case "state": {
            // setaddressdetail({
            //   ...addressdetail,
            //   state: addressComponents[i].long_name,
            // });
            setcustomerstate(addressComponents[i].long_name);

            break;
          }
          case "country": {
            // setaddressdetail({
            //   ...addressdetail,
            //   country: addressComponents[i].long_name,
            // });

            setcustomercountry(addressComponents[i].long_name);
            // let countryShortName = addressComponents[i].short_name;
            // console.log(phonecodetoCountryMaping[countryShortName]);
            // props.setPhoneCode(phonecodetoCountryMaping[countryShortName]);

            break;
          }
          case "postal_code": {
            // setaddressdetail({
            //   ...addressdetail,
            //   zipcode: addressComponents[i].long_name,
            // });
            setcustomerzipcode(addressComponents[i].long_name);
            break;
          }

          // default: {
          //   const addr = `${this.state.addressLine1} , ${addressComponents[i].long_name}`.replace(/[\s,]+/, ' ').trim();
          //   console.log(this.state.addressLine1);
          //   const finalAddr = addr.split(' , ').reduce((acc, str) => {
          //     if (!acc.includes(str) && str.trim().length) {
          //       return [
          //         acc,
          //         str,
          //       ].join(', ');
          //     }

          //     return acc;
          //   }, '').split(', ').filter((val) => val.trim().length).join(', ');

          //   this.setState({ addressLine1: finalAddr });
          //   break;
          // }
        }
      }

      // addressComponents.forEach((element, i) => {
      //   console.log("element is", element.types);

      // });
    }
  };

  useEffect(() => {
    console.log("complete state is", customersnumber);
  }, [customersnumber]);

  // useEffect(() => {
  //   console.log("complete state is", customeraddress1);
  // }, [customeraddress1]);

  useEffect(() => {
    console.log("complete state is", customercity);
  }, [customercity]);

  useEffect(() => {
    console.log("complete state is", customerstate);
  }, [customerstate]);

  useEffect(() => {
    console.log("complete state is", customerzipcode);
  }, [customerzipcode]);

  useEffect(() => {
    console.log("complete state is", customercountry);
  }, [customercountry]);

  const handleDistanceCalucationCallback = (result) => {
    console.log("distance", result.distance);

    if (result.status === "SUCCESS") {
      // check if distance is inside restaurant deilvery range
      const distance = parseFloat(result.distance / 1000);
      console.log("distance in decimal", distance);
      if (!isDistanceInDeliveryRange(distance, main.deliveryRange)) {
        setState({
          ...state,
          errorMessage:
            "Sorry, We do not provide delivery on selected address.",
        });
      } else if (distance) {
        setState({ ...state, errorMessage: false });
        dispatch(
          setDeliveryOption({
            distance,
            userAddress: {
              address1: customersnumber.address_1,
              state: customerstate,
              city: customercity ? customercity : customerpostaltown,
              country: customercountry,
              zipcode: customerzipcode,
            },
            option: "Delivery",
          })
        );
        setshownextaddresspage(true);
        // this.props.successCallback && this.props.successCallback();
        // !this.props.modalState.addAddress && this.props.setIsTakeAway(false);
        //dispatch(closeModal());
        // this.props.isUserLoggedIn &&
        //   this.props.openModal(modalNames.ADD_ADDRESS, {
        //     selectAddress: true,
        //     existingDefaultAddress:
        //       this.props.modalState.existingDefaultAddress,
        //     editMode: false,
        //   });
      }
    } else {
      setState({ ...state, errorMessage: result.reason });
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

  const handleDelivery = () => {
    console.log("not from checkout", props.bool, props.isItFromCheckout);

    console.log("check api", state.googleApi);
    setState({
      ...state,
      addressLine1: customersnumber.address_1,
      city: customercity ? customercity : customerpostaltown,
      zipcode: customerzipcode,
      country: customercountry,
    });

    const details = {
      add1: "",
      add2: "",
      city: "",
      zipcode: "",
      country: "",
    };

    for (let i = 0; i < main.destination_coordinates.length; i++) {
      switch (main.destination_coordinates[i].types[0]) {
        case "street_number": {
          details.add1 = main.destination_coordinates[i].long_name;

          break;
        }
        case "route": {
          details.add2 = main.destination_coordinates[i].long_name;
        }
        case "postal_town": {
          details.city = main.destination_coordinates[i].long_name;

          break;
        }
        case "state": {
          break;
        }
        case "country": {
          details.country = main.destination_coordinates[i].long_name;

          break;
        }
        case "postal_code": {
          // setaddressdetail({
          //   ...addressdetail,
          //   zipcode: main.destination_coordinates[i].long_name,
          // });
          details.zipcode = main.destination_coordinates[i].long_name;

          break;
        }
      }
    }

    console.log("details is", details);

    const service = new window.google.maps.DistanceMatrixService();

    // const originCord = `${origin.lat},${origin.lng}`;
    // const destinationCord = `${destination.lat},${destination.lng}`;

    const originCord = `${main.selectedRestaurant.address},${main.selectedRestaurant.city}, ${main.selectedRestaurant.zipcode}, ${main.selectedRestaurant.country}`;
    const destinationCord = `${details.add1}+${details.add2},${details.city},${details.zipcode},${details.country}`;

    console.log("destination is", destinationCord, originCord);
    if (destinationCord) {
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
    } else {
      setState({
        ...state,
        errorMessageForNullDestination: "Please select address again.",
      });
    }

    // state.googleApi.calculateDistance(
    //   // state.restaurantCordinate,
    //   // latlng,
    //   customersnumber.address_1,
    //   customercity,
    //   customerzipcode,
    //   customercountry,
    //   handleDistanceCalucationCallback
    // );
  };

  useEffect(() => {
    console.log("complete state is", state);
  }, [state]);

  // const handleChange = (address) => {
  //   setState({ ...state, address });
  // };

  // const handleSelect = (address) => {
  //   geocodeByAddress(address)
  //     .then((results) => getLatLng(results[0]))
  //     .then((latLng) => {
  //       setState({ ...state, address });
  //       setState({ ...state, mapCentre: latLng });
  //       handleMarkerPostionChange(state.mapCentre);
  //       console.log("Success", latLng);
  //       console.log("state is", state);
  //     })
  //     .catch((error) => console.error("Error", error));
  // };

  const toggle = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <Modal
        className='xyz'
        isOpen={true}
        toggle={toggle}
        style={{ top: "5%" }}
      >
        <ModalHeader style={{ height: "60px" }} toggle={toggle}>
          {" "}
          <p className='heading-for-modalchooseaddress'>SELECT DELIVERY AREA</p>
        </ModalHeader>
        <ModalBody>
          <h4>Please enter correct address with house number</h4>
          <GoogleMap
            lat={state.mapCentre ? state.mapCentre.lat : null}
            lng={state.mapCentre ? state.mapCentre.lng : null}
            address={state.address || main.selectedRestaurant.address}
            onMarkerPositionChange={handleMarkerPostionChange}
            googleApi={handleGoogleApi}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleDelivery}
            style={{
              marginTop: "20px",
              width: "100%",
              // marginLeft: "25%",
              backgroundColor: "black",
              color: "white",
              paddingLeft: "80px",
              paddingRight: "80px",
            }}
          >
            Delivery
          </Button>
          {state.errorMessage ? (
            <>
              <div style={{ marginTop: "10px" }}>
                <p
                  style={{
                    textAlign: "center",
                    color: "red",
                    fontSize: "20px",
                  }}
                >
                  {state.errorMessage}
                </p>
              </div>
            </>
          ) : null}
          {state.errorMessageForNullDestination ? (
            <>
              <div style={{ marginTop: "10px" }}>
                <p
                  style={{
                    // textAlign: "center",
                    color: "red",
                    fontSize: "20px",
                    paddingRight: "110px",
                  }}
                >
                  {state.errorMessageForNullDestination}
                </p>
              </div>
            </>
          ) : null}
        </ModalFooter>
      </Modal>

      {shownextaddresspage ? (
        <>
          <AddAddress
            refetchAddresses={props.refetchAddresses}
            bool={props.bool}
            isItFromCheckout={props.isItFromCheckout}
            getAddress={props.getAddress}
          />
        </>
      ) : null}
    </>
  );
};
export default ChooseAddress;
