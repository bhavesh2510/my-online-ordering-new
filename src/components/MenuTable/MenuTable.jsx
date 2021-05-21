import React, { useState } from "react";
import { Button } from "react-scroll";
//import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../state-management/modal/actions";
import MenuModal from "../../containers/Modals/MenuModal";
import { addItem } from "../../state-management/menu/actions";
import { isHappyHourStillActive } from "../../state-management/menu/utils";

const MenuTable = ({ category_name, list, symbol, actualPrice }) => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const addToCart = (item) => {
    console.log("items at the time of add", item);
    // dispatch(
    //   addItem(item, item.modifiers || null, item.subtotal, menu.restaurantInfo)
    // );
    //console.log("items in cart", item);
    dispatch(addItem(item, item.modifiers || null, 0, menu.restaurantInfo));
  };
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

            {list.forced_modifier > 0 ? (
              <th style={{ display: "none" }}>price</th>
            ) : (
              <th>Price</th>
            )}
            {/* <th>Price</th> */}
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          {console.log("list is", list)}
          {list.map((item) => {
            return (
              <tr>
                <td>
                  <figure className="thumb_menu_list">
                    <img
                      style={{ marginTop: "10px" }}
                      src={item?.image ?? "https://cutt.ly/gkb8C6Z"}
                      alt="thumb"
                    />
                  </figure>
                  <h5 style={{ marginTop: "20px" }}>
                    {item.cname || item.name || item.title}
                  </h5>
                  <p>{item?.description || item.happyHourDisplayText}</p>
                </td>
                {item.forced_modifier > 0 ? (
                  <td>
                    <strong>-</strong>
                  </td>
                ) : (
                  <td>
                    <strong>{`${symbol} ${
                      actualPrice ? actualPrice(item) : item.price
                    }`}</strong>
                  </td>
                )}
                {/* <td>
                  <strong>{`${symbol} ${
                    actualPrice ? actualPrice(item) : item.price
                  }`}</strong>
                </td> */}
                <td className="options">
                  {item.forced_modifier > 0 ? (
                    <MenuModal item={item} />
                  ) : (
                    <>
                      <div style={{ display: "flex" }}>
                        {/* <button
                          style={{
                            background: "#5B53CD",
                            color: "whitesmoke",
                            fontSize: "1.3rem",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            border: "none",
                            outline: "none",
                            display: "flex",
                            justifyContent: "center",
                          }}
                          onClick={() => alert("-")}
                        >
                          <span style={{ display: "block" }}>-</span>
                        </button>
                        <span style={{ padding: "10px" }}>{`${item.qty}`}</span> */}
                        {!item.qty && (
                          <button
                            style={{
                              background: "#5B53CD",
                              color: "whitesmoke",
                              fontSize: "1.3rem",
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              border: "none",
                              outline: "none",
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={() => addToCart(item)}
                          >
                            <span style={{ display: "block" }}>+</span>
                          </button>
                        )}
                        {item.qty ? (
                          <button
                            style={{
                              background: "#5B53CD",
                              color: "whitesmoke",
                              fontSize: "1.3rem",
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              border: "none",
                              outline: "none",
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={() => addToCart(item)}
                          >
                            <span style={{ display: "block" }}>+</span>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
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
