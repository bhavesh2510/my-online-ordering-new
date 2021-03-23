import React from "react";
// import "./RestaurantCard.scss";

const RestaurantCard = ({ restaurant }) => {
  return (
    <a
      href={`${`${process.env.REACT_APP_PUBLIC_URL}restId=${restaurant.restaurant_id}/menu`}`}
      className="strip_list"
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
          <span className="opening">Opens at 17:00</span>
        </div>
        <ul>
          {restaurant?.order_option?.split(",").map((option, i) => {
            return (
              <li key={i} style={{ textTransform: "capitalize" }}>
                {option}
                <i className="icon_check_alt2 ok" />
              </li>
            );
          })}
        </ul>
      </div>
      {/* End desc*/}
    </a>
  );
};

export default RestaurantCard;
