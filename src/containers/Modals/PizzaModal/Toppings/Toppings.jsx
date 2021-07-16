import React from "react";
import { Checkbox } from "antd";
//import './Toppings.scss';
import { getPizzaActualPrice } from "../../../../state-management/menu/operations";
import "../PizzaModal.css";

const Toppings = React.memo(
  ({
    toppingsList: { defaultToppings, optionalToppings },
    currency,
    handleDefaultToppingsChange,
    handleOptionalToppingsChange,
    selectedDefaultToppings,
    pizza,
    restaurantInfo,
  }) => {
    console.log("op array", optionalToppings);
    function renderDefaultToppings() {
      return (
        <div
          className="toppings-container"
          style={{
            marginTop: "20px",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            border: "1px solid #f1f1f1",
            borderRadius: "10px",
          }}
        >
          <img
            src="https://i.ibb.co/YcBnL1C/pizza-slice.png"
            height="40px"
            width="80px"
            style={{ float: "right" }}
          />{" "}
          <br />
          <span
            className="text-pizzamodal"
            style={{
              marginTop: "-10px",
              fontSize: "20px",
              textTransform: "uppercase",
            }}
          >
            {" "}
            Free Toppings{" "}
          </span>
          <br />
          <br />
          {defaultToppings.map((option) => (
            <div className="details-container" key={option.topping_id}>
              <label className="label">
                <Checkbox
                  checked={selectedDefaultToppings.some(
                    (top) => option.topping_id === top.topping_id
                  )}
                  onChange={({ target: { checked } }) =>
                    handleDefaultToppingsChange(checked, option)
                  }
                >
                  {option.topping_name}
                </Checkbox>
              </label>
              <span style={{ float: "right" }} className={"modifier-amount"}>
                Free
              </span>
            </div>
          ))}
        </div>
      );
    }

    function renderOptionalToppings() {
      return (
        <div
          className="toppings-container"
          style={{
            marginTop: "20px",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            border: "1px solid #f1f1f1",
            borderRadius: "10px",
          }}
        >
          <img
            src="https://i.ibb.co/YcBnL1C/pizza-slice.png"
            height="40px"
            width="80px"
            style={{ float: "right" }}
          />{" "}
          <br />
          <span
            className="text-pizzamodal"
            style={{ marginTop: "380px", fontSize: "20px" }}
          >
            {" "}
            Optional Toppings{" "}
          </span>
          <br />
          <br />
          {optionalToppings.map((option) => (
            <div className="details-container" key={option.topping_id}>
              <label className="label">
                <Checkbox
                  onChange={({ target: { checked } }) =>
                    handleOptionalToppingsChange(checked, option)
                  }
                >
                  {option.topping_name}
                </Checkbox>
              </label>
              <span style={{ float: "right" }} className={"modifier-amount"}>
                {currency}{" "}
                {getPizzaActualPrice(
                  pizza,
                  option.topping_price,
                  restaurantInfo
                )}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="toppings-options">
        {renderDefaultToppings()}
        {renderOptionalToppings()}
      </div>
    );
  }
);

export default Toppings;
