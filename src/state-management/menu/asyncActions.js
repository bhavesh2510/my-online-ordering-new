import axios from "axios";
import * as actions from "./actions";

export function fetchCategories(restaurantId) {
  return async (dispatch) => {
    dispatch(actions.fetchCategoriesRequest());
    const url = `https://ciboapp.com/api/mobileApi/v2/app/getCategory/restId/${restaurantId}`;

    try {
      const {
        data: { data },
      } = await axios.get(url);

      return dispatch(actions.fetchCategoriesSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchCategoriesFailure(error));
    }
  };
}

export function fetchMenuItems(restaurantId) {
  return async (dispatch) => {
    dispatch(actions.fetchMenuItemsRequest());
    const url = "https://ciboapp.com/api/mobileApi/v2/app/getItems";

    let start = 0;

    const limit = 1000;

    let fetch = true;

    const allFetchedData = [];

    while (fetch) {
      try {
        const dataMenuItems = {
          restId: restaurantId,
          filterByOnline: "true",
          start,
          limit,
        };
        const esc = encodeURIComponent;
        const queryGetMenuItems = Object.keys(dataMenuItems)
          .map((k) => `${esc(k)}=${esc(dataMenuItems[k])}`)
          .join("&");
        const {
          data: { data },
        } = await axios.post(url, queryGetMenuItems);

        console.log("data in fetchmenu", data);

        const mainLength = allFetchedData.length;

        for (let i = 0; i < data.length; i++) {
          allFetchedData[mainLength + i] = data[i];
        }

        if (data.length === 0) {
          fetch = false;

          return dispatch(
            actions.fetchMenuItemsSuccess(
              JSON.parse(JSON.stringify(allFetchedData))
            )
          );
        }
        dispatch(
          actions.fetchMenuItemsSuccess(
            JSON.parse(JSON.stringify(allFetchedData))
          )
        );
        start += limit + 1;
      } catch (error) {
        return dispatch(actions.fetchMenuItemsFailure(error));
      }
    }
  };
}

export function fetchPizzas(restaurantId) {
  return async (dispatch) => {
    dispatch(actions.fetchPizzasRequest());

    let start = 0;

    const limit = 20;

    let fetch = true;

    const allFetchedData = [];

    while (fetch) {
      try {
        const url = `https://ciboapp.com/api/mobileApi/v2/app/getPizza/${restaurantId}/${start}/${limit}`;
        const {
          data: { data },
        } = await axios.get(url);

        const mainLength = allFetchedData.length;

        for (let i = 0; i < data.length; i++) {
          allFetchedData[mainLength + i] = data[i];
        }

        if (data.length === 0) {
          fetch = false;

          return dispatch(
            actions.fetchPizzasSuccess(
              JSON.parse(JSON.stringify(allFetchedData))
            )
          );
        }
        dispatch(
          actions.fetchPizzasSuccess(JSON.parse(JSON.stringify(allFetchedData)))
        );
        start += limit + 1;
      } catch (error) {
        return dispatch(actions.fetchPizzasFailure(error));
      }
    }
  };
}

export function fetchToppings(requestData) {
  return async (dispatch) => {
    dispatch(actions.fetchToppingsRequest());
    const url = "https://ciboapp.com/api/mobileApi/v2/app/getPizzaToppingsAll";

    try {
      const {
        data: { data },
      } = await axios.post(url, JSON.stringify(requestData));

      return dispatch(actions.fetchToppingsSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchToppingsFailure(error));
    }
  };
}

export function fetchHappyHours(restId) {
  return async (dispatch) => {
    dispatch(actions.fetchHappyHoursRequest());
    const url = `https://ciboapp.com/api/mobileApi/v2/app/getHappyHours/restId/${restId}`;

    try {
      const {
        data: { data },
      } = await axios.get(url);

      return dispatch(actions.fetchHappyHoursSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchHappyHoursFailure(error));
    }
  };
}

