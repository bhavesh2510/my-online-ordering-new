import axios from "axios"
import * as actions from "./actions"

export function fetchRestuarantInformation(restId) {
  return async (dispatch) => {
    dispatch(actions.fetchRestuarantInformationRequest())
    const url = `https://ciboapp.com/api/mobileApi/v2/app/getRestData/rest_id/${restId}`

    try {
      const {
        data: { data }
      } = await axios.get(url)

      return dispatch(actions.fetchRestuarantInformationSuccess(data))
    } catch (error) {
      return dispatch(actions.fetchRestuarantInformationFailure(error))
    }
  }
}

export function fetchRestuarantDeliveryRange(restId) {
  return async (dispatch) => {
    // dispatch(actions.fetchRestuarantDeliveryRangeRequest());
    const url = `https://ciboapp.com/api/mobileApi/v2/app/getDeliveryPrice/restId//${restId}`

    try {
      const {
        data: { data }
      } = await axios.get(url)
      return dispatch(actions.fetchRestuarantDeliveryRangeSuccess(data))
    } catch (error) {
      return dispatch(actions.fetchRestuarantDeliveryRangeFailure(error))
    }
  }
}

export function fetchRestuarantList(id) {
  return async (dispatch) => {
    dispatch(actions.fetchRestaurantListRequest())
    const url = "https://ciboapp.com/api/mobileApi/v1/app/getRestList"

    try {
      const restaurantListData = {
        chain_id: id || 8, //todo: remove hardcoded id after testing
        start: 0,
        limit: 100
      }

      const esc = encodeURIComponent
      const queryGetMenuItems = Object.keys(restaurantListData)
        .map((k) => `${esc(k)}=${esc(restaurantListData[k])}`)
        .join("&")
      const { data } = await axios.post(url, queryGetMenuItems)

      return dispatch(actions.fetchRestaurantListSuccess(data, id))
    } catch (error) {
      return dispatch(actions.fetchRestaurantListFailure(error))
    }
  }
}

export function fetchClosedInformation(restId, timezone) {
  console.log("timezone in fetch restro", timezone)
  return async (dispatch) => {
    // dispatch(actions.fetchRestuarantDeliveryRangeRequest());
    const url = `https://ciboapp.com/api/mobileApi/v2/app/settings/restId/${restId}`

    try {
      const {
        data: { data }
      } = await axios.get(url)
      return dispatch(actions.fetchClosedInformationSuccess(data, timezone))
    } catch (error) {
      return dispatch(actions.fetchClosedInformationFailure(error))
    }
  }
}
