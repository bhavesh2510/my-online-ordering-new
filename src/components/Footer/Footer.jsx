import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Logo from "../Footer/zottoLogo.png";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import {
  setUserLoggedOut,
  showLoginFormMethod,
  showRegisterFormMethod,
} from "../../state-management/user/actions";

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
          <div
            className="footer-business-info"
            // style={{
            //   display: "flex",
            //   flexDirection: "row",
            // }}
          >
            <p
              className="footer-business-day"
              //style={{ float: "left", fontWeight: "500" }}
            >
              {business.day_name}
            </p>{" "}
            &nbsp;
            <p
              className="footer-business-hour"
              //style={{ alignContent: "flex-end", float: "right" }}
            >
              {businessHour}
            </p>
            <br />
          </div>
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
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h3>Secure payments with</h3>

            <img
              src="https://www.zotto.io/wp-content/uploads/2020/09/logo.png"
              alt="zotto-Logo"
              style={{ marginTop: "10px" }}
              height="50px"
              width="150px"
            />
          </div>
          <div className="col-md-4">
            <h3>About</h3>
            <ul>
              <li>
                <a onClick={showLogin}>Login</a>
              </li>
              <li>
                <a onClick={showRegister}>Register</a>
              </li>
              <li>
                <a href="#0">Terms and conditions</a>
              </li>
            </ul>
          </div>
          <div className="col-md-2">
            <h3>Business Hours</h3>
            {renderBusinessHours()}
          </div>
        </div>
        {/* End row */}
        <div className="row">
          <div className="col-md-12">
            <div id="social_footer">
              <ul>
                <li>
                  <a href="#0">
                    <FacebookIcon />
                  </a>
                </li>

                <li>
                  <a href="#0">
                    <TwitterIcon />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <InstagramIcon />
                  </a>
                </li>
              </ul>
              <p>© zotto {n}</p>
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
