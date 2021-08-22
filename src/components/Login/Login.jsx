import React, { useState, useEffect } from "react";
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
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

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
  fetchUserDetails,
} from "../../state-management/user/asyncActions";
import GoogleLogin from "react-google-login";

const Login = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const [phn, setphn] = useState();
  const [finalphn, setfinalphn] = useState();
  const [gotophnmodal, setgotophnmodal] = useState(false);
  const [getUpdateCreds, setgetUpdateCreds] = useState();
  const [LoginParametersInPhone, setLoginParametersInPhone] = useState();
  const [showerror, setshowerror] = useState(true);

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

  const toggle = () => setModal(!modal);
  var checkphnfornormalemail = "";
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
      checkphnfornormalemail = payload.data.mobile;
      console.log("payload of normal mail", payload);

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
      console.log("phn for normal email", checkphnfornormalemail);
      if (!checkphnfornormalemail) {
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

  useEffect(() => {
    console.log("state in menu", state);
  }, [state]);

  const goToPhoneNumber = () => {
    setfinalphn(phn);

    if (phn == "") {
      setshowerror(true);
    } else {
      const creds = {
        client_id: getUpdateCreds.client_id,
        merchant_id: getUpdateCreds.merchant_id,
        phone: phn,
      };

      dispatch(updateProfile(creds));

      dispatch(setUserLoggedIn(LoginParametersInPhone));

      notification.open({
        message: "Login Successfull",
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
      });

      setgotophnmodal(false);

      console.log("final creds are", LoginParametersInPhone);
    }
  };

  const getPhoneNumber = () => {};

  var checkphno = "";

  const getPhoneNumberFinal = (e) => {
    setphn(e.target.value);
    if (e.target.value.length < 5) {
      setshowerror(true);
    } else if (e.target.value.length >= 5) {
      setshowerror(false);
    }
  };

  useEffect(() => {
    console.log("final phone is", finalphn);
  }, [finalphn]);

  const responseFacebook = async (res) => {
    if (res.status !== undefined && res.status === "unknown") {
      return;
    }

    // setState({
    //   socialLoginId: res.userID,
    //   socialType: "facebook",
    //   profileImage: res.picture.data.url,
    //   email: res.email,
    //   firstName: res.name.split(" ")[0],
    //   lastName: res.name.split(" ")[1],
    //   showLoader: true,
    // });
    const newState = {
      socialLoginId: res.userID,
      socialType: "facebook",
      profileImage: res.picture.data.url,
      email: res.email,
      firstName: res.name.split(" ")[0],
      lastName: res.name.split(" ")[1],
      showLoader: true,
    };
    // First check if this user exist in database
    const { payload } = await dispatch(postSocialLoginForm(newState));

    if (payload.success) {
      // payload.data.mobile ? alert("Please enter Mobile Number") : alert("Mobile number is present")
      //   // user logged In
      //  setState({
      //     clientId: payload.data.client_id,
      //     token: payload.token,
      //     showLoader: false,
      //     firstName: payload.data.firstname,
      //     lastName: payload.data.lastname,
      //     mobile: payload.data.mobile,
      //   });
      const newStateAgain = {
        socialLoginId: res.userID,
        socialType: "facebook",
        profileImage: res.picture.data.url,
        email: res.email,
        firstName: res.name.split(" ")[0],
        lastName: res.name.split(" ")[1],
        showLoader: true,
        clientId: payload.data.client_id,
        token: payload.token,
        showLoader: false,
        firstName: payload.data.firstname,
        lastName: payload.data.lastname,
        mobile: payload.data.mobile,
      };
      checkphno = payload.data.mobile;
      // this.props.fetchUserDetails(payload.data.client_id);
      //check if mobile exists in db after
      if (!newStateAgain.mobile) {
        setgotophnmodal(true);

        setgetUpdateCreds({
          ...getUpdateCreds,
          client_id: payload.data.client_id,
          merchant_id: menu.restaurantInfo.merchant_key,
        });

        setLoginParametersInPhone({
          ...LoginParametersInPhone,
          socialLoginId: res.profileObj.googleId,
          socialType: "google",
          profileImage: res.profileObj.imageUrl,
          email: res.profileObj.email,
          firstName: res.profileObj.givenName,
          lastName: res.profileObj.familyName,
          showLoader: true,
          clientId: payload.data.client_id,
          token: payload.token,
          mobile: phn,
          showLoader: false,
        });
      } else {
        dispatch(setUserLoggedIn(newStateAgain));
        dispatch(fetchUserDetails(payload.data.client_id));
      }
    } else {
      // create an account
      const { payload } = await dispatch(postSocialRegisterForm(newState));

      if (payload.success) {
        // this.setState({
        //   clientId: payload.data.client_id,
        //   token: payload.token,
        //   showLoader: false,
        // });
        const newStateAgain2 = {
          clientId: payload.data.client_id,
          token: payload.token,
          showLoader: false,
        };
        if (!checkphno) {
          setgotophnmodal(true);

          setgetUpdateCreds({
            ...getUpdateCreds,
            client_id: payload.data.client_id,
            merchant_id: menu.restaurantInfo.merchant_key,
          });

          setLoginParametersInPhone({
            ...LoginParametersInPhone,
            socialLoginId: res.profileObj.googleId,
            socialType: "google",
            profileImage: res.profileObj.imageUrl,
            email: res.profileObj.email,
            firstName: res.profileObj.givenName,
            lastName: res.profileObj.familyName,
            showLoader: true,
            clientId: payload.data.client_id,
            token: payload.token,
            mobile: phn,
            showLoader: false,
          });
          //setState({ mobile: phoneNumber });
        }
        dispatch(setUserLoggedIn(newStateAgain2));
      } else {
        // some error has occured
        return;
      }
    }
  };

  //google
  var checkphnforgoogle = "";
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
      checkphnforgoogle = payload.data.mobile;
      setState(newStateAgain);

      //ask phn no
      console.log("phn of google", checkphnforgoogle);

      if (!newStateAgain.mobile) {
        setgotophnmodal(true);

        setgetUpdateCreds({
          ...getUpdateCreds,
          client_id: payload.data.client_id,
          merchant_id: menu.restaurantInfo.merchant_key,
        });

        setLoginParametersInPhone({
          ...LoginParametersInPhone,
          socialLoginId: res.profileObj.googleId,
          socialType: "google",
          profileImage: res.profileObj.imageUrl,
          email: res.profileObj.email,
          firstName: res.profileObj.givenName,
          lastName: res.profileObj.familyName,
          showLoader: true,
          clientId: payload.data.client_id,
          token: payload.token,
          mobile: phn,
          showLoader: false,
        });

        // dispatch(hideLoginFormMethod());
        // const {
        //   payload: { success, message },
        // } = await dispatch(updateProfile(updateCred));
        // console.log("UPDATE_PROFILE", payload);
        // if (success) {
        //   alert("Phonenumber Added succesfully");
        // } else {
        //   alert("Some Error has occured! please check My Profile");
        // }
        //dispatch(setUserLoggedIn(newStateAgain));
      } else {
        dispatch(setUserLoggedIn(newStateAgain));
        notification.open({
          message: "Login Successfull",
          style: {
            marginTop: "50px",
            color: "rgba(0, 0, 0, 0.65)",
            border: "1px solid #b7eb8f",
            backgroundColor: "#f6ffed",
          },
        });
      } //newState
    } else {
      // create an account

      // const reisterState = {
      //   firstname:res.profileObj.givenName,
      //   lastname: res.profileObj.familyName,
      //   password: register.password,
      //   email: res.profileObj.email,
      //
      //   timezone: register.timezone,
      //   usertype: "INDIVIDUAL",
      //   promotional_newsletter: "0",
      // };
      alert("in else");
      const { payload } = await dispatch(postSocialRegisterForm(newState)); //state
      if (payload.success) {
        const newStateAgain2 = {
          clientId: payload.data.client_id,
          token: payload.token,
          showLoader: false,
        };
        setState(newStateAgain2);
        if (!checkphnforgoogle) {
          // const phoneNumber = getPhoneNumber();

          // console.log("MERCHANT", menu.restaurantInfo.merchant_key);
          // const updateCred = {
          //   client_id: payload.data.client_id,
          //   merchant_id: menu.restaurantInfo.merchant_key,
          //   phone: phoneNumber,
          // };
          // const resp2 = await dispatch(updateProfile(updateCred));
          // const {
          //   payload: { success, message },
          // } = await resp2;
          // console.log("UPDATE_PROFILE", payload);
          // if (success) {
          //   alert("Phonenumber Added succesfully");
          // } else {dispatch(setUserLoggedIn(newStateAgain2)); //state
          //   alert("Some Error has occured! please check My Profile");
          // }

          setgotophnmodal(true);

          setgetUpdateCreds({
            ...getUpdateCreds,
            client_id: payload.data.client_id,
            merchant_id: menu.restaurantInfo.merchant_key,
          });

          setLoginParametersInPhone({
            ...LoginParametersInPhone,
            socialLoginId: res.profileObj.googleId,
            socialType: "google",
            profileImage: res.profileObj.imageUrl,
            email: res.profileObj.email,
            firstName: res.profileObj.givenName,
            lastName: res.profileObj.familyName,
            showLoader: true,
            clientId: payload.data.client_id,
            token: payload.token,
            mobile: phn,
            showLoader: false,
          });
        } else {
          dispatch(setUserLoggedIn(newStateAgain2));
        }
        //this.props.setUserLoggedIn(this.state);
        //state
      } else {
        // some error has occured
      }
    }
  };

  return (
    <>
      {gotophnmodal ? (
        <Modal
          isOpen={true}
          // toggle={toggle}
          style={{ top: "15%", left: "1%", width: "35%", borderRadius: "20px" }}
        >
          <ModalHeader style={{ borderBottom: "none" }}>
            {" "}
            <p
              style={{
                fontSize: "20px",
                marginLeft: "30px",
                whiteSpace: "nowrap",
              }}
            >
              Enter Phone number to proceed
            </p>
          </ModalHeader>
          <ModalBody
            style={{
              maxHeight: "400px",

              marginTop: "-15px",
            }}
          >
            <div style={{ marginLeft: "30px" }}>
              <TextField
                type='number'
                size='small'
                name='phonenumber'
                placeholder='Enter your phone number '
                value={phn}
                onChange={getPhoneNumberFinal}
                style={{ width: "90%" }}
                // label="Email"
                variant='outlined'
              />

              <br />
              <br />
              <Button
                onClick={goToPhoneNumber}
                className={showerror ? "disabled" : ""}
                style={{
                  backgroundColor: "#302f31",
                  padding: "10px",
                  color: "white",
                  width: "90%",
                }}
              >
                Submit
              </Button>
            </div>
          </ModalBody>
        </Modal>
      ) : null}
      <div id='parent' className='modal-container'>
        <div className='align-container-center'>
          {user.waitingOverlay ? (
            <>
              {/* <Loader /> */}
              <WaitingOverlay />
            </>
          ) : null}
          <div className='login-box'>
            <div className='close'>
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
            <div className='header' style={{ marginLeft: "40%" }}>
              <strong style={{ color: "#5d5e5e", fontSize: "20px" }}>
                LOGIN
              </strong>
            </div>
            {/* end of header */}
            <div className='login-form'>
              <TextField
                name='email'
                placeholder='Email'
                value={state.email}
                onChange={onEmailChange}
                style={{ width: "90%", height: "-50px" }}
                // label="Email"
                variant='outlined'
              />
              <br /> <br />
              <TextField
                name='password'
                placeholder='password'
                type='password'
                value={state.password}
                onChange={onEmailChange}
                style={{ width: "90%" }}
                //label="Password"
                variant='outlined'
              />
              <br /> <br />
              <Button
                onClick={onFormSubmit}
                style={{
                  backgroundColor: "#302f31",
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

            <div className='login-buttons'>
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
              <span className='login-with-facebook'>
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  fields='name,email,picture'
                  callback={responseFacebook}
                  icon='fa-facebook'
                  textButton='Login with Facebook'
                  size='medium'
                  scope='public_profile, email'
                  disableMobileRedirect={true}
                />
              </span>
              <br />

              <span className='login-with-Google'>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT}
                  buttonText='Login with Google'
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
