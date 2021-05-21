import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import "../../components/GoogleMap/GoogleMap.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const GoogleMap = (props) => {
  const menu = useSelector((state) => state.menu);
  const [state, setState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    lat: props.lat,
    lng: props.lng,
  });
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
    setState({ ...state, lat: cordinates.lat, lng: cordinates.lng });
    console.log("setmarker stata", props.onMarkerPositionChange);

    props.onMarkerPositionChange && props.onMarkerPositionChange(cordinates);
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
  const { google, lat, lng, name, address } = props;

  const handleMarkerClick = (props, marker) => {
    setState({
      ...state,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
    console.log("markerclick", state);
  };

  return (
    <div className="google-map-container">
      {console.log("google is", google)}
      <Map
        google={google}
        zoom={15}
        style={mapStyles}
        initialCenter={{
          lat: Number(lat),
          lng: Number(lng),
        }}
        center={{
          lat: state.lat,
          lng: state.lng,
        }}
        onClick={handleMapClick}
      >
        <Marker
          draggable={true}
          onDragend={(t, map, coord) => handleDragEnd(coord)}
          onClick={handleMarkerClick}
          position={{
            lat: state.lat,
            lng: state.lng,
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
