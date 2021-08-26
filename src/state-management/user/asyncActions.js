import axios from "axios";
import * as actions from "./actions";

export function postLoginForm({ email, password }) {
  return async (dispatch) => {
    dispatch(actions.postLoginFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/login";

    try {
      let loginCredentials = {
        email,
        password,
      };

      loginCredentials = JSON.stringify(loginCredentials);
      const { data } = await axios.post(url, loginCredentials);

      return dispatch(actions.postLoginFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postLoginFormFailure(error));
    }
  };
}

export function postForgotPasswordForm(email) {
  return async (dispatch) => {
    dispatch(actions.postForgotPasswordFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/forgotPassword";

    try {
      let forgotDetails = {
        email,
        timezone: "Asia/Kolkata",
      };

      forgotDetails = JSON.stringify(forgotDetails);
      const { data } = await axios.post(url, forgotDetails);

      return dispatch(actions.postForgotPasswordFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postForgotPasswordFailure(error));
    }
  };
}

export function postPasswordUpdate(userData) {
  return async (dispatch) => {
    dispatch(actions.postPasswordUpdateRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/resetPassword";

    try {
      const { data } = await axios.post(url, JSON.stringify(userData));

      return dispatch(actions.postPasswordUpdateSuccess(data));
    } catch (error) {
      return dispatch(actions.postPasswordUpdateFailure(error));
    }
  };
}

export function postRegisterForm(register) {
  return async (dispatch) => {
    dispatch(actions.postRegisterFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/register";

    try {
      let registerData = {
        firstname: register.firstName,
        lastname: register.lastName,
        password: register.password,
        email: register.email,
        zipcode: register.zipcode,
        mobile: register.mobile,
        phonecode: register.countryCode,
        timezone: register.timezone,
        usertype: "INDIVIDUAL",
        promotional_newsletter: "0",
      };

      registerData = JSON.stringify(registerData);
      const { data } = await axios.post(url, registerData);

      return dispatch(actions.postRegisterFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postRegisterFormFailure(error));
    }
  };
}

// Login/Creating accounts with social accounts i.e fb and google
export function postSocialLoginForm({ socialLoginId, socialType }) {
  return async (dispatch) => {
    dispatch(actions.postSocialLoginFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/login/goLogin";

    try {
      let loginCredentials = {
        social_account_id: socialLoginId,
        type: socialType,
      };

      loginCredentials = JSON.stringify(loginCredentials);
      const { data } = await axios.post(url, loginCredentials);

      return dispatch(actions.postSocialLoginFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postSocialLoginFormFailure(error));
    }
  };
}

export function postSocialRegisterForm(register) {
  return async (dispatch) => {
    dispatch(actions.postSocialRegisterFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/registerWithSocial";

    try {
      let registerData = {
        firstname: register.firstname,
        lastname: register.lastname,
        email: register.email,
        phonecode: register.phonecode,
        mobile: register.mobile,
        timezone: register.timezone,
        account_type: register.account_type,
        social_account_id: register.social_account_id,
      };

      registerData = JSON.stringify(registerData);
      const { data } = await axios.post(url, registerData);

      return dispatch(actions.postSocialRegisterFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postSocialRegisterFormFailure(error));
    }
  };
}

// MyProfile, MyOrders, ChangePasswords
export function postMyProfileForm(clientId) {
  return async (dispatch) => {
    dispatch(actions.postMyProfileFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/profile";

    try {
      let loginCredentials = { client_id: clientId };

      loginCredentials = JSON.stringify(loginCredentials);
      const { data } = await axios.post(url, loginCredentials);

      return dispatch(actions.postMyProfileFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postMyProfileFormFailure(error));
    }
  };
}

export function postProfile(updateData) {
  console.log("updatedatais", updateData);
  return async (dispatch) => {
    dispatch(actions.postMyProfileFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/user/editProfile";

    try {
      const profileData = { user: { ...updateData } };
      const { data } = await axios.post(url, JSON.stringify(profileData));
      console.log("Post Profile Data", data);
      return dispatch(actions.updateMyProfileFormSuccess(data));
    } catch (error) {
      return dispatch(actions.postMyProfileFormFailure(error));
    }
  };
}

export function updateProfile(updateData) {
  return async (dispatch) => {
    dispatch(actions.postMyProfileFormRequest());
    const url = "https://ciboapp.com/api/clients/v2/clientApi/editClientApi";

    try {
      console.log("UPDATE_DATA", updateData);
      const profileData = { ...updateData };
      const { data } = await axios.post(url, JSON.stringify(profileData));
      console.log("Post Profile Data", data);
      return dispatch(actions.updateMyProfileFormSuccess(data.data));
    } catch (error) {
      console.log("UPDATE_PROFILE", error);
      return dispatch(actions.postMyProfileFormFailure(error));
    }
  };
}

export function updatePassword(updatePasswordData) {
  return async (dispatch) => {
    dispatch(actions.postChangePasswordrequest());
    const url = "https://ciboapp.com/api/clients/v2/client/changePassword";

    try {
      console.log("password update data", updatePasswordData);
      const updatechangepassword = { ...updatePasswordData };
      const { data } = await axios.post(
        url,
        JSON.stringify(updatechangepassword)
      );
      return dispatch(actions.postChangePasswordrequestSuccess(data));
    } catch (error) {
      console.log("update_password", error);
      return dispatch(actions.postChangePasswordrequestFailure(error));
    }
  };
}

// MyOrders
export function fetchMyOrderList(userId) {
  return async (dispatch) => {
    dispatch(actions.fetchMyOrderListRequest());
    const url = "https://ciboapp.com/api/mobileApi/v2/app/getOrderList";

    try {
      const dataOrderList = {
        userId,
        start: "0",
        limit: "100000000",
      };
      const esc = encodeURIComponent;
      const queryGetMenuItems = Object.keys(dataOrderList)
        .map((k) => `${esc(k)}=${esc(dataOrderList[k])}`)
        .join("&");
      const { data } = await axios.post(url, queryGetMenuItems);
      console.log("Post Profile Data", data);
      return dispatch(actions.fetchMyOrderListSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchMyOrderListFailure(error));
    }
  };
}

// Order Details
export function fetchMyOrderDetails(orderId) {
  return async (dispatch) => {
    dispatch(actions.fetchMyOrderDetailsRequest());
    const url = `https://ciboapp.com/api/mobileApi/v2/app/getOrder?orderId=${orderId}`;

    try {
      const { data } = await axios.get(url);

      return dispatch(actions.fetchMyOrderDetailsSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchMyOrderDetailsFailure(error));
    }
  };
}

// Manage Addresses

export function postAddAddress(addressData, editMode) {
  //use edit mode for changing the url
  return async (dispatch) => {
    dispatch(actions.postAddAddressRequest());
    const url = `https://ciboapp.com/api/clients/v2/user/${
      editMode ? "editAdresses" : "addAdresses"
    }`;

    try {
      const esc = encodeURIComponent;
      const queryGetMenuItems = Object.keys(addressData)
        .map((k) => `${esc(k)}=${esc(addressData[k])}`)
        .join("&");

      const { data } = await axios.post(url, queryGetMenuItems);

      return dispatch(actions.postAddAddressSuccess(data));
    } catch (error) {
      return dispatch(actions.postAddAddressFailure(error));
    }
  };
}

export function removeAddress(addressData) {
  //use edit mode for changing the url
  return async (dispatch) => {
    dispatch(actions.removeAddressRequest());
    const url = `https://ciboapp.com/api/clients/v2/user/deleteAdresses/id/${addressData.id}`;

    try {
      const { data } = await axios.get(url);

      return dispatch(actions.removeAddressSuccess(data));
    } catch (error) {
      return dispatch(actions.removeAddressFailure(error));
    }
  };
}

export function fetchAddressesList(clientId) {
  return async (dispatch) => {
    dispatch(actions.fetchAddressesListRequest());
    const url = `https://ciboapp.com/api/clients/v2/user/getAdresses/client_id/${clientId}`;

    try {
      const { data } = await axios.get(url);

      return dispatch(actions.fetchAddressesListSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchAddressesListFailure(error));
    }
  };
}
//https://restcountries.eu/rest/v2/all
export function fetchLocaltionFromIP() {
  return async (dispatch) => {
    dispatch(actions.fetchLocaltionFromIPRequest());
    const url = "http://ip-api.com/json";

    try {
      const { data } = await axios.get(url);

      return dispatch(actions.fetchLocaltionFromIPSuccess(data));
    } catch (error) {
      return dispatch(actions.fetchLocaltionFromIPFailure(error));
    }
  };
}

export function fetchUserDetails(clientId) {
  return async (dispatch) => {
    dispatch(actions.fetchUserDetailsRequest());
    const url = "https://ciboapp.com/api/clients/v2/ClientApi/getClientById";

    try {
      let credentials = JSON.stringify({ client_id: clientId });
      console.log("STRINGIFIED_CRED", credentials);
      const { data } = await axios.post(url, credentials);
      // const data = new Promise((res,rej)=>{
      //     setTimeout(()=>{
      //       res("12345678")
      //     },2000)
      // })
      console.log("userDetails", data.data);
      return dispatch(actions.fetchUserDetailsSuccess(data.data));
    } catch (error) {
      console.log(error);
      return dispatch(actions.fetchUserDetailsError(error));
    }
  };
}
