import React from "react";
import "./LoadingBar.css";

const LoadingBar = () => {
  return (
    <div id='preloader'>
      {/* <div class="sk-spinner sk-spinner-wave" id="status"> */}
      {/* <div class="sk-rect1"></div>
        <div class="sk-rect2"></div>
        <div class="sk-rect3"></div>
        <div class="sk-rect4"></div>
        <div class="sk-rect5"></div> */}
      {/* <h2 className="loader-heading-class ">
        Best Memories Are Made Around The Table
      </h2> */}
      <div class='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    // </div>
  );
};

export default LoadingBar;
