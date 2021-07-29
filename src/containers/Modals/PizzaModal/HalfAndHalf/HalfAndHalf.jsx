import React from "react";
import { Radio } from "antd";
//import './HalfAndHalf.scss';
import { getPizzaActualPrice } from "../../../../state-management/menu/operations";
import "../PizzaModal.css";

//import SizeAndBase from "../SizeAndBase/SizeAndBase";

const HalfAndHalf = ({
  currency,
  pizza,
  halfAndHalfPizzaList,
  restaurantInfo,
  firstHalfId,
  secondHalfId,
  handleHalfAndHalfChange,
}) => {
  const renderHalfAndHalfPizza = () => {
    return (
      <>
        {halfAndHalfPizzaList.map((option) => (
          <div className="details-container" key={option.topping_id}>
            <label style={{ fontWeight: "500" }}>
              <Radio
                checked={firstHalfId === option.topping_id}
                value={`1-${option.topping_id}`}
                onChange={(e) =>
                  handleHalfAndHalfChange(e.target.value, option)
                }
              >
                1st
              </Radio>
              <Radio
                checked={secondHalfId === option.topping_id}
                value={`2-${option.topping_id}`}
                onChange={(e) =>
                  handleHalfAndHalfChange(e.target.value, option)
                }
              >
                2nd
              </Radio>
              {option.topping_name} {currency}{" "}
              {getPizzaActualPrice(pizza, option.topping_price, restaurantInfo)}
            </label>
            <br />
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div
        className="details-container"
        style={{
          borderRadius: "10px",
          padding: "10px",
        }}
        //key={option.topping_id}
      >
        <span style={{ fontSize: "20px", color: "#968EA1" }}>
          Half And Half Choice (Required)
        </span>
        <br />
        <br />
        {renderHalfAndHalfPizza()}
      </div>
    </>
  );
};

export default HalfAndHalf;
