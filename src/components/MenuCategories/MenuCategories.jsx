import React, { useEffect, useState } from "react"
import "./MenuCategories.css"
import { useDispatch, useSelector } from "react-redux"
import {
  setSelectedCategoryId,
  displayHappyHours,
  displayPizzas,
  changechoosencategory
} from "../../state-management/menu/actions"
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll"
import { Link } from "react-scroll"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import { Add, AddIcCallOutlined, PinDropSharp } from "@material-ui/icons"
// import { CloseOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import MenuIcon from "@material-ui/icons/Menu"
import CloseIcon from "@material-ui/icons/Close"
import SimpleBarReact from "simplebar-react"
import "simplebar/src/simplebar.css"

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
//import CloseIcon from "@material-ui/icons/Close";
import {
  Box,
  Drawer,
  ListItem,
  SwipeableDrawer,
  Button
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core"
import Sticky from "react-sticky-el"
import Scrollspy from "react-scrollspy"
import { setActiveLink } from "react-scroll/modules/mixins/scroller"
import scrollIntoView from "scroll-into-view-if-needed"

const useStyle = makeStyles({
  list: {
    width: 200
  }
})

const MenuCategories = React.memo(
  ({ categories, loading, drinkstatus, statusOfDrawer }) => {
    const menu = useSelector((state) => state.menu)
    const dispatch = useDispatch()
    const [dishes, showDishes] = useState(false)
    const [drinks, showDrinks] = useState(false)

    useEffect(() => {
      if (menu.cart.length >= 1) {
        var x = document.getElementById("id-of-menu")
        // var y = document.getElementById("menu-2");
        x.classList.add("bottom-add")
        //y.classList.add("bottom-add");
      }
      //else {
      //   var x = document.getElementById("id-of-menu");
      //   // var y = document.getElementById("id-of-menu-close");
      //   x.style.bottom = "5%";
      //   // y.style.bottom = "5%";
      // }
    }, [menu.cart.length])

    const [displayCategoryInMobile, setDisplayCategoryInMobile] = useState("")
    const [displayHideCategory, setdisplayHideCategory] = useState(false)

    const showCategory = () => {
      // props.showHideOverlay(true);
      if (statusOfDrawer >= 1) {
        setDisplayCategoryInMobile("show-mobile-category-list")
        setdisplayHideCategory(true)
        setdraweropen(true)
      }
    }

    useEffect(() => {
      showCategory()
    }, [statusOfDrawer])

    const hideCategory = () => {
      setDisplayCategoryInMobile("")
      setdisplayHideCategory(false)
      setdraweropen(false)

      // props.showHideOverlay(false);
    }

    const isPizzaAvailable = menu.pizzas.length
    const isHappyHoursActive = isHappyHoursActiveInMenu()
    console.log("loading in menucategories", loading)

    useEffect(() => {
      onDishClick()
      onDrinksClick()
    }, [])

    const onDishClick = () => {
      var x = document.getElementById("hhour")
      var y = document.getElementById("hhour-text")
      if (x) {
        x.style.backgroundColor = "#f1f1f1"
      }
      if (y) {
        y.style.color = "black"
      }

      var a = document.getElementById("pizza-cat")
      var b = document.getElementById("pizza-cat-text")
      if (a) {
        a.style.backgroundColor = "#f1f1f1"
      }
      if (b) {
        b.style.color = "black"
      }
      showDishes(!dishes)
      drinkstatus(true)
      dispatch(displayPizzas())
    }
    const onDrinksClick = () => {
      var x = document.getElementById("hhour")
      var y = document.getElementById("hhour-text")
      if (x) {
        x.style.backgroundColor = "#f1f1f1"
      }
      if (y) {
        y.style.color = "black"
      }

      var a = document.getElementById("pizza-cat")
      var b = document.getElementById("pizza-cat-text")
      if (a) {
        a.style.backgroundColor = "#f1f1f1"
      }
      if (b) {
        b.style.color = "black"
      }
      showDrinks(!drinks)
      drinkstatus(true)

      // dispatch(displayPizzas());
    }
    function isHappyHoursActiveInMenu() {
      return menu.menuItems.some(({ isHappyHourActive }) => isHappyHourActive)
    }

    function showCategoryMobile() {
      // if (menu.cart.length >= 1) {
      //   var x = document.getElementById("id-of-menu")

      //   x.style.bottom = "12%"
      // }
      showCategory()
    }

    function hideCategoryMobile() {
      if (menu.cart.length >= 1) {
        var x = document.getElementById("id-of-menu")

        x.style.bottom = "12%"
      }
      hideCategory()
    }

    const [draweropen, setdraweropen] = useState(false)
    const classes = useStyle()

    return (
      <>
        {/* <Sticky> */}
        <div
          className='box_style_1 hide-on-mobile menu_box'
          id='cart_box'
          style={{ border: "none" }}
          // style={{ position: "sticky", top: "10px" }}
        >
          <ul id='cat_nav'>
            {console.log("categories", categories)}
            {console.log("menu items", menu.menuItems)}

            {/* {categories[0] ? (
            <li
              style={{
                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                height: "40px",
                width: "90%",
              }}
            >
              <Link
                activeClass='active'
                smooth={true}
                spy={true}
                //to="Kebabs"
                //to={dishes ? "" : categories[0]?.cname}
                offset={0}
                onClick={onDishClick}
              >
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "-4px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Dishes <span>({categories[0]?.sub_category.length})</span>
                </p>

                {!dishes ? (
                  <ChevronRightIcon
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    className='show-down'
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                )}
              </Link>
            </li>
          ) : null} */}
            {categories.map((category, i) => {
              return category.cname === categories[0].cname && dishes ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                />
              ) : null
            })}

            {/* {categories[1] ? (
            <li
              style={{
                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                marginTop: "15px",
                height: "40px",
                width: "90%",
              }}
            >
              <Link
                // activeClass='active'
                smooth={true}
                spy={true}
                to={drinks ? "" : categories[1]?.cname}
                offset={-50}
                duration={3000}
                onClick={onDrinksClick}
              >
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "-4px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {categories[1].cname}
                  <span>({categories[1]?.sub_category.length})</span>{" "}
                </p>
                {!drinks ? (
                  <ChevronRightIcon
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    className='show-down'
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                )}
              </Link>
            </li>
          ) : null} */}
            {categories.map((category, i) => {
              return category?.cname === categories[1]?.cname && drinks ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                />
              ) : null
            })}

            {isPizzaAvailable ? (
              <li
                key='pizza'
                id='pizza-cat'
                style={{
                  // cursor: "pointer",
                  // backgroundColor: "#f1f1f1",
                  // borderRadius: "8px",
                  // marginTop: "15px",
                  // height: "40px",
                  // width: "90%",

                  cursor: "pointer",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "8px",
                  marginTop: "15px",
                  height: "45px",
                  // height: "auto",
                  width: "85%",
                  marginLeft: "15px"
                }}
              >
                <Link
                  style={{ textAlign: "center", fontWeight: "700" }}
                  activeClass='selected_cat_id'
                  smooth={true}
                  spy={true}
                  to='Pizza'
                  duration={0}
                  offset={-70}
                  onClick={() => {
                    // var x = document.getElementById("hhour")
                    // var y = document.getElementById("hhour-text")
                    // x.style.backgroundColor = "#f1f1f1"
                    // y.style.color = "black"
                    // var a = document.getElementById("pizza-cat")
                    // var b = document.getElementById("pizza-cat-text")
                    // a.style.backgroundColor = "#6244da"
                    // b.style.color = "white"
                    drinkstatus(true)
                    dispatch(displayPizzas())
                  }}
                >
                  {/* <p
                  id='pizza-cat-text'
                  style={{
                    textAlign: "center",
                    marginTop: "-4px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                > */}
                  {categories[2].cname} <span> ({isPizzaAvailable}) </span>{" "}
                  {/* </p> */}
                  {/* <ChevronRightIcon
                  fontSize='small'
                  style={{ float: "right", marginTop: "-35px" }}
                /> */}
                </Link>
              </li>
            ) : null}

            {/* {menu.isHappyHoursApplicable && isHappyHoursActive ? (
            <li
              id='hhour'
              key='happyHours'
              style={{
                // cursor: "pointer",
                // backgroundColor: "#f1f1f1",
                // borderRadius: "8px",
                // marginTop: "15px",
                // height: "40px",
                // width: "90%",

                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                marginTop: "15px",
                height: "45px",
                // height: "auto",
                width: "85%",
                marginLeft: "15px"
              }}
            >
              <Link
                activeClass='selected_cat_happyhour'
                // style={{ textAlign: "center", fontWeight: "700" }}
                smooth={true}
                spy={true}
                to='Happy Hours'
                offset={0}
                duration={0}
                onClick={() => {
                  // var a = document.getElementById("pizza-cat")
                  // var b = document.getElementById("pizza-cat-text")
                  // a.style.backgroundColor = "#f1f1f1"
                  // b.style.color = "black"
                  // var x = document.getElementById("hhour")
                  // var y = document.getElementById("hhour-text")
                  // x.style.backgroundColor = "#6244da"
                  // y.style.color = "white"
                  // y.style.color = "white"
                  drinkstatus(false)
                  dispatch(displayHappyHours())
                }}
              >
                <p
                  id='hhour-text'
                  style={{
                    textAlign: "center",
                    marginTop: "-4px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                >
                  Happy Hours <span> ({menu?.happyHours?.length}) </span>
                </p>
                
              </Link>
            </li>
          ) : null} */}
          </ul>
        </div>
        {/* </Sticky> */}

        {/* section of mobile start */}

        {/* <SimpleBarReact
        autoHide={true}
        className={`${displayCategoryInMobile} menu-categories-container`}
      >
        {menu.isHappyHoursApplicable && isHappyHoursActive ? (
          <>
            <li
              style={{
                cursor: "pointer",
                listStyleType: "none",
                marginTop: "10px"
              }}
            >
              <Link
                activeClass='active'
                smooth={true}
                spy={true}
                offset={0}
                onClick={onDishClick}
              >
                Dishes <span>({categories[0]?.sub_category.length})</span>
                <ChevronRightIcon
                  fontSize='small'
                  style={{ float: "right" }}
                />{" "}
              </Link>
            </li>
            {categories.map((category, i) => {
              return category.cname === "Dishes" && dishes ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                />
              ) : null
            })}

            <li
              style={{
                cursor: "pointer",
                listStyleType: "none",
                marginTop: "10px"
              }}
            >
              <Link
                activeClass='active'
                smooth={true}
                spy={true}
                to={drinks ? "" : categories[1]?.cname}
                offset={-50}
                duration={3000}
                onClick={onDrinksClick}
              >
                Drinks<span>({categories[1]?.sub_category.length})</span>{" "}
                <ChevronRightIcon fontSize='small' style={{ float: "right" }} />
              </Link>
            </li>
            {categories.map((category, i) => {
              return category.cname === "Drinks" && drinks ? (
                <MenuSubCategory
                  list={category.sub_category}
                  searchQuery={menu.searchQuery}
                  selectedCategoryId={menu.selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  drinkstatus={drinkstatus}
                  hide={() => hideCategory()}
                />
              ) : null
            })}
          </>
        ) : null}
        {isPizzaAvailable ? (
          <li
            key='pizza'
            style={{
              cursor: "pointer",
              listStyleType: "none",
              marginTop: "10px"
            }}
          >
            <Link
              activeClass='active'
              smooth={true}
              spy={true}
              to='Pizza'
              duration={4000}
              offset={-70}
              onClick={() => {
                drinkstatus(true)
                dispatch(displayPizzas())
                hideCategory()
              }}
            >
              Pizza's <span> ({isPizzaAvailable}) </span>{" "}
              <ChevronRightIcon fontSize='small' style={{ float: "right" }} />
            </Link>
          </li>
        ) : null}

        {menu.isHappyHoursApplicable && isHappyHoursActive ? (
          <li
            key='happyHours'
            style={{
              cursor: "pointer",
              listStyle: "none",
              marginTop: "10px"
            }}
          >
            <Link
              activeClass='active'
              smooth={true}
              spy={true}
              to='Happy Hours'
              offset={-50}
              duration={4000}
              onClick={() => {
                drinkstatus(false)
                dispatch(displayHappyHours())
              }}
            >
              Happy hours <span> ({menu?.happyHours?.length}) </span>
              <ChevronRightIcon fontSize='small' style={{ float: "right" }} />
            </Link>
          </li>
        ) : null}
      </SimpleBarReact> */}

        <SwipeableDrawer
          anchor={"left"}
          open={draweropen}
          onClose={() => setdraweropen(false)}
          onOpen={() => {}}
        >
          <div
            className={classes.list}
            style={{
              marginTop: "50px",
              overflowY: "scroll"
            }}
          >
            <ul id='cat_nav'>
              {console.log("categories", categories)}
              {console.log("menu items", menu.menuItems)}

              {/* <li
              style={{
                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                height: "40px",
                width: "85%",
                marginLeft: "15px",
              }}
            >
              <Link
                activeClass='active'
                smooth={true}
                spy={true}
               
                offset={0}
                onClick={onDishClick}
              >
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "-4px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {categories[0].cname} <span>({categories[0]?.sub_category.length})</span>
                </p>

                {!dishes ? (
                  <ChevronRightIcon
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    className='show-down'
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                )}
              </Link>
            </li> */}
              {categories.map((category, i) => {
                return category.cname === "Dishes" && dishes ? (
                  <MenuSubCategory
                    list={category.sub_category}
                    searchQuery={menu.searchQuery}
                    selectedCategoryId={menu.selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    drinkstatus={drinkstatus}
                    hide={() => hideCategory()}
                  />
                ) : null
              })}

              {/* <li
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "8px",
                  marginTop: "15px",
                  height: "40px",
                  width: "72%",
                  marginLeft: "15px"
                }}
              > */}
              {/* <Link
                  activeClass='active'
                  smooth={true}
                  spy={true}
                  to={drinks ? "" : categories[1]?.cname}
                  offset={-50}
                  duration={3000}
                  onClick={onDrinksClick}
                >
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "-4px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}
                  >
                    {categories[1]?.cname}
                    <span>({categories[1]?.sub_category.length})</span>{" "}
                  </p>
                  {!drinks ? (
                    <ChevronRightIcon
                      fontSize='small'
                      style={{ float: "right", marginTop: "-35px" }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      className='show-down'
                      fontSize='small'
                      style={{ float: "right", marginTop: "-35px" }}
                    />
                  )}
                </Link> */}
              {/* </li> */}
              {categories.map((category, i) => {
                return category.cname === categories[1]?.cname && drinks ? (
                  <MenuSubCategory
                    list={category.sub_category}
                    searchQuery={menu.searchQuery}
                    selectedCategoryId={menu.selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    drinkstatus={drinkstatus}
                    hide={() => hideCategory()}
                  />
                ) : null
              })}
              {isPizzaAvailable ? (
                <li
                  key='pizza'
                  id='pizza-cat'
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "8px",
                    marginTop: "15px",
                    height: "50px",
                    width: "85%",
                    marginLeft: "15px"
                  }}
                >
                  <Link
                    activeClass='active'
                    smooth={true}
                    spy={true}
                    to='Pizza'
                    duration={0}
                    offset={-70}
                    onClick={() => {
                      // var x = document.getElementById("hhour")
                      // var y = document.getElementById("hhour-text")
                      // x.style.backgroundColor = "#f1f1f1"
                      // y.style.color = "black"
                      // var a = document.getElementById("pizza-cat")
                      // var b = document.getElementById("pizza-cat-text")
                      // a.style.backgroundColor = "#6244da"
                      // b.style.color = "white"
                      drinkstatus(true)
                      dispatch(displayPizzas())
                      setdraweropen(false)
                    }}
                  >
                    <p
                      id='pizza-cat-text'
                      style={{
                        textAlign: "center",
                        marginTop: "-4px",
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "600"
                      }}
                    >
                      {categories[2].cname} <span> ({isPizzaAvailable}) </span>{" "}
                    </p>
                    {/* <ChevronRightIcon
                      fontSize='small'
                      style={{ float: "right", marginTop: "-35px" }}
                    /> */}
                  </Link>
                </li>
              ) : null}

              {/* {menu.isHappyHoursApplicable && isHappyHoursActive ? (
              <li
                id='hhour'
                key='happyHours'
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "8px",
                  marginTop: "15px",
                  height: "40px",
                  width: "72%",
                  marginLeft: "15px"
                }}
              >
                <Link
                  activeClass='active'
                  smooth={true}
                  spy={true}
                  to='Happy Hours'
                  offset={-50}
                  duration={4000}
                  onClick={() => {
                    var a = document.getElementById("pizza-cat")
                    var b = document.getElementById("pizza-cat-text")
                    a.style.backgroundColor = "#f1f1f1"
                    b.style.color = "black"
                    var x = document.getElementById("hhour")
                    var y = document.getElementById("hhour-text")
                    x.style.backgroundColor = "#6244da"
                    y.style.color = "white"
                    drinkstatus(false)
                    dispatch(displayHappyHours())
                    setdraweropen(false)
                  }}
                >
                  <p
                    id='hhour-text'
                    style={{
                      textAlign: "center",
                      marginTop: "-4px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}
                  >
                    Happy hours <span> ({menu?.happyHours?.length}) </span>
                  </p>
                  <ChevronRightIcon
                    fontSize='small'
                    style={{ float: "right", marginTop: "-35px" }}
                  />
                </Link>
              </li>
            ) : null} */}
            </ul>
          </div>
        </SwipeableDrawer>

        {/* section of mobile end */}

        {/* {!displayHideCategory ? ( */}
        {/* <section className='mobile-menu-categories' id='id-of-menu'>
          <span onClick={showCategoryMobile} className='categories-button'>
            <RestaurantIcon style={{ marginTop: "-5px" }} fontSize='small' />{" "}
            MENU
          </span>
        </section> */}

        {/* <div
        style={{
          position: "absolute",
          right: "50%",
          border: "1px solid black"
        }}
      >
        heyy
      </div> */}

        {/* ) : null} */}
        {/* {displayHideCategory ? (
        <section className="mobile-menu-categories" id="id-of-menu">
          <span onClick={hideCategoryMobile} className="categories-button">
            <CloseIcon style={{ marginTop: "-5px" }} /> Menu
          </span>
        </section>
      ) : null} */}
      </>
    )
  }
)

