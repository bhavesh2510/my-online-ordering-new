import React from "react";
import Logo from "../Footer/zottoLogo.png";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h3>Secure payments with</h3>

            <img
              src={Logo}
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
          <div className="col-md-2"></div>
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
              <p>© Quick Food 2020</p>
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
