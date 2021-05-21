import { Table } from "reactstrap";

import "../../components/MyProfile/MyProfile.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  postMyProfileForm,
  postProfile,
} from "../../state-management/user/asyncActions";
import { notification } from "antd";
import WaitingOverlay from "../../components/WaitingOverlay/WaitingOverlay";
import AppHeader from "../AppHeader/AppHeader";
import Footer from "../Footer/Footer";

const MyProfile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    ...user,
    btn: "update",
    loader: false,
  });

  // useEffect(() => {
  //   if (user) {
  //     setState({ ...user, btn: "Update" });
  //   }
  // }, [user]);

  const handleFirstName = (val) => {
    setState({ ...state, firstName: val });
  };
  const handleLastName = (val) => {
    setState({ ...state, lastName: val });
  };
  const handleEmail = (val) => {
    setState({ ...state, email: val });
  };
  const handleAddress = (val) => {
    setState({ ...state, address: val });
  };
  const handleCity = (val) => {
    setState({ ...state, city: val });
  };
  const handleState = (val) => {
    setState({ ...state, state: val });
  };
  const handleCountry = (val) => {
    setState({ ...state, country: val });
  };
  const handleZipcode = (val) => {
    setState({ ...state, zipcode: val });
  };
  const handlePhoneNumber = (val) => {
    setState({ ...state, mobile: val });
  };

  const postProfileChange = async () => {
    console.log("cleint id", user.clientId);

    const response = await dispatch(postMyProfileForm(user.clientId));
    const { payload } = await response;
    console.log("usefferct", payload);
    if (payload.success) {
      const data = payload.data;

      setState({
        ...state,
        ...data,
      });
    }
  };

  useEffect(() => {
    postProfileChange();
  }, []);
  const formSubmit = async () => {
    setState({ ...state, btn: "updating...", loader: true });

    const {
      firstName,
      lastName,
      address,
      mobile,
      state: locationState,
      country,
      city,
      zipcode,
      phonecode,
    } = state;

    const userAgain = {
      client_id: user.clientId,
      firstname: firstName,
      lastname: lastName,
      address,
      mobile,
      state: locationState,
      country,
      city,
      zipcode,
      phonecode,
    };

    const response = dispatch(postProfile(userAgain, user.token));
    const { payload } = await response;

    notification.open({
      message: payload.message,
      style: {
        marginTop: "50px",
        color: "rgba(0, 0, 0, 0.65)",
        border: "1px solid #b7eb8f",
        backgroundColor: "#f6ffed",
      },
    });
    setState({ ...state, btn: "update", loader: false });
  };
  return (
    <>
      {state.loader ? <WaitingOverlay /> : null}
      {/* <AppHeader /> */}
      {/* <section
        className="parallax-window_myprofile "
        data-parallax="scroll"
        // data-image-src="https://cutt.ly/Kkb7BY9"
        style={{
          background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
          backgroundSize: "cover",
        }}
        data-natural-width={1400}
        data-natural-height={470}
      >
        <div id="subheader_myprofile">
          <div id="sub_content">
            <h1>Update Profile</h1>
          </div>
        </div>
      </section> */}
      <div
        className="col-lg-6"
        style={{ marginTop: "20px", marginLeft: "25%" }}
      >
        <div className="box_style_2" id="main_menu">
          <div
            style={{
              height: "auto",
              width: "400px",
            }}
          >
            <div style={{ marginLeft: "20%" }}>
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="First Name"
                variant="outlined"
                value={state.firstName}
                onChange={(e) => handleFirstName(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="Last Name"
                variant="outlined"
                value={state.lastName}
                onChange={(e) => handleLastName(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%", backgroundColor: "#f1f1f1" }}
                label="Email"
                variant="outlined"
                value={state.email}
                disabled
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="Address"
                variant="outlined"
                value={state.address}
                onChange={(e) => handleAddress(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="City"
                variant="outlined"
                value={state.city}
                onChange={(e) => handleCity(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="State"
                variant="outlined"
                value={state.state}
                onChange={(e) => handleState(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="Country"
                variant="outlined"
                value={state.country}
                onChange={(e) => handleCountry(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="Zipcode"
                variant="outlined"
                value={state.zipcode}
                onChange={(e) => handleZipcode(e.target.value)}
              />
              <br />
              <br />
              <TextField
                size="small"
                style={{ width: "120%" }}
                label="Phone number"
                variant="outlined"
                value={state.mobile}
                onChange={(e) => handlePhoneNumber(e.target.value)}
              />
              <br />
              <br />
              <Button
                onClick={formSubmit}
                style={{
                  backgroundColor: "#6244da",
                  width: "120%",
                  color: "white",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                {state.btn}
              </Button>
            </div>
          </div>
        </div>
        {/* End box_style_1 */}
      </div>
      {/* <Footer /> */}
    </>
  );
};
export default MyProfile;
