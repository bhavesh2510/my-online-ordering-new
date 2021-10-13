import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import "../../components/GoogleMap/GoogleMap.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Geocode from "react-geocode";

const GoogleMap = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [placeaddress, setPlaceaddress] = useState();
  const [state, setState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    lat: props.lat,
    lng: props.lng,

    mapCentre: {
      lat: main.selectedRestaurant.lat,
      lng: main.selectedRestaurant.lon,
    },
  });

  const { google, lat, lng, name, address } = props;
  const mapStyles = {
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    console.log("propsuseeffecr", props.googleApi);
    if (props.googleApi) {
      props.googleApi({
        googleApi: props.google,
        setMarkerPosition: setMarkerPosition,
        //calculateDistance: this.calculateDistance,
      });
    }
  }, []);

  const handleMapClick = (ref, map, ev) => {
    setState({ ...state, lat: ev.latLng.lat(), lng: ev.latLng.lng() });
    console.log("state is", state);

    const newLatLng = {
      lat: state.lat,
      lng: state.lng,
    };
    console.log("newe", newLatLng);

    setMarkerPosition(newLatLng);
  };

  const setMarkerPosition = (cordinates) => {
    console.log("cordinate", cordinates);
    setState({
      ...state,
      mapCentre: { lat: cordinates.lat, lng: cordinates.lng },
    });

    console.log("setmarker stata", state);

    props.onMarkerPositionChange && props.onMarkerPositionChange(cordinates);
  };

  const calculateDistance = (
    origin,
    destination,
    add1,
    city,
    zipcode,
    country,
    callback
  ) => {
    //const service = new props.google.maps.DistanceMatrixService();

    const service = new props.google.maps.DistanceMatrixService();

    // const originCord = `${origin.lat},${origin.lng}`;
    // const destinationCord = `${destination.lat},${destination.lng}`;

    const originCord = `${main.selectedRestaurant.address},${main.selectedRestaurant.city}, ${main.selectedRestaurant.zipcode}, ${main.selectedRestaurant.country}`;
    const destinationCord = `${add1},${city},${zipcode},${country}`;

    console.log("destination is", destinationCord, originCord);

    service.getDistanceMatrix(
      {
        origins: [originCord],
        destinations: [destinationCord],
        travelMode: props.google.maps.TravelMode.DRIVING,
        durationInTraffic: true,
        avoidHighways: false,
        unitSystem: props.google.maps.UnitSystem.METRIC,
        avoidTolls: false,
      },
      (response) => {
        let reason;

        let distance;

        let status;

        console.log("response in google", response);

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

        callback({
          distance,
          status,
          reason,
        });
      }
    );
  };

  const handleDragEnd = async ({ latLng }) => {
    console.log("drag", latLng);
    const cordinates = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const response = await Geocode.fromLatLng(cordinates.lat, cordinates.lng);
    const address = response.results[0].formatted_address;

    console.log("address ", address);

    // get the distance b/w user and restaurant
    // and check if it's in the range of delivery

    // setState({ ...state, address });
    //setaddressdetail({ ...addressdetail, address });
    // get address, city, state, country, zipcode.
    const addressComponents = response.results[0].address_components;

    console.log("addressComponents", addressComponents);

    const details = {
      add1: "",
      add2: "",
      city: "",
      town: "",
      state: "",
      zipcode: "",
      country: "",
    };

    for (let i = 0; i < addressComponents.length; i++) {
      switch (addressComponents[i].types[0]) {
        case "street_number": {
          details.add1 = addressComponents[i].long_name;

          break;
        }
        case "route": {
          details.add1 = addressComponents[i].long_name;

          break;
        }
        case "locality": {
          details.city = addressComponents[i].long_name;

          break;
        }
        case "postal_town": {
          details.town = addressComponents[i].long_name;

          break;
        }

        case "state": {
          details.state = addressComponents[i].long_name;

          break;
        }
        case "country": {
          details.country = addressComponents[i].long_name;

          break;
        }
        case "postal_code": {
          details.zipcode = addressComponents[i].long_name;
          break;
        }
      }
    }

    let str;
    if (details.country == "United Kingdom") {
      str = `${details.add1} ${details.town} ,${details.zipcode} ${details.country}`;
    } else {
      str = `${details.add1} ${details.city} ,${details.zipcode} ${details.country}`;
    }
    console.log("drag", str);
    setPlaceaddress(str);
    //setState({ lat: cordinates.lat, lng: cordinates.lng });

    setMarkerPosition(cordinates);
  };

  const handleClose = () => {
    if (state.showingInfoWindow) {
      setState({ ...state, showingInfoWindow: false, activeMarker: null });
    }
  };

  const handleMarkerClick = (props, marker) => {
    setState({
      ...state,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
    console.log("markerclick", state);
  };

  const handleChange = (address) => {
    console.log("address is", address);
    setPlaceaddress(address);
    setState({ ...state, address });
  };

  useEffect(() => {
    console.log("state in google map", state);
  }, [state]);

  const handleSelect = (address) => {
    setPlaceaddress(address);
    console.log("address in select", address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setState({ ...state, address });
        setState({ ...state, mapCentre: latLng });
        setMarkerPosition(latLng);
        console.log("Success", latLng);
        console.log("state is", state);
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    if (props.googleApi) {
      props.googleApi({
        googleApi: props.google,
        setMarkerPosition: setMarkerPosition,
        calculateDistance: calculateDistance,
      });
    }
  }, []);

  return (
    <div className='google-map-container'>
      <PlacesAutocomplete
        value={placeaddress}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              style={{ width: "102%", height: "40px" }}
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className='autocomplete-dropdown-container'>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {
                      backgroundColor: "#393939",
                      cursor: "pointer",
                      color: "#fff",
                      height: "40px",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      height: "40px",
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <Map
        google={google}
        zoom={15}
        style={mapStyles}
        initialCenter={{
          lat: Number(lat),
          lng: Number(lng),
        }}
        center={{
          lat: state.mapCentre.lat,
          lng: state.mapCentre.lng,
        }}
        onClick={handleMapClick}
      >
        <Marker
          draggable={true}
          onDragend={(t, map, coord) => handleDragEnd(coord)}
          onClick={handleMarkerClick}
          position={{
            lat: state.mapCentre.lat,
            lng: state.mapCentre.lng,
          }}
        />
        <InfoWindow
          marker={state.activeMarker}
          visible={state.showingInfoWindow}
          onClose={handleClose}
        >
          <div className='address-info'>
            <h3>{name || ""}</h3>
            <h4>{address || ""}</h4>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};
export default GoogleApiWrapper({
  // libraries: ["places"],
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(GoogleMap);