export function fetchAllForcedModifiers(restaurantId) {
  return async (dispatch) => {
    dispatch(actions.fetchAllForcedModifiersRequest());
    const url = `https://ciboapp.com/api/mobileApi/v1/app/getAllModifiers/restId/${restaurantId}/type/fm`;

    try {
      const {
        data: { data },
      } = await axios.get(url);

      return dispatch(actions.fetchAllForcedModifiersSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchAllForcedModifiersFailure(error));
    }
  };
}

export function fetchAllOptionalModifiers(restaurantId) {
  return async (dispatch) => {
    dispatch(actions.fetchAllOptionalModifiersRequest());
    const url = `https://ciboapp.com/api/mobileApi/v1/app/getAllModifiers/restId/${restaurantId}/type/om`;

    try {
      const {
        data: { data },
      } = await axios.get(url);

      return dispatch(actions.fetchAllOptionalModifiersSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchAllOptionalModifiersFailure(error));
    }
  };
}

export function placeOrder(order) {
  console.log("Place Order: ", order);
  return async (dispatch) => {
    dispatch(actions.placeOrderRequest());
    const url = "https://ciboapp.com/api/mobileApi/v2/app/sendOrderSync";

    try {
      const { data } = await axios.post(url, JSON.stringify(order));

      return dispatch(actions.placeOrderSuccess(data));
    } catch (error) {
      return dispatch(actions.placeOrderFailure(error));
    }
  };
}

export function fetchCoupons(date, restaurantId) {
  console.log("date in menu", date, restaurantId);
  return async (dispatch) => {
    dispatch(actions.fetchCouponsRequest());
    var axios = require("axios");
    var FormData = require("form-data");
    var data = new FormData();
    data.append("date", `${date}`);
    data.append("restaurant_id", `${restaurantId}`);

    var config = {
      method: "post",
      url: "https://ciboapp.com/api/mobileApi/v2/app/getCoupons",
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log("response of coupons", response.data.data);
        dispatch(actions.fetchCouponsSuccess(response.data.data));
      })
      .catch(function (error) {
        console.log(error);
        dispatch(actions.fetchCouponsFailure(error));
      });
  };
}

export function checkCoupons(clientId, date, restaurantId, couponcode) {
  console.log(
    "data of coupon check :",
    clientId,
    date,
    restaurantId,
    couponcode
  );
  return async (dispatch) => {
    dispatch(actions.checkCouponsRequest());
    var axios = require("axios");
    var FormData = require("form-data");
    var data_form = new FormData();
    data_form.append("client_id", `${clientId}`);
    data_form.append("date", `${date}`);
    data_form.append("restaurant_id", `${restaurantId}`);
    data_form.append("code", `${couponcode}`);
    const url = "https://ciboapp.com/api/mobileApi/v2/app/checkCoupon";

    try {
      const { data } = await axios.post(url, data_form);

      return dispatch(actions.checkCouponsSuccess(data));
    } catch (error) {
      return dispatch(actions.checkCouponsFailure(error));
    }
  };
}

export function couponRedeem(clientId, restaurantId, couponId) {
  console.log("im in line 259");
  console.log("im in line 260", clientId, restaurantId, couponId);
  console.log("data of coupon redeem :", clientId, restaurantId, couponId);
  return async (dispatch) => {
    dispatch(actions.redeemCouponRequest());
    var axios = require("axios");
    var FormData = require("form-data");
    var data_form = new FormData();
    data_form.append("client_id", `${clientId}`);

    data_form.append("restaurant_id", `${restaurantId}`);
    data_form.append("coupon_id", `${couponId}`);
    const url = "https://ciboapp.com/api/mobileApi/v2/app/redeem";
    console.log("im in line 270");

    try {
      const { data } = await axios.post(url, data_form);
      console.log("response of redeem data", data);

      return dispatch(actions.redeemCouponSuccess(data));
    } catch (error) {
      return dispatch(actions.redeemCouponFailure(error));
    }
  };
}
