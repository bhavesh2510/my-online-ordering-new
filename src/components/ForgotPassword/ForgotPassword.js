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
import {
  postForgotPasswordForm,
  postPasswordUpdate,
} from "../../state-management/user/asyncActions";
import { showLoginFormMethod } from "../../state-management/user/actions";
import { hideForgotPasswordFormMethod } from "../../state-management/user/actions";
import { setSelectedCategoryId } from "../../state-management/menu/actions";
import WaitingOverlay from "../../components/WaitingOverlay/WaitingOverlay";
import Loader from "../../components/Loader/Loader";

const ForgotPassword = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [data, setdata] = useState({
    email: "",
    otp: "",
    password: "",
    submittingClass: "",
    submitText: "SUBMIT",
    errorMessage: false,
    requestSucess: null,
    successMessage: "Please enter OTP send over your email!",
    showLoader: false,
    isOtpRequested: false,
    isPasswordUpdateSucess: false,
  });

  const onEmailChange = (value) => {
    setdata({ ...data, email: value });
  };

  const onPasswordChange = (value) => {
    setdata({ ...data, password: value });
  };

  const onOtpChange = (value) => {
    setdata({ ...data, otp: value });
  };

  const onFormSubmit = async () => {
    setdata({
      ...data,
      submitText: "Please Wait...",
      submittingClass: "submitting",
      errorMessage: false,
      requestSucess: null,
      showLoader: true,
    });
    const response = await dispatch(postForgotPasswordForm(data.email));
    const { payload } = await response;

    setdata({
      ...data,
      submitText: "SUBMIT",
      submittingClass: "",
      errorMessage: payload.message,
      requestSucess: payload.success,
      showLoader: false,
      isOtpRequested: !!payload.success,
    });
  };

  const onConfirmPasswordSubmit = async () => {
    setdata({
      ...data,
      submitText: "Please Wait...",
      submittingClass: "submitting",
      errorMessage: false,
      requestSucess: null,
      showLoader: true,
    });

    const dataToSend = {
      email: data.email,
      password: data.password,
      otp: data.otp,
    };
    console.log(dataToSend);

    const response = await dispatch(postPasswordUpdate(dataToSend));

    const { payload } = await response;

    setdata({
      ...data,
      submitText: "SUBMIT",
      submittingClass: "",
      errorMessage: payload.message,
      successMessage: payload.message,
      requestSucess: payload.success,
      showLoader: false,
      isPasswordUpdateSucess: payload.success,
    });
  };

  const closeLoginModal = () => {
    dispatch(hideForgotPasswordFormMethod());
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
            {data.isOtpRequested && !data.isPasswordUpdateSucess ? (
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
                    Forgot Password
                  </strong>
                </div>

                <div
                  className="login-form"
                  style={{ marginLeft: "40px", marginTop: "50px" }}
                >
                  <TextField
                    value={data.email}
                    name="email"
                    style={{ width: "90%" }}
                    placeholder="Enter Email"
                    onChange={(e) => onEmailChange(e.target.value)}
                    //label="TextField"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                    disabled
                  />

                  <br />
                  <br />
                  <TextField
                    type="number"
                    name="otp"
                    style={{ width: "90%" }}
                    placeholder="Enter OTP"
                    onChange={(e) => onOtpChange(e.target.value)}
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
                    //size="small"
                    name="password"
                    style={{ width: "90%" }}
                    placeholder="Enter New Password"
                    onChange={(e) => onPasswordChange(e.target.value)}
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
                  <br />
                  <Button
                    onClick={onConfirmPasswordSubmit}
                    style={{
                      backgroundColor: "#6244da",
                      padding: "10px",
                      color: "white",
                      width: "90%",
                    }}
                  >
                    Submit
                  </Button>
                  <p>{data.errorMessage}</p>
                </div>
              </>
            ) : null}
            {!data.isOtpRequested && !data.isPasswordUpdateSucess ? (
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
                    Forgot Password
                  </strong>
                </div>
                {/* end of header */}
                <div
                  className="login-form"
                  style={{ marginLeft: "40px", marginTop: "100px" }}
                >
                  <TextField
                    //size="small"
                    name="email"
                    value={data.email}
                    style={{ width: "90%" }}
                    placeholder="Enter Email"
                    onChange={(e) => onEmailChange(e.target.value)}
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
                  <br />
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
                  <br />
                  <br />
                  <p>{data.errorMessage}</p>
                </div>
              </>
            ) : null}

            {data.isOtpRequested && data.isPasswordUpdateSucess ? (
              <>
                <img
                  style={{ marginLeft: "30%" }}
                  src="https://i.ibb.co/TmCnRTh/Tick-Mark-Dark-512.png"
                  height="200px"
                  width="150px"
                />
                <h1 style={{ marginTop: "5%", marginLeft: "35%" }}>Great !</h1>
                <br />
                <p style={{ fontSize: "15px", marginLeft: "25%" }}>
                  Your Password is Changed
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
            ) : null}

            {/* end of form */}
            {/* <div style={{ marginTop: "10px" }}>
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
            </div> */}

            {/* end of options */}
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
