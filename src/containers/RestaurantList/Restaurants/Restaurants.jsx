import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import Slider from "../../../components/Slider/Slider";

import RestaurantCard from "./RestaurantCard/RestaurantCard";
// import './Restaurants.scss'

const Restaurants = ({ restaurants }) => {
  // useEffect(() => {
  //   let slider = document.getElementById("layerslider");
  //   slider.layerSlider({
  //     autoStart: true,
  //     responsive: true,
  //     responsiveUnder: 1280,
  //     layersContainer: 1170,
  //     navButtons:false,
  //     showCircleTimer:false,
  //     navStartStop:false,
  //     // skinsPath: require('../../../assets/layerslider/skins')
  //     // Please make sure that you didn't forget to add a comma to the line endings
  //     // except the last line!
  // });
  // }, []);

  return (
    <>
      {/* <Slider/> */}
      <div className="white_bg">
        <div className="container margin_60">
          <div className="main_title">
            <h2 className="nomargin_top">Choose from Most Popular</h2>
            <p>Your Favourite Restaurants</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {restaurants.map((restaurant) => {
              return <RestaurantCard restaurant={restaurant} />;
            })}
            {/* End strip_list*/}
          </div>

          {/* End row */}
        </div>
        {/* End container */}
      </div>
    </>
  );
};

export default Restaurants;
