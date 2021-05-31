import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import "../../components/GoogleMap/GoogleMap.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
const GoogleMap = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
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

  const calculateDistance = (origin, destination, callback) => {
    const service = new props.google.maps.DistanceMatrixService();

    const originCord = `${origin.lat},${origin.lng}`;

    const destinationCord = `${destination.lat},${destination.lng}`;

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

  const handleDragEnd = ({ latLng }) => {
    console.log("drag", latLng);
    const cordinates = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };
    console.log("drag", cordinates);
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
    setState({ ...state, address });
  };

  const handleSelect = (address) => {
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
    <div className="google-map-container">
      <PlacesAutocomplete
        value={state.address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              style={{ width: "100%", height: "40px" }}
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
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
          <div className="address-info">
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
