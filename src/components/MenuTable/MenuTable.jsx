import React, { useEffect, useState } from "react"
import { Button } from "react-scroll"
//import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux"
import { openModal, closeModal } from "../../state-management/modal/actions"
import MenuModal from "../../containers/Modals/DishModal/DishModal"
import { addItem, removeItem } from "../../state-management/menu/actions"
import DemoFoodImage from "./demo-food.png"
import {
  isHappyHourStillActive,
  setTimer
} from "../../state-management/menu/utils"
import DishModal from "../../containers/Modals/DishModal/DishModal"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import { getTaxes } from "../../state-management/menu/operations"
import AddIcon from "@material-ui/icons/Add"
import "./MenuTable.css"
import Skeleton from "react-loading-skeleton"
import { modalNames } from "../../components/AppModal/constants"
import RemoveIcon from "@material-ui/icons/Remove"
import img1 from "./388@2x.png"
import img2 from "./387@2x.png"
import img3 from "./389@2x.png"
import img4 from "./391@2x.png"
import img5 from "./390@2x.png"

const MenuTable = ({
  onAddItem,
  onRemoveItem,
  category_name,
  list,
  symbol,
  actualPrice,
  description,
  loading,
  headerforhappyhour
}) => {
  const dispatch = useDispatch()
  const menu = useSelector((state) => state.menu)
  const modal = useSelector((state) => state.modal)
  console.log("header for happy", category_name)

  console.log("listr in menutable", list)
  if (list.length > 1) {
    console.log("cnane in menutable", list[0].category_id)
  }
  const modalNames = {
    DISH_MODAL: "DishModal",
    INTERMEDIATE_ADD_MODAL: "IntermediateAddModal",
    PIZZA_MODAL: "PizzaModal"
  }

  var refIndex = -1
  var timeOutRef = Array.from({ length: 1000 }, () => React.createRef())

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
    )
    return Number(menu.restaurantInfo["price_without_tax_flag"])
  }

  const getSelectedCategoryName = (cname) => {
    console.log("cname in menu", cname)
    var selectedCategoryId
    if (cname.length > 0) {
      selectedCategoryId = cname[0].category_id
    }
    if (menu.categoriesList.length) {
      const category = menu.categoriesList.find(
        (category) =>
          category["sub_category"] &&
          category["sub_category"].find(
            ({ category_id: cId }) => cId === selectedCategoryId
          )
      )
      const subCategory =
        category &&
        category["sub_category"] &&
        category["sub_category"].find(
          ({ category_id: cId }) => cId === selectedCategoryId
        )

      return subCategory ? subCategory.cname : ""
    }

    if (menu.selectedCategoryId === -1) {
      return "Happy Hours"
    } else if (menu.selectedCategoryId === -2) {
      return "Pizza's"
    }
  }

  function getDishesDescription(cname) {
    var selectedCategoryId
    if (cname.length > 0) {
      selectedCategoryId = cname[0].category_id
    }
    if (menu.categoriesList) {
      const category = menu.categoriesList.find(
        (category) =>
          category["sub_category"] &&
          category["sub_category"].find(
            ({ category_id: cId }) => cId === selectedCategoryId
          )
      )
      console.log("category", category)
      const subCategory =
        category &&
        category["sub_category"] &&
        category["sub_category"].find(
          ({ category_id: cId }) => cId === selectedCategoryId
        )
      console.log("subcategory is", subCategory)
      // cname = subCategory ? subCategory.cname : "";
      return subCategory ? subCategory.description : ""
    }
  }

  const getActualPrice = (item) => {
    if (menu.restaurantInfo) {
      // console.log("actual price", typeof(this.isPriceWithoutTax()));
      return isPriceWithoutTax()
        ? item.price
        : (
            Number(item.price) +
            Number(getTaxes(item, item.price, menu.restaurantInfo).tax)
          ).toFixed(2)
    }

    return 0
  }

  const getSizeAndBase = (pizza) => {
    const sizeAndBaseCollection = []

    for (let i = 0; i < (pizza.size && pizza.size.length); i++) {
      const sizeBaseObj = {
        name: pizza.size[i].pizza_size,
        baseId: null,
        basePrice: 0,
        sizeId: pizza.size[i].pizza_size_id,
        sizePrice: getPizzaActualPrice(pizza, pizza.size[i].price),
        totalPrice: getPizzaActualPrice(pizza, pizza.size[i].price)
      }

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
            totalPrice: getPizzaActualPrice(pizza, pizza.size[i].price)
          }

          sizeBaseObj.name += ` ${pizza.base[j].base_name}`
          sizeBaseObj.baseId = pizza.base[j].base_id
          const basePrice = pizza.base[j].base_price.find(
            (item) => item.base_size === pizza.size[i].pizza_size
          )

          sizeBaseObj.basePrice = getPizzaActualPrice(
            pizza,
            basePrice === undefined ? 0 : basePrice.base_price
          )
          sizeBaseObj.totalPrice =
            Number(sizeBaseObj.totalPrice) + Number(sizeBaseObj.basePrice)
          sizeAndBaseCollection.push(sizeBaseObj)
        }
      } else {
        sizeAndBaseCollection.push(sizeBaseObj)
      }
    }
    sizeAndBaseCollection.sort((a, b) => a.totalPrice - b.totalPrice)

    return sizeAndBaseCollection
  }

  const getPizzaActualPrice = (pizza, price) => {
    return isPriceWithoutTax()
      ? Number(price).toFixed(2)
      : (
          Number(price) +
          Number(getTaxes(pizza, Number(price), menu.restaurantInfo).tax)
        ).toFixed(2)
  }

  const openPizzaModal = (pizza, baseId, sizeId) => {
    // open Pizza modal having default topppings
    // and half and half
    console.log("pizza qty is", pizza)
    if (pizza.qty) {
      dispatch(
        openModal(modalNames.INTERMEDIATE_ADD_MODAL, {
          item: pizza,
          baseId,
          sizeId
        })
      )
    } else {
      dispatch(
        openModal(modalNames.PIZZA_MODAL, {
          pizza,
          baseId,
          sizeId
        })
      )
    }
  }

  const myFunction = (id) => {
    var dots = document.getElementById(`${id}dots`)
    var moreText = document.getElementById(`${id}more`)
    var btnText = document.getElementById(`${id}myBtn`)

    dots.style.display = "none"
    moreText.style.display = "inline"
    btnText.style.display = "none"
  }

  const removefromcart = (item) => {
    dispatch(removeItem(item, item.modifiers || null, 0, menu.restaurantInfo))
  }

  return (
    <>
      {loading ? (
        <>
          <>
            {/* <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} />
            <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
            <Skeleton height={28} width={300} style={{ marginLeft: "20%" }} />
            <Skeleton height={28} width={400} style={{ marginLeft: "10%" }} /> */}

            <Skeleton className='skelton-class' />
            <Skeleton className='skelton-class-mid' />
            <Skeleton className='skelton-class-mid' />
            <Skeleton className='skelton-class' />
          </>
        </>
      ) : (
        <>
          {/* <div className="category-separator"></div> */}
          <div
            id={getSelectedCategoryName(list)}
            // style={{ border: "1px solid black", marginTop: "-10px" }}
          >
            <h4
              className='category-name-head text-pizzamodal'
              style={{ letterSpacing: "0.1em" }}
            >
              {category_name == "Happy Hours"
                ? "Happy Hours"
                : getSelectedCategoryName(list)}
            </h4>
            <>
              {list.map((item) => {
                const sizeAndBaseCollection = getSizeAndBase(item)
                const isImageUrl = require("is-image-url")
                var checkImageUrl = isImageUrl(item.image_url)
                console.log("npm url is", checkImageUrl)
                let isStillActive = false
                console.log("menuItems in this file", item)

                if (item.isHappyHourActive) {
                  const result = isHappyHourStillActive(
                    item,
                    menu.restaurantInfo.timezone
                  )

                  isStillActive = result.isActive
                  if (isStillActive) {
                    refIndex++
                    setTimer(result.distance, timeOutRef[refIndex])
                  }
                }
                const minQty =
                  Number(item.min_qty) === 0 ? 0 : Number(item.min_qty)

                console.log("itemszzz in menutable", item)
                return (
                  <>
                    <div>
                      <div className='parent-menutable'>
                        <div className='parent-flex'>
                          <div className='left-menutable-img'>
                            <div className='img-cover-menutable'>
                              <img
                                className='food-image'
                                src={
                                  checkImageUrl ? item.image_url : DemoFoodImage
                                }
                              ></img>
                            </div>
                          </div>

                          <div className='food-details'>
                            <div className='inner-food-details-div'>
                              <div className='specific-food-details'>
                                <h4 className='food-item-name'>
                                  {item.cname || item.name || item.title}
                                </h4>

                                <div className='food-icons'>
                                  <div className='food-icon-child'>
                                    {item.lactose_free === "1" ? (
                                      <span title='Lactose Free'>
                                        <img
                                          className='properties-img'
                                          alt='lactose free'
                                          src={img1}
                                        />
                                      </span>
                                    ) : null}
                                    {item.nuts_free === "1" ? (
                                      <span
                                        title='Nuts Free'
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <img
                                          className='properties-img'
                                          alt='nuts free'
                                          src={img3}
                                        />
                                      </span>
                                    ) : null}
                                    {item.is_hot === "1" ? (
                                      <span
                                        title='Hot'
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <img
                                          className='properties-img'
                                          alt='hot'
                                          src={img4}
                                        />
                                      </span>
                                    ) : null}
                                    {item.is_vegan === "1" ? (
                                      <span
                                        title="It's Vegan"
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <img
                                          className='properties-img'
                                          alt="it's vegan"
                                          src={img5}
                                        />
                                      </span>
                                    ) : null}
                                    {item.gluten_free === "1" ? (
                                      <span
                                        title='Gluten Free'
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <img
                                          className='properties-img'
                                          alt='gluten free'
                                          src={img2}
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                </div>

                                {item.description ? (
                                  <>
                                    <p className='food-description'>
                                      {item.description.slice(0, 50)}
                                      <span id={`${item.id}dots`}>...</span>
                                      <span
                                        id={`${item.id}myBtn`}
                                        className='read-more'
                                        onClick={() => myFunction(item.id)}
                                      >
                                        read more
                                      </span>
                                      <p
                                        className='food-description'
                                        id={`${item.id}more`}
                                        style={{ display: "none" }}
                                      >
                                        {item.description.slice(51, 10000)}
                                      </p>
                                    </p>
                                  </>
                                ) : null}

                                <div className='item-price-parent-div'>
                                  <span className='item-price'>{`${symbol} ${getActualPrice(
                                    item
                                  )}`}</span>
                                </div>
                              </div>

                              {/* {item.base ? (
                              <>
                                <div className="specific-add-button">
                                  <div
                                    className="button-container"
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
                                    <span className="add-to-cart-button">
                                      Add
                                    </span>
                                    <span className="add-to-cart-button-plus">
                                      <AddIcon />
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="specific-add-button">
                                <div
                                  className="button-container"
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
                                  <span className="add-to-cart-button">
                                    Add
                                  </span>
                                  <span className="add-to-cart-button-plus">
                                    <AddIcon />
                                  </span>
                                </div>
                              </div>
                            )} */}
                              {item.qty ? (
                                <>
                                  <div className='after-first-add-container'>
                                    <div className='after-first-add-parent'>
                                      <div className='after-first-add-child'>
                                        <div
                                          className='left-after-add'
                                          onClick={() => removefromcart(item)}
                                        >
                                          <RemoveIcon fontSize='small' />
                                        </div>
                                        <div className='middle-after-add'>
                                          <span className='qty-after-add'>
                                            {item.qty}
                                          </span>
                                        </div>
                                        {item.base ? (
                                          <>
                                            <div
                                              className='right-after-add'
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
                                              <AddIcon fontSize='small' />
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div
                                              className='right-after-add'
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
                                              <AddIcon fontSize='small' />
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className='specific-add-button'>
                                    {item.base ? (
                                      <>
                                        <div
                                          className='button-container'
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
                                          <span className='add-to-cart-button'>
                                            Add
                                          </span>
                                          <span className='add-to-cart-button-plus'>
                                            <AddIcon />
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className='button-container'
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
                                          <span className='add-to-cart-button'>
                                            Add
                                          </span>
                                          <span className='add-to-cart-button-plus'>
                                            <AddIcon />
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            {item.isHappyHourActive && isStillActive ? (
                              <>
                                <p
                                  className='food-description'
                                  style={{
                                    color: "#bd1e44",
                                    fontWeight: "600"
                                  }}
                                >
                                  {item.happyHourDetail.happyHourDisplayText}
                                </p>
                                <p className='food-description'>
                                  {/* <AccessTimeIcon style={{ color: "red" }} />{" "} */}

                                  <span
                                    style={{
                                      color: "#bd1e44",
                                      fontWeight: "700"
                                    }}
                                    ref={timeOutRef[refIndex]}
                                  />
                                </p>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className='hr-for-mobile' />
                  </>
                )
              })}
            </>
          </div>
        </>
      )}
    </>
  )
}

export default MenuTable
