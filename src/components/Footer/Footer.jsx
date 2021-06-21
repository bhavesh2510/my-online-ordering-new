import React from "react";
import { useSelector } from "react-redux";
import Logo from "../Footer/zottoLogo.png";

const Footer = () => {
  const menu = useSelector((state) => state.menu);
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
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p style={{ float: "left", fontWeight: "500" }}>
              {business.day_name}
            </p>{" "}
            &nbsp;
            <p style={{ alignContent: "flex-end", float: "right" }}>
              {businessHour}
            </p>
            <br />
          </div>
        );
      })
    );
  }

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
                <a href="about.html">About us</a>
              </li>
              <li>
                <a href="faq.html">Faq</a>
              </li>
              <li>
                <a href="contacts.html">Contacts</a>
              </li>
              <li>
                <a href="#0" data-toggle="modal" data-target="#login_2">
                  Login
                </a>
              </li>
              <li>
                <a href="#0" data-toggle="modal" data-target="#register">
                  Register
                </a>
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
                    <i className="icon-facebook" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-twitter" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-google" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-instagram" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-pinterest" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-vimeo" />
                  </a>
                </li>
                <li>
                  <a href="#0">
                    <i className="icon-youtube-play" />
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
