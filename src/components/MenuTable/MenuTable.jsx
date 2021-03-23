import React from "react";
import { Button } from "react-scroll";

import MenuModal from "../../containers/Modals/MenuModal";

const MenuTable = ({ category_name, list, symbol, actualPrice }) => {
  return (
    <>
      <h3
        className="nomargin_top"
        id={category_name}
        style={{ color: "#5B53CD" }}
      >
        {category_name}
      </h3>
      <p>
        Te ferri iisque aliquando pro, posse nonumes efficiantur in cum.
        Sensibus reprimique eu pro. Fuisset mentitum deleniti sit ea.
      </p>
      <table className="table table-striped cart-list">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          {console.log("list", list)}
          {list.map((item) => {
            return (
              <tr>
                <td>
                  <figure className="thumb_menu_list">
                    <img
                      src={item?.image ?? "https://cutt.ly/gkb8C6Z"}
                      alt="thumb"
                    />
                  </figure>
                  <h5>{item.cname || item.name || item.title}</h5>
                  <p>{item?.description || item.happyHourDisplayText}</p>
                </td>
                <td>
                  <strong>{`${symbol} ${
                    actualPrice ? actualPrice(item) : item?.price
                  }`}</strong>
                </td>
                <td className="options">
                  {item.forced_modifier ? (
                    <MenuModal item={item} />
                  ) : (
                    <>
                      <button
                        style={{
                          background:"#5B53CD",
                          fontSize:"1.3rem",
                          width:"30px",
                          height:"30px",
                          borderRadius: "50%",
                          border: "none",
                          outline: "none",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        onClick={() => console.log("clicked")}
                      >
                        <span style={{ display: "block" }}>+</span>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
    </>
  );
};

export default MenuTable;
