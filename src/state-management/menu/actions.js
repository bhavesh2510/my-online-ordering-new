import * as actionTypes from './actionTypes';

export function fetchCategoriesRequest() {
  return { type: actionTypes.FETCH_CATEGORIES_REQUEST };
}

export function fetchCategoriesSuccess(categoriesList) {
  return {
    type: actionTypes.FETCH_CATEGORIES_SUCCESS,
    categoriesList,
  };
}

export function fetchCategoriesFailure(error) {
  return {
    type: actionTypes.FETCH_CATEGORIES_FAILURE,
    error,
  };
}

export function fetchMenuItemsRequest() {
  return { type: actionTypes.FETCH_MENU_ITEMS_REQUEST };
}

export function fetchMenuItemsSuccess(payload) {
  return {
    type: actionTypes.FETCH_MENU_ITEMS_SUCCESS,
    payload,
  };
}

export function fetchMenuItemsFailure(error) {
  return {
    type: actionTypes.FETCH_MENU_ITEMS_FAILURE,
    error,
  };
}

// PIZZA'S Started

export function fetchPizzasRequest() {
  return { type: actionTypes.FETCH_PIZZAS_REQUEST };
}

export function fetchPizzasSuccess(payload) {
  return {
    type: actionTypes.FETCH_PIZZAS_SUCCESS,
    payload,
  };
}

export function fetchPizzasFailure(error) {
  return {
    type: actionTypes.FETCH_PIZZAS_FAILURE,
    error,
  };
}

export function displayPizzas() {
  return { type: actionTypes.DISPLAY_PIZZAS };
}

export function fetchToppingsRequest() {
  return { type: actionTypes.FETCH_TOPPNGS_REQUEST };
}

export function fetchToppingsSuccess(payload) {
  return {
    type: actionTypes.FETCH_TOPPNGS_SUCCESS,
    payload,
  };
}

export function fetchToppingsFailure(error) {
  return {
    type: actionTypes.FETCH_TOPPNGS_FAILURE,
    error,
  };
}

// Pizza's Finished

export function setLoadingDisplay(display) {
  return {
    type: actionTypes.SET_LOADING_DISPLAY,
    display,
  };
}

export function showHideOverlay(setTrueFalse) {
  return {
    type: actionTypes.SET_OVERLAY_DISPLAY,
    setTrueFalse,
  };
}

export function addItem(item, modifiers = null, subTotal = 0, restaurantInfo) {
  return {
    type: actionTypes.ADD_ITEM,
    item,
    modifiers,
    subTotal,
    restaurantInfo,
  };
}

export function removeItem(item, modifiers = null, subTotal = 0, restaurantInfo) {
  return {
    type: actionTypes.REMOVE_ITEM,
    item,
    modifiers,
    subTotal,
    restaurantInfo,
  };
}

export function setSelectedCategoryId(categoryId) {
  return {
    type: actionTypes.SET_SELECTED_CATEGORY_ID,
    categoryId,
  };
}

export function setSearchQuery(searchQuery) {
  return {
    type: actionTypes.SET_SEARCH_QUERY,
    searchQuery,
  };
}

// Forced Modifiers
export function fetchAllForcedModifiersRequest() {
  return { type: actionTypes.FETCH_ALL_FORCED_MODIFIERS_REQUEST };
}

export function fetchAllForcedModifiersSuccess(allForcedModifier) {
  return {
    type: actionTypes.FETCH_ALL_FORCED_MODIFIERS_SUCCESS,
    allForcedModifier,
  };
}

export function fetchAllForcedModifiersFailure(error) {
  return {
    type: actionTypes.FETCH_ALL_FORCED_MODIFIERS_FAILURE,
    error,
  };
}

// Optional Modifiers
export function fetchAllOptionalModifiersRequest() {
  return { type: actionTypes.FETCH_ALL_OPTIONAL_MODIFIERS_REQUEST };
}

export function fetchAllOptionalModifiersSuccess(allOptionalModifier) {
  return {
    type: actionTypes.FETCH_ALL_OPTIONAL_MODIFIERS_SUCCESS,
    allOptionalModifier,
  };
}

export function fetchAllOptionalModifiersFailure(error) {
  return {
    type: actionTypes.FETCH_ALL_OPTIONAL_MODIFIERS_FAILURE,
    error,
  };
}

export function placeOrderRequest() {
  return { type: actionTypes.PLACE_ORDER_REQUEST };
}

export function placeOrderSuccess(data) {
  return {
    type: actionTypes.PLACE_ORDER_SUCCESS,
    data,
  };
}

export function placeOrderFailure(error) {
  return {
    type: actionTypes.PLACE_ORDER_FAILURE,
    error,
  };
}

export function initializeStoreState(restaurantId) {
  return {
    type: actionTypes.INITIALIZE_STORE_STATE,
    restaurantId,
  };
}

export function clearState() {
  return { type: actionTypes.CLEAR_STATE };
}

export function clearMenuState() {
  return { type: actionTypes.CLEAR_MENU_STATE };
}

// Fetch happy hours

export function fetchHappyHoursRequest() {
  return { type: actionTypes.FETCH_HAPPY_HOURS_REQUEST };
}

export function fetchHappyHoursSuccess(payload) {
  return {
    type: actionTypes.FETCH_HAPPY_HOURS_SUCCESS,
    payload,
  };
}

export function fetchHappyHoursFailure(error) {
  return {
    type: actionTypes.FETCH_HAPPY_HOURS_FAILURE,
    error,
  };
}

export function displayHappyHours() {
  return { type: actionTypes.DISPLAY_HAPPY_HOURS };
}

export function removeCartItem(item) {
  return {
    type: actionTypes.REMOVE_CART_ITEM,
    item,
  };
}

// Comment

export function setComment(payload) {
  return {
    type: actionTypes.SET_COMMENT,
    payload,
  };
}

export function displayAddressModal(isDisplay) {
  return {
    type: actionTypes.DISPLAY_ADDRESS_MODAL,
    isDisplay,
  }
}