const MenuSubCategory = React.memo(
  ({
    list,
    searchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    drinkstatus,
    hide
  }) => {
    const menu = useSelector((state) => state.menu)
    const [active, setActive] = useState()
    const isSelectedCategory = (categoryId, index) => {
      if (menu.selectedCategoryId) {
        return categoryId === menu.selectedCategoryId
      }

      return menu.searchQuery.trim().length > 0 ? false : index === 0
    }
    console.log("list in menucategories is", list, selectedCategoryId)
    const dispatch = useDispatch()
    const handleClick = (e, item) => {
      console.log("on click item", item)
      drinkstatus(true)
      // console.log("lis of sub cat", temp_cat);
      // e.stopPropagation();

      var a = document.getElementById("pizza-cat")
      var b = document.getElementById("pizza-cat-text")

      var x = document.getElementById("hhour")
      var y = document.getElementById("hhour-text")
      if (x) {
        x.style.backgroundColor = "#f1f1f1"
      }
      if (y) {
        y.style.color = "black"
      }
      if (a) {
        a.style.backgroundColor = "#f1f1f1"
      }
      if (b) {
        b.style.color = "black"
      }

      dispatch(setSelectedCategoryId(item.category_id))
      hide()

      console.log("items is", item)
    }

    const onScroll = (e) => {
      let x = document.querySelector(".selected_cat_id")
      let y = document.querySelector(".selected_cat_happyhour")
      console.log("y selector is", y)
      if (x) {
        if (menu.selectedCategoryId == -1) {
          scrollIntoView(null, {
            scrollMode: "if-needed",
            block: "nearest",
            inline: "nearest"
          })
        } else if (menu.selectedCategoryId != -1) {
          // alert("in non")
          scrollIntoView(x, {
            scrollMode: "if-needed",
            block: "nearest",
            inline: "nearest"
          })
        }
      }
    }

    useEffect(() => {
      if (selectedCategoryId == "-1") {
        window.removeEventListener("scroll", onScroll)
      } else {
        window.addEventListener("scroll", onScroll)
      }
    }, [selectedCategoryId])

    return list.map((s_category, i) => {
      //drinkstatus(true);
      console.log("s_category", s_category)
      if (s_category.online == 1) {
        return (
          <>
            <li
              //id={s_category.cname}
              key={s_category.category_id}
              // className='categories-list-in-menu'
              style={{
                cursor: "pointer",
                backgroundColor: "#F3F2F7",
                borderRadius: "8px",
                marginTop: "15px",
                // height: "40px",
                height: "auto",
                width: "85%",
                marginLeft: "15px"
              }}
              // className={`category ${
              //   isSelectedCategory(s_category.category_id, i)
              //     ? "selected_cat_id"
              //     : ""
              // }`}

              // onClick={(e) => handleClick(e, s_category)}
            >
              <Link
                activeClass='selected_cat_id'
                style={{ textAlign: "center", fontWeight: "700" }}
                className={s_category.cname}
                to={s_category.cname}
                // to='Kebabs'
                spy={true}
                smooth={true}
                offset={-70}
                duration={0}
                onClick={(e) => {
                  handleClick(e, s_category)
                }}
              >
                {s_category?.cname}
              </Link>
            </li>
          </>
        )
      }
    })
  }
)

export default MenuCategories

//  cursor: "pointer",
// borderRadius: "8px",
// backgroundColor: "#f1f1f1",
// marginTop: "10px",
// height: "auto",
// width: "70%",
// width: "auto",
//  marginLeft: "20%",
