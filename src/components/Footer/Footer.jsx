import React from 'react'

const Footer = () => {
    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h3>Secure payments with</h3>
              <p>
                <img src="img/cards.png" className="img-fluid" />
              </p>
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
              <h3>Settings</h3>
              <div className="styled-select">
                <select name="lang" id="lang">
                  <option value="English" selected>
                    English
                  </option>
                  <option value="French">Norweigien</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Russian">German</option>
                </select>
              </div>
              <div className="styled-select">
                <select name="currency" id="currency">
                  <option value="USD" selected>
                    USD
                  </option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="RUB">KR</option>
                </select>
              </div>
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
                <p>© Quick Food 2020</p>
              </div>
            </div>
          </div>
          {/* End row */}
        </div>
        {/* End container */}
      </footer>
    );
}

export default Footer
