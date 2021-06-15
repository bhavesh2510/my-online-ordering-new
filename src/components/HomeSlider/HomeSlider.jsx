import React, { Component } from "react";
import Slider from "react-slick";

export default class HomeSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          <section
            className="parallax-window"
            data-parallax="scroll"
            // data-image-src="https://cutt.ly/Kkb7BY9"
            style={{
              background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
              backgroundSize: "cover",
            }}
            data-natural-width={1400}
            data-natural-height={470}
          >
            {/* <button
              style={{ zIndex: "1000" }}
              onClick={scrollToTop}
              style={buttonStyle}
            >
              Scroll to Top
            </button> */}
            <div id="subheader">
              <div id="sub_content">
                {/* <div id="thumb">
              <img src={props.restaurantInfo.logo} alt />
            </div> */}

                {/* <h1>{props.restaurantInfo.rname}</h1> */}
                <div>{/* <em>{props.restaurantInfo.description}</em> */}</div>
                <div>
                  <i className="icon_pin" />{" "}
                  {/* {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}`}{" "}
                  <strong>Delivery charge:</strong> free over{" "}
                  {props.restaurantInfo?.monetary_symbol}- */}
                  {/* {props.restaurantInfo.cost.free_delivery_eligible_amount}. */}
                </div>
              </div>
              {/* End sub_content */}
            </div>
            {/* End subheader */}
          </section>

          <section
            className="parallax-window"
            data-parallax="scroll"
            // data-image-src="https://cutt.ly/Kkb7BY9"
            style={{
              background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
              backgroundSize: "cover",
            }}
            data-natural-width={1400}
            data-natural-height={470}
          >
            {/* <button
              style={{ zIndex: "1000" }}
              onClick={scrollToTop}
              style={buttonStyle}
            >
              Scroll to Top
            </button> */}
            <div id="subheader">
              <div id="sub_content">
                {/* <div id="thumb">
              <img src={props.restaurantInfo.logo} alt />
            </div> */}

                {/* <h1>{props.restaurantInfo.rname}</h1> */}
                <div>{/* <em>{props.restaurantInfo.description}</em> */}</div>
                <div>
                  {/* <i className="icon_pin" />{" "}
                  {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}`}{" "}
                  <strong>Delivery charge:</strong> free over{" "}
                  {props.restaurantInfo?.monetary_symbol}- */}
                  {/* {props.restaurantInfo.cost.free_delivery_eligible_amount}. */}
                </div>
              </div>
              {/* End sub_content */}
            </div>
            {/* End subheader */}
          </section>

          <section
            className="parallax-window"
            data-parallax="scroll"
            // data-image-src="https://cutt.ly/Kkb7BY9"
            style={{
              background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
              backgroundSize: "cover",
            }}
            data-natural-width={1400}
            data-natural-height={470}
          >
            {/* <button
              style={{ zIndex: "1000" }}
              onClick={scrollToTop}
              style={buttonStyle}
            >
              Scroll to Top
            </button> */}
            <div id="subheader">
              <div id="sub_content">
                {/* <div id="thumb">
              <img src={props.restaurantInfo.logo} alt />
            </div> */}

                {/* <h1>{props.restaurantInfo.rname}</h1> */}
                <div>{/* <em>{props.restaurantInfo.description}</em> */}</div>
                <div>
                  {/* <i className="icon_pin" />{" "}
                  {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}`}{" "}
                  <strong>Delivery charge:</strong> free over{" "}
                  {props.restaurantInfo?.monetary_symbol}- */}
                  {/* {props.restaurantInfo.cost.free_delivery_eligible_amount}. */}
                </div>
              </div>
              {/* End sub_content */}
            </div>
            {/* End subheader */}
          </section>
        </Slider>
      </div>
    );
  }
}
