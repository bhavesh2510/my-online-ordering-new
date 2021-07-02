import React, { useState } from "react";
import { Button } from "react-scroll";
//import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../state-management/modal/actions";
import MenuModal from "../../containers/Modals/DishModal/DishModal";
import { addItem } from "../../state-management/menu/actions";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";
import DishModal from "../../containers/Modals/DishModal/DishModal";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { getTaxes } from "../../state-management/menu/operations";
import AddIcon from "@material-ui/icons/Add";
import "./MenuTable.css";
import Skeleton from "react-loading-skeleton";
import { modalNames } from "../../components/AppModal/constants";

const MenuTable = ({
  onAddItem,
  onRemoveItem,
  category_name,
  list,
  symbol,
  actualPrice,
  description,
  loading,
}) => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const modal = useSelector((state) => state.modal);

  console.log("listr in menutable", list);
  const modalNames = {
    DISH_MODAL: "DishModal",
    INTERMEDIATE_ADD_MODAL: "IntermediateAddModal",
    PIZZA_MODAL: "PizzaModal",
  };

  var refIndex = -1;
  var timeOutRef = Array.from({ length: 1000 }, () => React.createRef());

  // const addToCart = (item, isHappyHoursActive) => {
  //   const menuItems = menu.menuItems;
  //   const itemsinmenu = menuItems.find(({ id }) => item.id === id);
  //   console.log("items at the time of add", itemsinmenu);

  //   if (item.optional_modifier !== "0" || item.forced_modifier !== "0") {
  //     if (itemsinmenu.qty) {
  //       dispatch(
  //         openModal(modalNames.INTERMEDIATE_ADD_MODAL, {
  //           item: {
  //             ...item,
  //             isHappyHoursActive,
  //           },
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         openModal(modalNames.DISH_MODAL, {
  //           item: {
  //             ...item,
  //             isHappyHoursActive,
  //           },
  //         })
  //       );
  //     }

  //     return;
  //   }

  //   //this.props.addItem(item, null, 0, this.props.restaurantInfo);

  //   dispatch(addItem(item, item.modifiers || null, 0, menu.restaurantInfo));
  // };

  const isPriceWithoutTax = () => {
    console.log(
      "price without tax",
      menu.restaurantInfo["price_without_tax_flag"]
    );
    return Number(menu.restaurantInfo["price_without_tax_flag"]);
  };

  const getActualPrice = (item) => {
    if (menu.restaurantInfo) {
      // console.log("actual price", typeof(this.isPriceWithoutTax()));
      return isPriceWithoutTax()
        ? item.price
        : (
            Number(item.price) +
            Number(getTaxes(item, item.price, menu.restaurantInfo).tax)
          ).toFixed(2);
    }

    return 0;
  };

  const getSizeAndBase = (pizza) => {
    const sizeAndBaseCollection = [];

    for (let i = 0; i < (pizza.size && pizza.size.length); i++) {
      const sizeBaseObj = {
        name: pizza.size[i].pizza_size,
        baseId: null,
        basePrice: 0,
        sizeId: pizza.size[i].pizza_size_id,
        sizePrice: getPizzaActualPrice(pizza, pizza.size[i].price),
        totalPrice: getPizzaActualPrice(pizza, pizza.size[i].price),
      };

      // get the base price with base_size
      if (
        pizza.base !== undefined &&
        pizza.base !== null &&
        pizza.base !== "0" &&
        pizza.base !== 0
      ) {
        for (let j = 0; j < pizza.base.length; j++) {
          const sizeBaseObj = {
            name: pizza.size[i].pizza_size,
            basePrice: 0,
            baseId: null,
            sizeId: pizza.size[i].pizza_size_id,
            sizePrice: getPizzaActualPrice(pizza, pizza.size[i].price),
            totalPrice: getPizzaActualPrice(pizza, pizza.size[i].price),
          };

          sizeBaseObj.name += ` ${pizza.base[j].base_name}`;
          sizeBaseObj.baseId = pizza.base[j].base_id;
          const basePrice = pizza.base[j].base_price.find(
            (item) => item.base_size === pizza.size[i].pizza_size
          );

          sizeBaseObj.basePrice = getPizzaActualPrice(
            pizza,
            basePrice === undefined ? 0 : basePrice.base_price
          );
          sizeBaseObj.totalPrice =
            Number(sizeBaseObj.totalPrice) + Number(sizeBaseObj.basePrice);
          sizeAndBaseCollection.push(sizeBaseObj);
        }
      } else {
        sizeAndBaseCollection.push(sizeBaseObj);
      }
    }
    sizeAndBaseCollection.sort((a, b) => a.totalPrice - b.totalPrice);

    return sizeAndBaseCollection;
  };

  const getPizzaActualPrice = (pizza, price) => {
    return isPriceWithoutTax()
      ? Number(price).toFixed(2)
      : (
          Number(price) +
          Number(getTaxes(pizza, Number(price), menu.restaurantInfo).tax)
        ).toFixed(2);
  };

  const openPizzaModal = (pizza, baseId, sizeId) => {
    // open Pizza modal having default topppings
    // and half and half
    console.log("pizza qty is", pizza);
    if (pizza.qty) {
      dispatch(
        openModal(modalNames.INTERMEDIATE_ADD_MODAL, {
          item: pizza,
          baseId,
          sizeId,
        })
      );
    } else {
      dispatch(
        openModal(modalNames.PIZZA_MODAL, {
          pizza,
          baseId,
          sizeId,
        })
      );
    }
  };

  return (
    <>
      {loading ? (
        <>
          <>
            <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} />
            <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
            <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
            <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} />
          </>
        </>
      ) : (
        <>
          <h3
            className="nomargin_top"
            id={category_name}
            style={{ color: "#5B53CD" }}
          >
            {category_name}
          </h3>
          <p>{description}</p>
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
                const sizeAndBaseCollection = getSizeAndBase(item);
                let isStillActive = false;
                console.log("menuItems in this file", item);

                if (item.isHappyHourActive) {
                  const result = isHappyHourStillActive(
                    item,
                    menu.restaurantInfo.timezone
                  );

                  isStillActive = result.isActive;
                  if (isStillActive) {
                    refIndex++;
                    setTimer(result.distance, timeOutRef[refIndex]);
                  }
                }
                const minQty =
                  Number(item.min_qty) === 0 ? 0 : Number(item.min_qty);

                console.log("items in menutable", item);
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
                      <section className="extra-info">
                        {item.lactose_free === "1" ? (
                          <span title="Lactose Free">
                            <img
                              className="properties-img"
                              alt="lactose free"
                              src="https://i.ibb.co/JsCzXxm/lactose.png"
                            />
                          </span>
                        ) : null}
                        {item.nuts_free === "1" ? (
                          <span title="Nuts Free">
                            <img
                              className="properties-img"
                              alt="nuts free"
                              src="https://ciboapp.com/feedmi/static/media/nuts_free.6df579b7.png"
                            />
                          </span>
                        ) : null}
                        {item.is_hot === "1" ? (
                          <span title="Hot">
                            <img
                              className="properties-img"
                              alt="hot"
                              src="https://ciboapp.com/feedmi/static/media/hot.9360d00d.png"
                            />
                          </span>
                        ) : null}
                        {item.is_vegan === "1" ? (
                          <span title="It's Vegan">
                            <img
                              className="properties-img"
                              alt="it's vegan"
                              src="https://i.ibb.co/xHDRm3s/vegan.png"
                            />
                          </span>
                        ) : null}
                        {item.gluten_free === "1" ? (
                          <span title="Gluten Free">
                            <img
                              className="properties-img"
                              alt="gluten free"
                              src="https://i.ibb.co/23JCVwx/glute.png"
                            />
                          </span>
                        ) : null}
                      </section>
                      <br />
                      {/* <p>happ hour start</p> */}

                      {item.isHappyHourActive && isStillActive ? (
                        <>
                          <p style={{ color: "red", fontWeight: "700" }}>
                            {item.happyHourDetail.happyHourDisplayText}
                          </p>
                          <div>
                            <AccessTimeIcon style={{ color: "red" }} /> &nbsp;{" "}
                            <span
                              style={{ color: "red", fontWeight: "700" }}
                              ref={timeOutRef[refIndex]}
                            />
                          </div>
                        </>
                      ) : null}

                      {/* <p>happ hour end</p> */}
                      <p>{item?.description || item.happyHourDisplayText}</p>
                    </td>

                    {item.base ? (
                      <td>
                        <strong> {sizeAndBaseCollection[0].totalPrice}</strong>
                      </td>
                    ) : (
                      <td>
                        <strong>{`${symbol} ${getActualPrice(item)}`}</strong>
                      </td>
                    )}

                    <td className="options">
                      <>
                        {item.base ? (
                          <>
                            <div style={{ display: "flex" }}>
                              <button
                                className="button-menutable"
                                onClick={() =>
                                  openPizzaModal(
                                    item,
                                    isHappyHourStillActive(
                                      item,
                                      menu.restaurantInfo.timezone
                                    ).isActive
                                  )
                                }
                              >
                                {/* <span style={{ display: "block" }}>+</span> */}
                                <AddIcon
                                  fontSize="small"
                                  style={{ marginTop: "4px" }}
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: "flex" }}>
                            <button
                              className="button-menutable"
                              onClick={() =>
                                onAddItem(
                                  item,
                                  isHappyHourStillActive(
                                    item,
                                    menu.restaurantInfo.timezone
                                  ).isActive
                                )
                              }
                            >
                              {/* <span style={{ display: "block" }}>+</span> */}
                              <AddIcon
                                fontSize="small"
                                style={{ marginTop: "4px" }}
                              />
                            </button>
                          </div>
                        )}
                        {/* <button
                        className="button-menutable"
                        style={{ marginLeft: "20px" }}
                        onClick={() =>
                          onRemoveItem(
                            item,
                            isHappyHourStillActive(
                              item,
                              menu.restaurantInfo.timezone
                            ).isActive
                          )
                        }
                      >
                        <span style={{ display: "block" }}>-</span>
                      </button> */}
                        {/* </div> */}
                      </>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr />
        </>
      )}
    </>
  );
};

export default MenuTable;
