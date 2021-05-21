import React, { useState } from "react";
import "../Login/login.css";
import { notification } from "antd";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import WaitingOverlay from "../../components/WaitingOverlay/WaitingOverlay";
import IconButton from "@material-ui/core/IconButton";
import { showRegisterFormMethod } from "../../state-management/user/actions";
import { showForgotPasswordFormMethod } from "../../state-management/user/actions";
import {
  hideLoginFormMethod,
  setUserLoggedIn,
} from "../../state-management/user/actions";
import FacebookLogin from "react-facebook-login";
import {
  postLoginForm,
  postSocialRegisterForm,
  postSocialLoginForm,
  updateProfile,
} from "../../state-management/user/asyncActions";
import GoogleLogin from "react-google-login";

const Login = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const [state, setState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    phonecode: "",
    timezone: "",
    socialLoginId: null,
    socialType: "",
    profileImage: "",
    token: null,
    clientId: null,
    submittingClass: "",
    submitText: "SUBMIT",
    errorMessage: false,
    requestSuccess: null,
    showLoader: false,
  });
  const dispatch = useDispatch();

  const closeLoginModal = () => {
    dispatch(hideLoginFormMethod());
  };
  const showCreateAccount = () => {
    dispatch(showRegisterFormMethod());
    //alert("cloick");
  };
  const showForgotPassword = () => {
    dispatch(showForgotPasswordFormMethod());
  };

  const onEmailChange = (value) => {
    console.log("value", { ...state, [value.target.name]: value.target.value });
    setState({ ...state, [value.target.name]: value.target.value });
  };

  const onPasswordChange = (value) => {
    setState({ ...state, password: value });
  };

  const onFormSubmit = async () => {
    setState({
      ...state,
      submitText: "Please Wait...",
      errorMessage: false,
      submittingClass: "submitting",
      requestSuccess: null,
      showLoader: true,
    });

    console.log("login data is", state);
    const resp = await dispatch(postLoginForm(state));
    const { payload } = await resp;
    console.log("normal", payload);

    if (payload.success) {
      const {
        token,
        data: {
          firstname: firstName,
          lastname: lastName,
          mobile,
          email,
          client_id: clientId,
        },
      } = payload;

      //console.log("check", payload);

      // const va = {
      //   token: payload.token,
      //   firstName: payload.data.firstname,
      //   lastName: payload.data.lastname,
      //   mobile: payload.data.mobile,
      //   email: payload.data.email,
      //   clientId: payload.data.client_id,
      // };

      // console.log("state after", va);

      setState({
        ...state,
        token,
        firstName,
        lastName,
        mobile,
        email,
        clientId,
      });
      if (!state.mobile) {
        const phoneNumber = getPhoneNumber();
        // console.log("input from prompt", phoneNumber);
        console.log("MERCHANT", menu.restaurantInfo.merchant_key);
        const updateCred = {
          client_id: payload.data.client_id,
          merchant_id: menu.restaurantInfo.merchant_key,
          phone: phoneNumber,
        };
        const resp2 = await dispatch(updateProfile(updateCred));
        const {
          payload: { success, message },
        } = await resp2;
        console.log("UPDATE_PROFILE", payload);
        if (success) {
          alert("Phonenumber Added succesfully");
        } else {
          alert("Some Error has occured! please check My Profile");
        }
      }
      // console.log("normal before login", );
      dispatch(
        setUserLoggedIn({
          token,
          firstName,
          lastName,
          mobile,
          email,
          clientId,
        })
      );

      //this.props.hideLoginFormMethod();
    }

    setState({
      ...state,
      submitText: "SUBMIT",
      errorMessage: payload.message,
      submittingClass: "",
      requestSuccess: payload.success,
      showLoader: false,
    });

    {
      payload.message
        ? notification.open({
            message: `${payload.message}`,
            style: {
              marginTop: "50px",
              color: "rgba(0, 0, 0, 0.65)",
              border: "1px solid #b7eb8f",
              backgroundColor: "#f6ffed",
            },
          })
        : notification.open({
            message: "Login Successfull",
            style: {
              marginTop: "50px",
              color: "rgba(0, 0, 0, 0.65)",
              border: "1px solid #b7eb8f",
              backgroundColor: "#f6ffed",
            },
          });
    }
  };

  const getPhoneNumber = () => {
    let phoneNumber = prompt("please enter phoneNumber");
    if (phoneNumber == null || phoneNumber === "") {
      this.getPhoneNumber();
    } else {
      return phoneNumber;
    }
  };

  const responseFacebook = async (res) => {
    // check popup window is closed by user
    // then simply return
    if (res.status !== undefined && res.status === "unknown") {
      return;
    }

    let newState = {
      socialLoginId: res.userID,
      socialType: "facebook",
      profileImage: res.picture.data.url,
      email: res.email,
      firstName: res.name.split(" ")[0],
      lastName: res.name.split(" ")[1],
      showLoader: true,
    };
    setState(newState);

    // First check if this user exist in database
    //const { payload } = await this.props.postSocialLoginForm(state);

    const resp = await dispatch(postSocialLoginForm(newState));
    const { payload } = await resp;

    if (payload.success) {
      // user logged In
      const newStateAgain = {
        clientId: payload.data.client_id,
        token: payload.token,
        showLoader: false,
        mobile: payload.data.mobile,
      };
      setState(newStateAgain);
      //this.props.setUserLoggedIn(this.state);
      dispatch(postSocialLoginForm(newStateAgain));
    } else {
      const newStateAgain = {
        clientId: payload.data.client_id,
        token: payload.token,
        showLoader: false,
        mobile: payload.data.mobile,
      };
      // create an account
      const resp = await dispatch(postSocialRegisterForm(newStateAgain));
      const { payload } = await resp;

      const newStateAgain2 = {
        clientId: payload.data.client_id,
        token: payload.token,
        showLoader: false,
      };

      if (payload.success) {
        this.setState(newStateAgain2);
        // this.props.setUserLoggedIn(this.state);
        dispatch(setUserLoggedIn(state));
      } else {
        // some error has occured
      }
    }
  };

  //google
  const responseGoogle = async (res) => {
    if (res.error) {
      return;
    }
    const newState = {
      socialLoginId: res.profileObj.googleId,
      socialType: "google",
      profileImage: res.profileObj.imageUrl,
      email: res.profileObj.email,
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      showLoader: true,
    };
    setState(newState);
    console.log("121 state", newState);
    // First check if this user exist in database
    // const { payload } = await postSocialLoginForm(newState);
    const resp = await dispatch(postSocialLoginForm(newState));
    const { payload } = await resp;
    console.log("124 res", resp);
    if (payload.success) {
      // user logged In
      const newStateAgain = {
        socialLoginId: res.profileObj.googleId,
        socialType: "google",
        profileImage: res.profileObj.imageUrl,
        email: res.profileObj.email,
        firstName: res.profileObj.givenName,
        lastName: res.profileObj.familyName,
        showLoader: true,
        clientId: payload.data.client_id,
        token: payload.token,
        mobile: payload.data.mobile,
        showLoader: false,
      };
      setState(newStateAgain);

      //ask phn no

      if (!state.mobile) {
        const phoneNumber = getPhoneNumber();
        // console.log("input from prompt", phoneNumber);
        console.log("MERCHANT", menu.restaurantInfo.merchant_key);
        const updateCred = {
          client_id: payload.data.client_id,
          merchant_id: menu.restaurantInfo.merchant_key,
          phone: phoneNumber,
        };
        const resp2 = await dispatch(updateProfile(updateCred));
        const {
          payload: { success, message },
        } = await resp2;
        console.log("UPDATE_PROFILE", payload);
        if (success) {
          alert("Phonenumber Added succesfully");
        } else {
          alert("Some Error has occured! please check My Profile");
        }
      }

      //   // set user as logged in
      //   // this.props.setUserLoggedIn(this.state);
      dispatch(setUserLoggedIn(newStateAgain)); //newState
    } else {
      // create an account
      //
      const { payload } = await dispatch(postSocialRegisterForm(newState)); //state
      if (payload.success) {
        const newStateAgain2 = {
          clientId: payload.data.client_id,
          token: payload.token,
          showLoader: false,
        };
        setState(newStateAgain2);
        //this.props.setUserLoggedIn(this.state);
        dispatch(setUserLoggedIn(newStateAgain2)); //state
      } else {
        // some error has occured
      }
    }
  };
  return (
    <>
      <div id="parent" className="modal-container">
        <div className="align-container-center">
          {user.waitingOverlay ? (
            <>
              {/* <Loader /> */}
              <WaitingOverlay />
            </>
          ) : null}
          <div className="login-box">
            <div className="close">
              <IconButton
                onClick={closeLoginModal}
                style={
                  {
                    //   backgroundColor: "#6244da",
                    //   marginRight: "-45px",
                    //   marginTop: "-35px",
                  }
                }
              >
                {" "}
                <CloseIcon style={{ color: "Black" }} />{" "}
              </IconButton>
            </div>
            <div className="header" style={{ marginLeft: "40%" }}>
              <strong style={{ color: "#5d5e5e", fontSize: "20px" }}>
                LOGIN
              </strong>
            </div>
            {/* end of header */}
            <div className="login-form">
              <TextField
                name="email"
                placeholder="Email"
                value={state.email}
                onChange={onEmailChange}
                style={{ width: "90%", height: "-50px" }}
                // label="Email"
                variant="outlined"
              />
              <br /> <br />
              <TextField
                name="password"
                placeholder="password"
                type="password"
                value={state.password}
                onChange={onEmailChange}
                style={{ width: "90%" }}
                //label="Password"
                variant="outlined"
              />
              <br /> <br />
              <Button
                onClick={onFormSubmit}
                style={{
                  backgroundColor: "#6244da",
                  padding: "10px",
                  color: "white",
                  width: "90%",
                }}
              >
                Submit
              </Button>
            </div>
            {/* end of form */}
            <div style={{ marginTop: "20px" }}>
              <span
                onClick={showCreateAccount}
                style={{
                  marginLeft: "40px",
                  color: "#5d5e5e",
                  cursor: "pointer",
                }}
              >
                Create account
              </span>
              <span
                onClick={showForgotPassword}
                style={{
                  marginLeft: "31%",
                  color: "#5d5e5e",
                  cursor: "pointer",
                }}
              >
                Forgot Password ?
              </span>
            </div>
            {/* end of options */}

            <div className="login-buttons">
              {/* <Button
                startIcon={<FaFacebookF />}
                style={{
                  backgroundColor: "#4267B2",
                  padding: "10px",
                  color: "white",
                  width: "90%",
                }}
              >
                Login With Facebook
              </Button>
              <br />
              <br />
              <Button
                startIcon={<FaGoogle />}
                style={{
                  backgroundColor: "#5d5e5e",
                  padding: "10px",
                  color: "white",
                  width: "90%",
                }}
              >
                Login With Google
              </Button> */}
              <span className="login-with-facebook">
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  icon="fa-facebook"
                  textButton="Login with Facebook"
                  size="medium"
                  scope="public_profile, email"
                  disableMobileRedirect={true}
                />
              </span>
              <br />

              <span className="login-with-Google">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT}
                  buttonText="Login with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
