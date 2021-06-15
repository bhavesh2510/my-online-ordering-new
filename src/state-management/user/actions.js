import * as actionTypes from "./actionTypes";

// SET USER LOGGED IN/OUT

export function setUserLoggedIn(payload) {
  return {
    type: actionTypes.SET_USER_LOGGED_IN,
    payload,
  };
}

export function setUserLoggedOut() {
  return { type: actionTypes.SET_USER_LOGGED_OUT };
}

// LOGIN ACTIONS

export function postLoginFormRequest() {
  return { type: actionTypes.POST_LOGIN_FORM_REQUEST };
}

export function postLoginFormSuccess(payload) {
  return {
    type: actionTypes.POST_LOGIN_FORM_SUCCESS,
    payload,
  };
}

export function postLoginFormFailure(payload) {
  return {
    type: actionTypes.POST_LOGIN_FORM_FAILED,
    payload,
  };
}

export function showLoginFormMethod(error) {
  return {
    type: actionTypes.SHOW_LOGIN_FORM,
    error,
  };
}

export function hideLoginFormMethod(error) {
  return {
    type: actionTypes.HIDE_LOGIN_FORM,
    error,
  };
}

// FORGOT PASSWORD ACTIONS

export function showForgotPasswordFormMethod() {
  return { type: actionTypes.SHOW_FORGOT_PASSWORD_FORM };
}
export function showRegisterFormMethod() {
  return { type: actionTypes.SHOW_REGISTER_FORM };
}

export function hideForgotPasswordFormMethod() {
  return { type: actionTypes.HIDE_FORGOT_PASSWORD_FORM };
}

export function postForgotPasswordFormRequest() {
  return { type: actionTypes.POST_FORGOT_PASSWORD_FORM_REQUEST };
}

export function postForgotPasswordFormSuccess(payload) {
  return {
    type: actionTypes.POST_FORGOT_PASSWORD_FORM_SUCCESS,
    payload,
  };
}

export function postForgotPasswordFailure(payload) {
  return {
    type: actionTypes.POST_FORGOT_PASSWORD_FORM_FAILED,
    payload,
  };
}

export function postPasswordUpdateRequest() {
  return { type: actionTypes.POST_PASSWORD_REQUEST };
}

export function postPasswordUpdateSuccess(payload) {
  return {
    type: actionTypes.POST_PASSWORD_SUCCESS,
    payload,
  };
}

export function postPasswordUpdateFailure(payload) {
  return {
    type: actionTypes.POST_PASSWORD_FAILED,
    payload,
  };
}
// REGISTER ACTIONS

// export function showRegisterFormMethod() {
//   return { type: actionTypes.SHOW_REGISTER_FORM };
// }

export function hideRegisterFormMethod() {
  return { type: actionTypes.HIDE_REGISTER_FORM };
}

export function postRegisterFormRequest() {
  return { type: actionTypes.POST_REGISTER_FORM_REQUEST };
}

export function postRegisterFormSuccess(payload) {
  return {
    type: actionTypes.POST_REGISTER_FORM_SUCCESS,
    payload,
  };
}

export function postRegisterFormFailure(payload) {
  return {
    type: actionTypes.POST_REGISTER_FORM_FAILED,
    payload,
  };
}

// LOGIN WITH SOCIAL ACTIONS

export function postSocialLoginFormRequest() {
  return { type: actionTypes.POST_SOCIAL_LOGIN_FORM_REQUEST };
}

export function postSocialLoginFormSuccess(payload) {
  return {
    type: actionTypes.POST_SOCIAL_LOGIN_FORM_SUCCESS,
    payload,
  };
}

export function postSocialLoginFormFailure(payload) {
  return {
    type: actionTypes.POST_SOCIAL_LOGIN_FORM_FAILED,
    payload,
  };
}

// REGISTER WITH SOCIAL ACTIONS

export function postSocialRegisterFormRequest() {
  return { type: actionTypes.POST_SOCIAL_REGISTER_FORM_REQUEST };
}

export function postSocialRegisterFormSuccess(payload) {
  return {
    type: actionTypes.POST_SOCIAL_REGISTER_FORM_SUCCESS,
    payload,
  };
}

export function postSocialRegisterFormFailure(payload) {
  return {
    type: actionTypes.POST_SOCIAL_REGISTER_FORM_FAILED,
    payload,
  };
}

// My Account

// 1. MyProfile
export function postMyProfileFormRequest() {
  return { type: actionTypes.POST_MYPROFILE_FORM_REQUEST };
}

export function postMyProfileFormSuccess(payload) {
  return {
    type: actionTypes.POST_MYPROFILE_FORM_SUCCESS,
    payload,
  };
}
export function updateMyProfileFormSuccess(payload) {
  return {
    type: actionTypes.UPDATE_MYPROFILE_FORM_SUCCESS,
    payload,
  };
}
//start
export function postChangePasswordrequest() {
  return {
    type: actionTypes.POST_CHANGE_PASSWORD_REQUEST,
  };
}

export function postChangePasswordrequestSuccess(payload) {
  return {
    type: actionTypes.POST_CHANGE_PASSWORD_SUCCESS,
    payload,
  };
}

