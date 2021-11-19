import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Logo from "./zottoLogo.png"
import FacebookIcon from "./facebook@3x.png"
import TwitterIcon from "./twitter@3x.png"
import InstagramIcon from "./ig@3x.png"
import {
  setUserLoggedOut,
  showLoginFormMethod,
  showRegisterFormMethod
} from "../../state-management/user/actions"

import "./Footer.css"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import { Facebook, Instagram, Phone, Twitter } from "@material-ui/icons"

const Footer = () => {
  const menu = useSelector((state) => state.menu)
  const dispatch = useDispatch()
  var d = new Date()
  var n = d.getFullYear()

  function renderBusinessHours() {
    return (
      menu.restaurantInfo.business_hours &&
      menu.restaurantInfo.business_hours.map((business, i) => {
        const businessFromSplit = business.from.split(":")
        const businessToSplit = business.to.split(":")

        const businessFrom = `${businessFromSplit[0]}:${businessFromSplit[1]}`
        const businessTo = `${businessToSplit[0]}:${businessToSplit[1]}`

        let businessHour = `${businessFrom} - ${businessTo}`

        if (businessHour === "00:00 - 00:00") {
          businessHour = "Closed"
        }

        return (
          <>
            <div className='main-footer-container'>
              <div className='footer-parent' style={{ marginLeft: "90px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#302F31",
                    letterSpacing: "0.07em",
                    color: "#968EA1",
                    lineHeight: "2"
                  }}
                >
                  {business.day_name}
                </div>
              </div>

              <div className='footer-parent' style={{ marginRight: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#968EA1",
                    lineHeight: "2"
                  }}
                >
                  {businessHour}
                </div>
              </div>
            </div>
          </>
        )
      })
    )
  }

  const showLogin = () => {
    dispatch(showLoginFormMethod())
  }

  const showRegister = () => {
    dispatch(showRegisterFormMethod())
  }

  return (
    <footer style={{ background: "#F3F2F7" }}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <p
              style={{
                letterSpacing: "0.15em",
                color: "#666171",
                fontWeight: "700",
                fontSize: "16px"
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
                    // color: "#666171"
                    color: "#968EA1"
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
                    color: "#968EA1"
                    // color: "#666171"
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
                    color: "#968EA1",
                    // color: "#666171",
                    whiteSpace: "nowrap"
                  }}
                  href='#0'
                >
                  Terms and conditions
                </a>
              </li>
            </ul>
            <p
              style={{
                fontSize: "16px",
                color: "#666171",
                // color: "#302F31",
                fontWeight: "700",
                whiteSpace: "nowrap",
                marginTop: "40px"
              }}
            >
              POWERED BY
            </p>

            <img
              className='logo-measurements'
              //src={Logo}
              src='https://zotto.io/wp-content/uploads/2020/09/logo.png'
              alt='zotto-Logo'
              style={{ marginTop: "0px" }}
            />
          </div>
          <div className='col-md-4 margin-for-mobile margin-left-for-iphoneplus'>
            <p
              className='margin-for-ul-footer margin-top-for-ul-footer set-margin-zero-from-left margin-for-iphoneplus-pixel'
              style={{
                letterSpacing: "0.15em",
                color: "#666171",
                // color: "#302F31",
                fontWeight: "700",
                fontSize: "16px"
                // marginLeft: "50px"
              }}
            >
              ADDRESS
            </p>

            <ul className='margin-for-ul-footer'>
              <li>
                <a
                  className='margin-left-in-anchor'
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#968EA1",
                    // marginLeft: "-27px",
                    whiteSpace: "nowrap"
                    // color: "#666171"
                  }}
                  // onClick={showLogin}
                >
                  <LocationOnIcon /> {menu.restaurantInfo.address}{" "}
                  {menu.restaurantInfo.city}
                </a>
                <br />
                <a
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#968EA1"
                    // color: "#666171"
                  }}
                >
                  {menu.restaurantInfo.country} {menu.restaurantInfo.zipcode}
                </a>
              </li>
            </ul>

            <ul style={{ marginTop: "10px" }}>
              <p
                className='margin-for-ul-footer margin-top-for-ul-footer set-margin-zero-from-left'
                style={{
                  letterSpacing: "0.15em",
                  color: "#666171",
                  // color: "#302F31",
                  fontWeight: "700",
                  fontSize: "16px"
                  // marginLeft: "50px"
                }}
              >
                CONTACT
              </p>
              <li className='margin-for-ul-footer'>
                <a
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    letterSpacing: "0.07em",
                    color: "#968EA1"
                  }}
                >
                  <Phone style={{ marginLeft: "-20px" }} />{" "}
                  {menu.restaurantInfo.phone} &nbsp; &nbsp;
                </a>
              </li>
              <li>
                <div className='hide-on-footer-phone'>
                  <img
                    src={FacebookIcon}
                    style={{ height: "35px", width: "35px" }}
                  />
                  <img
                    src={TwitterIcon}
                    style={{ height: "35px", width: "35px" }}
                  />
                  <img
                    src={InstagramIcon}
                    style={{ height: "35px", width: "35px" }}
                  />
                </div>
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
                textAlign: "center"
              }}
            >
              BUSINESS HOURS
            </p>
            {renderBusinessHours()}
          </div>
        </div>
        {/* End row */}
        <div className='row hide-on-desktop'>
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
  )
}

export default Footer
