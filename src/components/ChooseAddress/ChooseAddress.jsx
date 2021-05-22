import "../../components/ChooseAddress/ChooseAddress.css";
import CloseIcon from "@material-ui/icons/Close";
import "../../state-management/menu/actions";
import { useState } from "react";
import { setDeliveryOption } from "../../state-management/user/actions";
import IconButton from "@material-ui/core/IconButton";
import { displayAddressModal } from "../../state-management/menu/actions";
import { useDispatch, useSelector } from "react-redux";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { setPhoneCode } from "../../state-management/user/actions";
import Geocode from "react-geocode";
import { Menu } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
Geocode.setApiKey("AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs");

const ChooseAddress = () => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const [state, setState] = useState({
    selectedItem: null,
    lat: main.selectedRestaurant.lat,
    lng: main.selectedRestaurant.lon,
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
    dispatch(displayAddressModal(false));
  };

  const handleSelect = async (props) => {
    alert("yo");
    const result = await geocodeByPlaceId(props["place_id"]);
    console.log("select", result);
    const lat = result[0].geometry.location.lat();
    const lng = result[0].geometry.location.lng();

    console.log("resultr", result);

    const cordinates = {
      lat,
      lng,
    };

    setState({ ...state, lat, lng }, () => {
      handleMarkerPostionChange(cordinates);
      //state.googleApi.setMarkerPosition(cordinates);
    });
  };

  const handleGoogleApi = (google) => {
    setState({ ...state, googleApi: google });
    console.log("api", google);
  };

  const handleMarkerPostionChange = async (position) => {
    if (position) {
      const { lat, lng } = position;

      setState({
        ...state,
        errorMessage: false,
        customerCordinates: {
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

      setState({ ...state, address });
      // get address, city, state, country, zipcode.
      const addressComponents = response.results[0].address_components;

      console.log("addressComponents", addressComponents);

      for (let i = 0; i < addressComponents.length; i++) {
        switch (
          addressComponents[i].types //[i].types[0]
        ) {
          case "street_number": {
            setState({
              ...state,
              addressLine1: addressComponents[i].long_name,
            });
            console.log(state.addressLine1); //26
            break;
          }
          case "route": {
            setState((prevState) => ({
              ...state,
              addressLine1:
                addressComponents[i].long_name + " " + prevState.addressLine1,
            }));
            console.log("address 1 ", state.addressLine1);
            break;
          }
          case "locality":
            setState({ ...state, city: addressComponents[i].long_name });
            console.log("city ", state.city);

            break;
          case "state":
            setState({ ...state, state: addressComponents[i].long_name });
            console.log("state", state.state);
            break;
          case "country":
            setState({ ...state, country: addressComponents[i].long_name });
            let countryShortName = addressComponents[i].short_name;
            console.log(phonecodetoCountryMaping[countryShortName]);
            setPhoneCode(phonecodetoCountryMaping[countryShortName]); //check
            console.log("country", state.country);
            break;
          case "postal_code":
            setState({ zipcode: addressComponents[i].long_name });
            console.log("zipcode", state.zipcode);
            break;

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
    }
  };

  const handleDistanceCalucationCallback = (result) => {
    console.log("distance", result);

    if (result.status === "SUCCESS") {
      // check if distance is inside restaurant deilvery range
      const distance = parseFloat(result.distance / 1000);
      console.log(distance);
      if (!isDistanceInDeliveryRange(distance, this.props.deliveryRange)) {
        setState({
          errorMessage:
            "Sorry, We do not provide delivery on selected address.",
        });
      } else if (distance) {
        dispatch(
          setDeliveryOption({
            distance,
            userAddress: {
              address1: state.addressLine1,
              state: state.state,
              city: state.city,
              country: state.country,
              zipcode: state.zipcode,
            },
            option: "Delivery",
          })
        );
        // this.props.successCallback && this.props.successCallback();
        // !this.props.modalState.addAddress && this.props.setIsTakeAway(false);
        // this.props.closeModal();
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
  const handleDelivery = () => {
    console.log("state is", state);
    state.googleApi.googleApi.calculateDistance(
      state.restaurantCordinate,
      state.customerCordinates,
      handleDistanceCalucationCallback
    );
  };

  const isDistanceInDeliveryRange = (distance, { range }) => {
    let maxDistance = 0;

    for (const dist in range) {
      const newDistance = parseFloat(range[dist].range_to);

      if (newDistance > maxDistance) {
        maxDistance = newDistance;
      }
    }

    if (distance <= maxDistance) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div id="parent" className="modal-container">
        <div className="align-container-center">
          <div className="choose-address-box">
            <div className="close">
              <IconButton
                onClick={closeLoginModal}
                style={
                  {
                    //   backgroundColor: "#6244da",
                    //   marginRight: "-45px",
                    //   marginTop: "-35px",
                  }
                }
              >
                {" "}
                <CloseIcon style={{ color: "Black" }} />{" "}
              </IconButton>
            </div>
            <div className="header" style={{ marginLeft: "24%" }}>
              <strong style={{ color: "#5d5e5e", fontSize: "20px" }}>
                SELECT DELIVERY AREA
              </strong>
            </div>
            <div className="content">
              {/* <GooglePlacesAutocomplete
                //defaultValue={state.address}
                selectProps={{ onChange: handleSelect }}
                // apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
              /> */}
              {/* <PlacesAutocomplete
                value={state.address}
                //onChange={this.handleChange}
                onSelect={handleSelect}
              >
                {renderFunc}
              </PlacesAutocomplete> */}

              <GoogleMap
                lat={state.lat}
                lng={state.lng}
                address={state.address || main.selectedRestaurant.address}
                onMarkerPositionChange={handleMarkerPostionChange}
                googleApi={handleGoogleApi}
              />

              <Button
                onClick={handleDelivery}
                style={{
                  marginTop: "5px",
                  marginLeft: "25%",
                  backgroundColor: "black",
                  color: "white",
                  paddingLeft: "80px",
                  paddingRight: "80px",
                }}
              >
                Delivery
              </Button>
            </div>
            <div className="login-buttons"> </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChooseAddress;
