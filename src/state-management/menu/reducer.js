import * as actionTypes from "./actionTypes";
import {
  updateMenuItemsWithCart,
  addItem,
  removeItem,
  removeCartItem,
  revertMenuItemsToInitialState,
  getSelectedCategoryId,
  updateHappyHourInfoToMenuItems,
  revertCartItemsToInitialState,
  updatePizzaItemsWithCart,
} from "./operations";
import { persistState, getPersistedState } from "../operations";

const REDUCER_KEY = "menu-reducer";
const initialState = {
  comments: "",
  categoriesList: [],
  menuItems: [],
  pizzas: [],
  happyHours: [],
  cart: [],
  restaurantInfo: {},
  canShow: false,
  allForcedModifier: [],
  allOptionalModifier: [],
  selectedCategoryId: "",
  searchQuery: "",
  viewType: "menu",
  restaurantId: "",
  showHideOverlay: false,
  displayHappyHours: false,
  displayPizzas: false,
  isHappyHoursApplicable: false,
  displayAddressModal: true,
  isLoading: false,
  choosenCategory: "happy_hours",
};
const itemsToPersist = [
  "cart",
  "selectedCategoryId",
  "searchQuery",
  "restaurantId",
];

let newState;

let menuItemList;

let categoriesList;

let pizzasList;

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_STORE_STATE: {
      newState = {
        ...state,
        ...getPersistedState(state.viewType, action.restaurantId, REDUCER_KEY),
        selectedCategoryId:
          state.restaurantId !== action.restaurantId
            ? ""
            : state.selectedCategoryId,
        searchQuery:
          state.restaurantId !== action.restaurantId ? "" : state.searchQuery,
        restaurantId: action.restaurantId,
      };

      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.FETCH_CATEGORIES_SUCCESS:
      categoriesList = [...action.categoriesList];
      categoriesList.forEach(
        (cat) =>
          cat.sub_category !== undefined &&
          cat.sub_category.sort(
            (a, b) => Number(a.cat_sort) - Number(b.cat_sort)
          )
      );

      return {
        ...state,
        categoriesList,
        selectedCategoryId: !state.selectedCategoryId
          ? getSelectedCategoryId(categoriesList)
          : state.selectedCategoryId,
      };
    case actionTypes.FETCH_HAPPY_HOURS_SUCCESS: {
      newState = {
        ...state,
        happyHours: action.payload,
        isHappyHoursApplicable: action.payload.length > 0,
      };

      return newState;
    }
    case actionTypes.FETCH_MENU_ITEMS_SUCCESS:
      menuItemList = action.payload;
      if (state.happyHours.length > 0) {
        menuItemList = updateHappyHourInfoToMenuItems(
          action.payload,
          state.restaurantInfo,
          state.happyHours
        );
      }
      menuItemList = menuItemList.sort(
        (a, b) => Number(a.sort_order) - Number(b.sort_order)
      );

      return {
        ...state,
        menuItems: state.cart.length
          ? updateMenuItemsWithCart(menuItemList, state.cart)
          : menuItemList,
      };
    case actionTypes.FETCH_PIZZAS_SUCCESS:
      pizzasList = action.payload;
      if (state.happyHours.length > 0) {
        pizzasList = updateHappyHourInfoToMenuItems(
          action.payload,
          state.restaurantInfo,
          state.happyHours
        );
        pizzasList = pizzasList.map((pizza) => {
          pizza.price = 0;
          pizza.isPizza = true;
          if (pizza.size) {
            pizza.size = pizza.size.sort((a, b) => a.price - b.price);
          }

          return pizza;
        });
      }
      pizzasList = pizzasList.sort(
        (a, b) => Number(a.pizza_sort) - Number(b.pizza_sort)
      );

      return {
        ...state,
        pizzas: state.cart.length
          ? updatePizzaItemsWithCart(pizzasList, state.cart)
          : pizzasList,
      };
    case actionTypes.SET_LOADING_DISPLAY:
      return {
        ...state,
        canShow: action.display,
      };
    case actionTypes.FETCH_RESTURANT_INFORMATION_SUCCESS: {
      newState = {
        ...state,
        restaurantInfo: action.payload[0],
      };

      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.ADD_ITEM: {
      newState = {
        ...state,
        ...addItem(
          action.item,
          action.modifiers,
          action.subTotal,
          state.menuItems,
          state.cart,
          action.restaurantInfo,
          state.pizzas
        ),
      };
      console.log("newState", action.modifiers);
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.REMOVE_ITEM: {
      newState = {
        ...state,
        ...removeItem(
          action.item,
          state.menuItems,
          state.cart,
          action.restaurantInfo,
          state.pizzas
        ),
      };

      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.SET_SELECTED_CATEGORY_ID: {
      console.log("sub cat action", action);
      newState = {
        ...state,
        searchQuery: "",
        displayHappyHours: false,
        displayPizzas: false,
        selectedCategoryId: action.categoryId,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.SET_SEARCH_QUERY: {
      newState = {
        ...state,
        searchQuery: action.searchQuery,
        selectedCategoryId:
          action.searchQuery.trim().length > 0
            ? ""
            : state.categoriesList[0]["sub_category"][0]["category_id"],
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.FETCH_ALL_FORCED_MODIFIERS_SUCCESS:
      return {
        ...state,
        allForcedModifier: action.allForcedModifier,
      };
    case actionTypes.FETCH_ALL_OPTIONAL_MODIFIERS_SUCCESS:
      return {
        ...state,
        allOptionalModifier: action.allOptionalModifier,
      };
    case actionTypes.SET_OVERLAY_DISPLAY:
      return {
        ...state,
        showHideOverlay: action.setTrueFalse,
      };
    case actionTypes.CLEAR_MENU_STATE: {
      newState = {
        ...state,
        comments: "",
        cart: [],
        menuItems: revertMenuItemsToInitialState(state.menuItems),
        pizzas: revertCartItemsToInitialState(state.pizzas),
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.DISPLAY_HAPPY_HOURS: {
      newState = {
        ...state,
        displayPizzas: false,
        displayHappyHours: state.happyHours.length,
        selectedCategoryId: -1,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.DISPLAY_PIZZAS: {
      newState = {
        ...state,
        displayHappyHours: false,
        displayPizzas: state.pizzas.length,
        selectedCategoryId: -2,
      };
      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.REMOVE_CART_ITEM: {
      newState = {
        ...state,
        ...removeCartItem(
          action.item,
          state.menuItems,
          state.pizzas,
          state.cart
        ),
      };

      persistState(newState, itemsToPersist, REDUCER_KEY);

      return newState;
    }
    case actionTypes.FETCH_TOPPNGS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actionTypes.FETCH_TOPPNGS_SUCCESS:
    case actionTypes.FETCH_TOPPNGS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actionTypes.SET_COMMENT: {
      newState = {
        ...state,
        comments: action.payload,
      };
      return newState;
    }
    case actionTypes.DISPLAY_ADDRESS_MODAL: {
      return {
        ...state,
        displayAddressModal: action.isDisplay,
      };
    }
    default:
      return state;
  }
};

export default menuReducer;