export function postChangePasswordrequestFailure(payload) {
  return {
    type: actionTypes.POST_CHANGE_PASSWORD_FAILURE,
    payload,
  };
}

//end

export function postMyProfileFormFailure(payload) {
  return {
    type: actionTypes.POST_MYPROFILE_FORM_FAILED,
    payload,
  };
}

// 2. MyOrders
// OrderList
export function fetchMyOrderListRequest() {
  return { type: actionTypes.FETCH_MYORDERSLIST_REQUEST };
}

export function fetchMyOrderListSuccess(payload) {
  return {
    type: actionTypes.FETCH_MYORDERSLIST_SUCCESS,
    payload,
  };
}

export function fetchMyOrderListFailure(payload) {
  return {
    type: actionTypes.FETCH_MYORDERSLIST_FAILED,
    payload,
  };
}

// Order Details
export function fetchMyOrderDetailsRequest() {
  return { type: actionTypes.FETCH_MYORDERDETAILS_REQUEST };
}

export function fetchMyOrderDetailsSuccess(payload) {
  return {
    type: actionTypes.FETCH_MYORDERDETAILS_SUCCESS,
    payload,
  };
}

export function fetchMyOrderDetailsFailure(payload) {
  return {
    type: actionTypes.FETCH_MYORDERDETAILS_FAILED,
    payload,
  };
}

export function updateUserDetails(user) {
  return {
    type: actionTypes.UPDATE_USER_DETAILS,
    user,
  };
}

export function addCard(card) {
  return {
    type: actionTypes.ADD_CARD,
    card,
  };
}

// Manage Addresses.

// Add addresses.

export function postAddAddressRequest() {
  return { type: actionTypes.POST_ADD_ADDRESS_REQUEST };
}

export function postAddAddressSuccess(payload) {
  return {
    type: actionTypes.POST_ADD_ADDRESS_SUCCESS,
    payload,
  };
}

export function postAddAddressFailure(payload) {
  return {
    type: actionTypes.POST_ADD_ADDRESS_FAILED,
    payload,
  };
}

// Get Addresses

export function fetchAddressesListRequest() {
  return { type: actionTypes.FETCH_ADDRESS_REQUEST };
}

export function fetchAddressesListSuccess(payload) {
  console.log("fetchAddressesListSuccess: ", payload);
  return {
    type: actionTypes.FETCH_ADDRESS_SUCCESS,
    payload,
  };
}

export function fetchAddressesListFailure(payload) {
  return {
    type: actionTypes.FETCH_ADDRESS_FAILED,
    payload,
  };
}

export function fetchLocaltionFromIPRequest() {
  return { type: actionTypes.FETCH_LOCATION_FROM_IP_REQUEST };
}

export function fetchLocaltionFromIPSuccess(information) {
  return {
    type: actionTypes.FETCH_LOCATION_FROM_IP_SUCCESS,
    information,
  };
}

export function fetchLocaltionFromIPFailure(error) {
  return {
    type: actionTypes.FETCH_LOCATION_FROM_IP_FAILURE,
    error,
  };
}

export function removeAddressRequest() {
  return { type: actionTypes.REMOVE_ADDRESS_REQUEST };
}

export function removeAddressSuccess(response) {
  return {
    type: actionTypes.REMOVE_ADDRESS_SUCCESS,
    response,
  };
}

export function removeAddressFailure(error) {
  return {
    type: actionTypes.REMOVE_ADDRESS_FAILURE,
    error,
  };
}

export function setDeliveryOption(deliveryOption) {
  console.log("deliveryOption ", deliveryOption);
  return {
    type: actionTypes.SET_DELIVERY_OPTION,
    deliveryOption,
  };
}

export function setSelectedAddress(address) {
  return {
    type: actionTypes.SET_SELECTED_ADDRESS,
    address,
  };
}

export function setDeliveryDistance(distance) {
  return {
    type: actionTypes.SET_DELIVERY_DISTANCE,
    distance,
  };
}

export function setIsTakeAway(isTakeAway) {
  return {
    type: actionTypes.SET_IS_TAKE_AWAY,
    isTakeAway,
  };
}

// PICKUP TIME
export function setPickupTime(pickupTime) {
  return {
    type: actionTypes.SET_PICKUP_TIME,
    pickupTime,
  };
}

//get default address

// Delivery time

export function setDeliveryTime(deliveryTime) {
  return {
    type: actionTypes.SET_DELIVERY_TIME,
    deliveryTime,
  };
}

export function setDeliveryCost(payload) {
  return {
    type: actionTypes.SET_DELIVERY_COST,
    payload,
  };
}

// Set Phone Code

export function setPhoneCode(phonecode) {
  return {
    type: actionTypes.SET_PHONE_CODE,
    phonecode,
  };
}

//set default address

export function setDefaultAddress(defaultAddress) {
  return {
    type: actionTypes.SET_DEFAULT_ADDRESSS,
    defaultAddress,
  };
}

export function fetchUserDetailsRequest() {
  return {
    type: actionTypes.FETCH_USER_DETAILS_REQUEST,
  };
}

export function fetchUserDetailsSuccess(payload) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
    payload,
  };
}
export function fetchUserDetailsError(payload) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_ERROR,
    payload,
  };
}
