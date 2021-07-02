import React, { useEffect, useState } from "react";
// import "./RestaurantCard.scss";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, Redirect, Route } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <>
      <a
        className="strip_list"
        href={`${`?/restId=${restaurant.restaurant_id}/menu`}`}
      >
        <div className="ribbon_1">Popular</div>
        <div className="desc">
          <div className="thumb_strip">
            <img src={restaurant.logo} alt />
          </div>
          {console.log(restaurant)}
          <div className="rating">
            <i className="icon_star voted" />
            <i className="icon_star voted" />
            <i className="icon_star voted" />
            <i className="icon_star voted" />
            <i className="icon_star" />
          </div>
          <h3>{restaurant.rname}</h3>
          <div className="type">{restaurant.description}</div>
          <div className="location">
            {restaurant.address} {restaurant.city}
            {restaurant.zipcode}
            <br />
            <span className="opening">Opens at </span>
          </div>
          <ul>
            {restaurant?.order_option?.split(",").map((option, i) => {
              return (
                <li key={i} style={{ textTransform: "capitalize" }}>
                  {option} &nbsp;
                  <CheckCircleOutlineIcon
                    style={{ color: "green" }}
                    fontSize="small"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </a>

      {/* End desc*/}
    </>
  );
};

export default RestaurantCard;

// <a
//   href={`${`?/restId=${restaurant.restaurant_id}/menu`}`}
//   className="strip_list"
// >
