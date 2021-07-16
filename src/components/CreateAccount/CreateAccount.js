import React, { useState } from "react";
import "../Login/login.css";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import { showLoginFormMethod } from "../../state-management/user/actions";
import { hideRegisterFormMethod } from "../../state-management/user/actions";
import { postRegisterForm } from "../../state-management/user/asyncActions";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { notification } from "antd";
import WaitingOverlay from "../WaitingOverlay/WaitingOverlay";
const CreateAccount = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    zipcode: "",
    mobile: "",
    timezone: "Asia/Kolkata",
    submittingClass: "",
    submitText: "SUBMIT",
    errorMessage: false,
    requestSuccess: null,
    successMessage: "Your account has been successfully created.",
    showLoader: false,
    countryCode: "",
    showloginscreen: false,
  });

  const onEmailChange = (value) => {
    setState({ ...state, email: value });
  };

  const onFirstNameChange = (value) => {
    setState({ ...state, firstName: value });
  };

  const onLastNameChange = (value) => {
    setState({ ...state, lastName: value });
  };

  const onPasswordChange = (value) => {
    setState({ ...state, password: value });
  };

  const onMobileChange = (value) => {
    setState({ ...state, mobile: value });
  };

  function ValidateEmail() {
    var mailformat =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (state.email.match(mailformat)) {
      onSubmit();
    } else {
      setState({ ...state, errorMessage: "Please Enter Valid Email" });
    }
  }

  const onSubmit = async () => {
    setState({
      ...state,
      submitText: "Please Wait...",
      errorMessage: false,
      submittingClass: "submitting",
      showLoader: true,
    });

    const resp = await dispatch(postRegisterForm(state));
    const { payload } = await resp;

    if (payload.message) {
      setState({
        ...state,
        submitText: "SUBMIT",
        submittingClass: "",
        errorMessage: payload.message,
        requestSucess: payload.success,
        showLoader: false,
        showloginscreen: false,
      });
    } else {
      setState({
        ...state,
        submitText: "SUBMIT",
        submittingClass: "",
        errorMessage: payload.message,
        requestSucess: payload.success,
        showLoader: false,
        showloginscreen: true,
      });
    }

    //dispatch(showLoginFormMethod());
  };

  const closeLoginModal = () => {
    dispatch(hideRegisterFormMethod());
  };

  const goBackToLogin = () => {
    dispatch(showLoginFormMethod());
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
            {/* end of header */}

            {state.showloginscreen ? (
              <>
                <img
                  style={{ marginLeft: "30%" }}
                  src="https://i.ibb.co/TmCnRTh/Tick-Mark-Dark-512.png"
                  height="200px"
                  width="150px"
                />
                <h1 style={{ marginTop: "5%", marginLeft: "35%" }}>Great !</h1>
                <br />
                <p style={{ fontSize: "15px", marginLeft: "22%" }}>
                  Your Account is succesfully Created
                </p>

                <Button
                  onClick={() => dispatch(showLoginFormMethod())}
                  style={{
                    marginLeft: "25%",
                    marginTop: "5%",
                    backgroundColor: "#6244da",
                    padding: "10px",
                    color: "white",
                    width: "50%",
                  }}
                >
                  Click To Login
                </Button>
              </>
            ) : (
              <>
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
                <div className="header" style={{ marginLeft: "100px" }}>
                  <strong style={{ color: "#5d5e5e", fontSize: "20px" }}>
                    CREATE ACCOUNT
                  </strong>
                </div>
                <div className="login-form" style={{ marginLeft: "40px" }}>
                  <TextField
                    size="small"
                    value={state.firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    style={{ width: "90%" }}
                    placeholder="First Name"
                    //label="TextField"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <br />
                  <TextField
                    size="small"
                    value={state.lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    style={{ width: "90%" }}
                    placeholder="Last Name"
                    //label="TextField"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <br />
                  <TextField
                    size="small"
                    value={state.email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    style={{ width: "90%" }}
                    placeholder="Email"
                    //label="TextField"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <br />

                  <PhoneInput
                    value={state.mobile}
                    onChange={(e) => onMobileChange(e)}
                    className="resp_tf"
                    country={"dk"}
                    enableSearch={true}
                    name="phn"
                    placeholder="Phone Number"
                  />
                  <br />

                  {/* <TextField
                    size="small"
                    value={state.mobile}
                    onChange={(e) => onMobileChange(e.target.value)}
                    autoComplete="off"
                    style={{ width: "90%" }}
                    placeholder="Mobile Number"
                    //label="TextField"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneAndroidIcon />
                        </InputAdornment>
                      ),
                    }}
                  /> */}

                  <TextField
                    size="small"
                    value={state.password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="off"
                    type="password"
                    style={{ width: "90%" }}
                    placeholder="Password"
                    //label="TextField"
                    variant="outlined"
                  />
                  <br />
                  {/* <br /> */}
                  {!state.requestSuccess ? <p>{state.errorMessage}</p> : null}
                  <Button
                    onClick={ValidateEmail}
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
                <div style={{ marginTop: "10px" }}>
                  <span
                    onClick={goBackToLogin}
                    style={{
                      marginLeft: "40px",
                      color: "#5d5e5e",
                      cursor: "pointer",
                    }}
                  >
                    Go back/Sign In
                  </span>
                </div>
              </>
            )}

            {/* end of form */}

            {/* end of options */}
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateAccount;
