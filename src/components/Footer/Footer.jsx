import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./zottoLogo.png";
import FacebookIcon from "./facebook@3x.png";
import TwitterIcon from "./twitter@3x.png";
import InstagramIcon from "./ig@3x.png";
import {
  setUserLoggedOut,
  showLoginFormMethod,
  showRegisterFormMethod,
} from "../../state-management/user/actions";

import "./Footer.css";

const Footer = () => {
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  var d = new Date();
  var n = d.getFullYear();

  function renderBusinessHours() {
    return (
      menu.restaurantInfo.business_hours &&
      menu.restaurantInfo.business_hours.map((business, i) => {
        const businessFromSplit = business.from.split(":");
        const businessToSplit = business.to.split(":");

        const businessFrom = `${businessFromSplit[0]}:${businessFromSplit[1]}`;
        const businessTo = `${businessToSplit[0]}:${businessToSplit[1]}`;

        let businessHour = `${businessFrom} - ${businessTo}`;

        if (businessHour === "00:00 - 00:00") {
          businessHour = "Closed";
        }

        return (
          <>
            <div className='main-footer-container'>
              <div className='footer-parent'>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#302F31",
                    letterSpacing: "0.07em",
                    color: "#666171",
                    lineHeight: "2",
                  }}
                >
                  {business.day_name}
                </div>
              </div>

              <div className='footer-parent' style={{ marginRight: "140px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#666171",
                    lineHeight: "2",
                  }}
                >
                  {businessHour}
                </div>
              </div>
            </div>
          </>
        );
      })
    );
  }

  const showLogin = () => {
    dispatch(showLoginFormMethod());
  };

  const showRegister = () => {
    dispatch(showRegisterFormMethod());
  };

  return (
    <footer>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <p
              style={{
                fontSize: "16px",
                color: "#302F31",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              Secure payments with
            </p>

            <img
              className='logo-measurements'
              //src={Logo}
              src='https://zotto.io/wp-content/uploads/2020/09/logo.png'
              alt='zotto-Logo'
              style={{ marginTop: "10px" }}
            />
          </div>
          <div className='col-md-4 margin-for-mobile margin-left-for-iphoneplus'>
            <p
              style={{
                letterSpacing: "0.15em",
                color: "#302F31",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              ABOUT
            </p>
            <ul>
              <li>
                <a
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#666171",
                  }}
                  onClick={showLogin}
                >
                  Login
                </a>
              </li>

              <li style={{ marginTop: "10px" }}>
                <a
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#666171",
                  }}
                  onClick={showRegister}
                >
                  Register
                </a>
              </li>

              <li style={{ marginTop: "10px" }}>
                <a
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#666171",
                    whiteSpace: "nowrap",
                  }}
                  href='#0'
                >
                  Terms and conditions
                </a>
              </li>
            </ul>
          </div>
          <div className='col-md-4 margin-for-mobile'>
            <p
              style={{
                letterSpacing: "0.15em",
                color: "#302F31",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              BUSINESS HOURS
            </p>
            {renderBusinessHours()}
          </div>
        </div>
        {/* End row */}
        <div className='row'>
          <div className='col-md-12'>
            <div id='social_footer'>
              <ul>
                <li>
                  <a href='#0'>
                    <img
                      src={FacebookIcon}
                      style={{ height: "35px", width: "35px" }}
                    />
                  </a>
                </li>

                <li>
                  <a href='#0'>
                    <img
                      src={TwitterIcon}
                      style={{ height: "35px", width: "35px" }}
                    />
                  </a>
                </li>
                <li>
                  <a href='#0'>
                    <img
                      src={InstagramIcon}
                      style={{ height: "35px", width: "35px" }}
                    />
                  </a>
                </li>
              </ul>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>© zotto {n}</p>
            </div>
          </div>
        </div>
        {/* End row */}
      </div>
      {/* End container */}
    </footer>
  );
};

export default Footer;
