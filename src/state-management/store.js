import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import menuReducer from "./menu/reducer";
import mainReducer from "./main/reducer";
import userReducer from "./user/reducer";
import modalReducer from "./modal/reducer";

import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      /* Options like actionSanitizer, stateSanitizer */
    })
  : compose;
const middlewareCandidates = [thunk];

// if (process.env.NODE_ENV === "development") {
//   middlewareCandidates.push(createLogger());
// }
const enhancer = composeEnhancers(applyMiddleware(...middlewareCandidates));
const rootReducer = combineReducers({
  menu: menuReducer,
  main: mainReducer,
  user: userReducer,
  modal: modalReducer,
});

const store = createStore(rootReducer, enhancer);

export default store;
