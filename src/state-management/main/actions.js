import * as actionTypes from "./actionTypes";

export function fetchRestuarantInformationRequest() {
  return { type: actionTypes.FETCH_RESTURANT_INFORMATION_REQUEST };
}

export function fetchRestuarantInformationSuccess(payload) {
  return {
    type: actionTypes.FETCH_RESTURANT_INFORMATION_SUCCESS,
    payload,
  };
}

export function fetchRestuarantInformationFailure(error) {
  return {
    type: actionTypes.FETCH_RESTURANT_INFORMATION_FAILURE,
    error,
  };
}

export function setSelectedRestaurant(restaurant, restId = "") {
  return {
    type: actionTypes.SET_SELECTED_RESTAURANT,
    restaurant,
    restId,
  };
}

export function fetchRestaurantListRequest() {
  return { type: actionTypes.FETCH_RESTURANT_LIST_REQUEST };
}

export function fetchRestaurantListSuccess(payload, chainId) {
  return {
    type: actionTypes.FETCH_RESTURANT_LIST_SUCCESS,
    payload,
    chainId,
  };
}

export function fetchRestaurantListFailure(error) {
  return {
    type: actionTypes.FETCH_RESTURANT_LIST_FAILURE,
    error,
  };
}

// Delivery Range

export function fetchRestuarantDeliveryRangeRequest() {
  return { type: actionTypes.FETCH_RESTURANT_DELIVERY_RANGE_REQUEST };
}

export function fetchRestuarantDeliveryRangeSuccess(payload) {
  return {
    type: actionTypes.FETCH_RESTURANT_DELIVERY_RANGE_SUCCESS,
    payload,
  };
}

export function fetchRestuarantDeliveryRangeFailure(error) {
  return {
    type: actionTypes.FETCH_RESTURANT_DELIVERY_RANGE_FAILURE,
    error,
  };
}

// Comment

export function setComments(payload) {
  return {
    type: actionTypes.SET_COMMENT_FOR_RESTAURANT,
    payload,
  };
}

export const setPhoneCode = (payload) => {
  return {
    type: actionTypes.SET_PHONE_CODE,
    payload,
  };
};

export function fetchClosedInformationRequest() {
  return { type: actionTypes.FETCH_CLOSED_INFORMATION_REQUEST };
}

export function fetchClosedInformationSuccess(payload, timezone) {
  console.log("restro info success", timezone);
  return {
    type: actionTypes.FETCH_CLOSED_INFORMATION_SUCCESS,
    payload,
    timezone,
  };
}

export function fetchClosedInformationFailure(error) {
  return {
    type: actionTypes.FETCH_CLOSED_INFORMATION_FAILURE,
    error,
  };
}

export function setDestinationCoordinates(payload) {
  console.log("coordinates are", payload);
  return {
    type: actionTypes.SET_DESTINATION_COORDINATES,
    payload,
  };
}
