import React, { useEffect, useState } from "react";
import "./RestaurantCard.css";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, Redirect, Route } from "react-router-dom";
import { NavigateBeforeSharp } from "@material-ui/icons";

const RestaurantCard = ({ restaurant }) => {
  // var x = restaurant.order_option((ele) => ele == "xyz");

  const [order, setorder] = useState([]);
  var arr = [];

  {
    restaurant?.order_option?.split(",").map((option, i) => {
      order.push(option);
    });
  }

  useEffect(() => {
    console.log("array is", order);
  }, [order]);

  return (
    <>
      <a
        className="hover-cat"
        href={`${`?/restId=${restaurant.restaurant_id}/menu`}`}
      >
        <div style={{ marginTop: "20px", marginLeft: "15px" }}>
          <div className="restro-card-container">
            <div className="desc">
              <div
                className="thumb_strip"
                style={{
                  marginTop: "20px",
                  borderRadius: "15px",
                }}
              >
                <img src={restaurant.logo} alt />
              </div>
              <p className="restro-card-rname">{restaurant.rname}</p>

              <div className="location restro-card-location">
                {restaurant.address} {restaurant.city}
                {restaurant.zipcode}
              </div>
              <div style={{ fontWeight: "700", color: "#6244da" }}>
                Opens at
              </div>

              <div className="rest-card-info">
                {restaurant?.order_option?.split(",").map((option, i) => {
                  if (option == "delivery") {
                    return (
                      <>
                        <div className="rest-card-info-child">Delivery</div>
                      </>
                    );
                  }
                })}
                {/* <div className="rest-card-info-child">Delivery</div> */}
                &nbsp; &nbsp;
                {restaurant?.order_option?.split(",").map((option, i) => {
                  if (option == "pickup") {
                    return (
                      <>
                        <div className="rest-card-info-child-pickup">
                          pickup
                        </div>
                      </>
                    );
                  }
                })}
              </div>

              <div className="rest-card-info">
                {restaurant?.order_option?.split(",").map((option, i) => {
                  if (option == "eatin") {
                    return (
                      <>
                        <div className="rest-card-info-child-eatin">Eat-In</div>
                        &nbsp; &nbsp;
                      </>
                    );
                  }
                })}

                {/* <div
                  className="rest-card-info-child-opensat"
                  style={{ paddingTop: "0px" }}
                >
                  Opens at 11
                  <p style={{ marginTop: "-10px" }}> pm</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>{" "}
      </a>
      {/* &nbsp; &nbsp; */}
    </>
  );
};

export default RestaurantCard;

// <a
//   href={`${`?/restId=${restaurant.restaurant_id}/menu`}`}
//   className="strip_list"
// >
