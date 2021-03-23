import * as actionTypes from "./actionTypes";
import { persistState, getPersistedState } from "../operations";
import { clearState } from "../utils/localStorage";

const REDUCER_KEY = "user-reducer";

const initialState = {
  delivery_cost :"",
  showLoginForm: false,
  showForgotPasswordForm: false,
  showRegisterForm: false,
  waitingOverlay: false,
  user: {
    isUserLoggedIn: false,
    token: null,
    email: null,
    clientId: null,
    mobile: "",
    profileImage: "",
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    city: "",
    country: "",
    zipcode: "",
    phonecode: "",
  },
  selectedDeliveryTime: null,
  selectedPickUpTime: null,
  deliveryOption: null,
  defaultAddress:null,
  selectedAddress: null,
  distance: -1,
  isTakeAway: false,
  cards: [],
  viewType: "user",

  ...getPersistedState("user", "", REDUCER_KEY),
};

const itemsToPersist = [
  "user",
  "cards",
  "deliveryOption",
  "selectedAddress",
  "isTakeAway",
];

let newState;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:
      newState = {
        ...state,
        waitingOverlay: false,
        showLoginForm: false,
        user: {
          ...state.user,
          isUserLoggedIn: true,
          token: action.payload.token,
          email: action.payload.email,
          clientId: action.payload.clientId,
          mobile: action.payload.mobile,
          profileImage: action.payload.profileImage,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
        },
      };

      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    case actionTypes.SET_USER_LOGGED_OUT:
      newState = {
        ...state,
        user: {
          ...state.user,
          isUserLoggedIn: false,
          loggedInToken: null,
        },
      };

      clearState(state.viewType);

      return newState;
    case actionTypes.SHOW_LOGIN_FORM:
      return {
        ...state,
        showLoginForm: true,
        showRegisterForm: false,
        showForgotPasswordForm: false,
      };
    case actionTypes.HIDE_LOGIN_FORM:
      return {
        ...state,
        showLoginForm: false,
      };
    case actionTypes.POST_LOGIN_FORM_REQUEST:
      return {
        ...state,
        waitingOverlay: true,
      };
    case actionTypes.POST_LOGIN_FORM_SUCCESS:
      return {
        ...state,
        waitingOverlay: false,
      };
    // REGISTER
    case actionTypes.SHOW_REGISTER_FORM:
      return {
        ...state,
        showRegisterForm: true,
      };
    case actionTypes.HIDE_REGISTER_FORM:
      return {
        ...state,
        showRegisterForm: false,
      };
    case actionTypes.POST_REGISTER_FORM_REQUEST:
      return {
        ...state,
        waitingOverlay: true,
      };
    case actionTypes.POST_REGISTER_FORM_FAILED:
      return {
        ...state,
        waitingOverlay: false,
      };
    case actionTypes.POST_REGISTER_FORM_SUCCESS:
      return {
        ...state,
        waitingOverlay: false,
      };

    // FORGOT PASSWORD
    case actionTypes.SHOW_FORGOT_PASSWORD_FORM:
      return {
        ...state,
        showLoginForm: false,
        showForgotPasswordForm: true,
        forgotPasswordSuccess: false,
        forgotPasswordError: false,
      };
    case actionTypes.HIDE_FORGOT_PASSWORD_FORM:
      return {
        ...state,
        showForgotPasswordForm: false,
      };
    case actionTypes.POST_FORGOT_PASSWORD_FORM_REQUEST:
      return {
        ...state,
        waitingOverlay: true,
      };
    case actionTypes.POST_FORGOT_PASSWORD_FORM_FAILED:
      return {
        ...state,
        waitingOverlay: false,
      };
    case actionTypes.POST_FORGOT_PASSWORD_FORM_SUCCESS:
      return {
        ...state,
        waitingOverlay: false,
      };
    case actionTypes.UPDATE_USER_DETAILS: {
      newState = {
        ...state,
        user: {
          ...state.user,
          ...action.user,
        },
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    case actionTypes.ADD_CARD: {
      newState = {
        ...state,
        cards: [...state.cards, action.card],
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    case actionTypes.SET_DELIVERY_OPTION: {
      newState = {
        ...state,
        deliveryOption: action.deliveryOption,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    case actionTypes.SET_SELECTED_ADDRESS: {
      newState = {
        ...state,
        selectedAddress: action.address,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    case actionTypes.SET_DELIVERY_DISTANCE: {
      newState = {
        ...state,
        distance: action.distance,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    // ? set delivery time

    case actionTypes.SET_IS_TAKE_AWAY: {
      newState = {
        ...state,
        isTakeAway: action.isTakeAway,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    case actionTypes.SET_PICKUP_TIME: {
      return {
        ...state,
        selectedPickUpTime: `${action.pickupTime}:00`,
      };
    }
    case actionTypes.SET_PHONE_CODE:{
      return {
        ...state,
       user:{
         ...state.user,
         phonecode:action.phonecode
       }
      }
    }
    case actionTypes.SET_DEFAULT_ADDRESSS:{
      return {
        ...state,
        defaultAddress: action.defaultAddress,
      };
    }
    case actionTypes.SET_DELIVERY_TIME: {
      return {
        ...state,
        selectedDeliveryTime: `${action.deliveryTime}:00`,
      };
    }

  case actionTypes.SET_DELIVERY_COST:{
    return{
      ...state,
      delivery_cost : action.payload
    }
  }

    case actionTypes.POST_MYPROFILE_FORM_SUCCESS: {
      newState = {
        ...state,
        waitingOverlay: false,
        showLoginForm: false,
        user: {
          ...state.user,
          mobile: action.payload.data.mobile,
          firstName: action.payload.data.firstname,
          lastName: action.payload.data.lastname,
          phonecode: action.payload.data.phonecode,
          zipcode: action.payload.data.zipcode,
          address: action.payload.data.address,
          city: action.payload.data.city,
          country: action.payload.data.country,
          state: action.payload.data.state,
        },
      };

      return newState;
    }
    default:
      return state;
  }
};

export default userReducer;
