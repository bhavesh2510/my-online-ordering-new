import * as actionTypes from "./actionTypes";
import { persistState, getPersistedState, clearState } from "../operations";
import { CLEAR_STATE } from "../menu/actionTypes";
import { getBusinessHours } from "./operations";

const REDUCER_KEY = "main-reducer";
const initialState = {
  // comments: "",
  restaurants: [],
  chainId: "",
  restId: "",
  selectedRestaurant: null,
  viewType: "restaurantList",
  ...getPersistedState("restaurantList", "", REDUCER_KEY),
  deliveryRange: null,
  businessHour: "",
  opening: "",
  closing: "",
  isClosed: false,
  phonecode: "",
};

const itemsToPersist = ["selectedRestaurant", "chainId", "restId"];

let newState;

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_RESTURANT_LIST_SUCCESS: {
      console.log(action.payload.data);
      newState = {
        ...state,
        restaurants: action.payload.data,
        chainId: action.chainId,
        restId: "",
        selectedRestaurant: null,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.SET_PHONE_CODE: {
      newState = {
        ...state,
        phoneCode: action.payload,
      };
      return newState;
    }
    case actionTypes.SET_SELECTED_RESTAURANT: {
      newState = {
        ...state,
        selectedRestaurant: action.restaurant,
        chainId: action.restId ? "" : state.chainId,
        restId: action.restId,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.FETCH_RESTURANT_DELIVERY_RANGE_SUCCESS: {
      newState = {
        ...state,
        deliveryRange: action.payload,
      };

      return newState;
    }
    case actionTypes.FETCH_RESTURANT_INFORMATION_SUCCESS: {
      newState = {
        ...state,
        selectedRestaurant: action.payload[0],
        ...getBusinessHours(action.payload[0]),
      };

      return newState;
    }
    case actionTypes.SET_COMMENT_FOR_RESTAURANT: {
      newState = {
        ...state,
        comments: action.payload,
      };
      return newState;
    }
   
    case CLEAR_STATE: {
      newState = {
        ...state,
        selectedRestaurant: null,
      };
      clearState(
        state.viewType,
        state.selectedRestaurant ? state.selectedRestaurant.restaurant_id : ""
      );
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }

    default:
      return state;
  }
};

export default mainReducer;
