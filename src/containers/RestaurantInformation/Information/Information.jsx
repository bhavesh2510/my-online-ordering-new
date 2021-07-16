import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import MenuCategories from "../../../components/MenuCategories/MenuCategories";
import MenuItems from "../../MenuItems/MenuItems";
import Cart from "../../../components/Cart/Cart";
import Login from "../../../components/Login/Login";
import CreateAccount from "../../../components/CreateAccount/CreateAccount";
import ForgotPassword from "../../../components/ForgotPassword/ForgotPassword";
import AppHeader from "../../../components/AppHeader/AppHeader";
import Footer from "../../../components/Footer/Footer";
import AppModal from "../../../components/AppModal/AppModal";
import HelpIcon from "@material-ui/icons/Help";
import HomeSlider from "../../../components/HomeSlider/HomeSlider";
import moment from "moment";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Divider } from "antd";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import CloseIcon from "@material-ui/icons/Close";
import "./Information.css";
import { Link } from "react-scroll";
import { Box, Drawer, ListItem, SwipeableDrawer } from "@material-ui/core";
import { List } from "antd/lib/form/Form";
import { makeStyles } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";
import { notification } from "antd";
import { showLoginFormMethod } from "../../../state-management/user/actions";
import InfoSlider from "./InfoSlider";
const useStyle = makeStyles({
  list: {
    width: 360,
    height: 250,
  },
});

const buttonStyle = {
  position: "fixed",
  bottom: "5%",
  right: "10%",
  border: "none",
  outline: "none",
  backgroundColor: "#302f31",
  borderRadius: "25px",
  height: "40px",
  width: "40px",
  color: "white",
  fontSize: "0.8rem",
  fontWeight: "600",
  cursor: "pointer",
};

const Information = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const main = useSelector((state) => state.main);
  const dispatch = useDispatch();
  const [showdish, setshowdish] = useState(true);
  const [visible, setVisible] = useState(false);
  console.log("menu in selector is", menu);
  console.log("loading in menuItems", props.loading);
  const [timings, settimings] = useState();

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled >= 1000) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    //scroll.scrollToTop();
    scroll.scrollTo("250");

    // window.onscroll = function () {
    //   var pageOffset = document.documentElement.scrollTop;

    //   if (pageOffset >= 1000) {
    //     document.getElementById("stotop").style.visibility = "visible";
    //   } else {
    //     document.getElementById("stotop").style.visibility = "hidden";
    //   }
    // };
  };
  window.addEventListener("scroll", toggleVisible);
  useEffect(() => {
    if (main.isClosed) {
      settimings("closed");
    } else {
      settimings(main.businessHour);
    }
  }, []);

  const handleAddItem = (item, isHappyHoursActive) => {
    console.log("items in cart is", item);
    // if (item.optional_modifier !== '0' || item.forced_modifier !== '0') {
    //   if (item.qty) {
    //     this.props.openModal(
    //       modalNames.INTERMEDIATE_ADD_MODAL,
    //       {
    //         item: {
    //           ...item,
    //           isHappyHoursActive,
    //         },
    //       },
    //     );
    //   } else {
    //     this.props.openModal(
    //       modalNames.DISH_MODAL,
    //       {
    //         item: {
    //           ...item,
    //           isHappyHoursActive,
    //         },
    //       },
    //     );
    //   }

    //   return;
    // }

    // this.props.addItem(item, null, 0, this.props.restaurantInfo);
  };

  const [draweropen, setdraweropen] = useState(false);
  const classes = useStyle();
  const History = useHistory();

  const checkoutformobile = () => {
    if (main.isClosed) {
      return notification["warning"]({
        style: {
          marginTop: "50px",
          color: "rgba(0, 0, 0, 0.65)",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        message: "Oops ! Restaurant is closed. Please Try Agin Later.",
      });
    } else {
      History.push(`/restId=${menu.restaurantInfo.restaurant_id}/checkout`);
    }
  };

  // const toggleDrawer = (open) => (event) => {
  //   setdraweropen(open);
  // };

  const loginformobile = () => {
    dispatch(showLoginFormMethod());
  };

  return (
    <>
      <AppHeader />
      {console.log("informations", props)}

      <InfoSlider />
      {/* <section
          className="parallax-window"
          data-parallax="scroll"
          style={{
            background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
            backgroundSize: "cover",
          }}
          data-natural-width={1400}
          data-natural-height={470}
        >
          <div id="subheader">
            <div id="sub_content">
              <h1>{props.restaurantInfo.rname}</h1>
              <div>
                <em>{props.restaurantInfo.description}</em>
              </div>
              <div>
                <LocationOnIcon />{" "}
                {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}- ${props.restaurantInfo.zipcode}`}{" "}
                <br />
                {menu.restaurantInfo.cost.free_delivery_eligible_amount > 0 ? (
                  <>
                    <strong>Delivery charge:</strong> free over&nbsp;
                    {menu.restaurantInfo.cost.free_delivery_eligible_amount}
                    &nbsp;
                    {props.restaurantInfo?.monetary_symbol}
                    <br />
                  </>
                ) : null}
                Delivery Options : &nbsp;
                {menu.restaurantInfo.order_option
                  ?.split(",")
                  .map((option, i) => {
                    return (
                      <b style={{ textTransform: "capitalize" }}>
                        {option}
                        <CheckCircleOutlineIcon /> &nbsp;
                      </b>
                    );
                  })}
              </div>
            </div>
          </div>
        </section> */}

      {/* End section */}
      {/* content */}
      <div className="container margin_60_35">
        <div className="row customised_row ">
          <div className="col-lg-3">
            <p className="hide-on-mobile">
              <a
                href="#"
                className="btn_side"
                style={{ backgroundColor: "#666171" }}
              >
                Back to search
              </a>
            </p>
            <MenuCategories
              categories={menu.categoriesList}
              loading={props.loading}
              drinkstatus={setshowdish}
            />

            {/* End box_style_1 */}
            <div className="box_style_2 d-none d-sm-block" id="help">
              {/* <img
                src="https://i.ibb.co/PwH9KGP/life-saver-icon-2.jpg"
                height="120px"
                width="120px"
                alt="help"
                border="0"
              /> */}

              <h2>{props.restaurantInfo.rname}</h2>

              <div>
                <LocationOnIcon />{" "}
                {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}- ${props.restaurantInfo.zipcode}`}{" "}
                <br />
                {menu.restaurantInfo.cost.free_delivery_eligible_amount > 0 ? (
                  <>
                    <strong>Delivery charge:</strong> free over&nbsp;
                    {menu.restaurantInfo.cost.free_delivery_eligible_amount}
                    &nbsp;
                    {props.restaurantInfo?.monetary_symbol}
                    <br />
                  </>
                ) : null}
                {/* Delivery Options : &nbsp;
                {menu.restaurantInfo.order_option
                  ?.split(",")
                  .map((option, i) => {
                    return (
                      <b style={{ textTransform: "capitalize" }}>
                        {option}
                        <CheckCircleOutlineIcon /> &nbsp;
                      </b>
                    );
                  })} */}
              </div>
              <br />

              {/* <h4>
                Need <span>Help?</span>
              </h4> */}
              <a href="#" className="phone" style={{ color: "black" }}>
                {props.restaurantInfo.phone_code}&nbsp;
                {props.restaurantInfo.phone}
              </a>
              <small>
                <b>
                  {`${moment().format("dddd")}`} &nbsp;{timings}
                </b>
              </small>
            </div>
          </div>
          {/* End col */}

          <div className="col-lg-6">
            {/* <div style={{ marginTop: "-25px", marginLeft: "20%" }}>
              Delivery Options : &nbsp;
              {menu.restaurantInfo.order_option?.split(",").map((option, i) => {
                return (
                  <b style={{ textTransform: "capitalize" }}>
                    {option}
                    <CheckCircleOutlineIcon /> &nbsp;
                  </b>
                );
              })}
            </div> */}
            <div className="box_style_2 full-width-mobile" id="main_menu">
              <h2
                className="inner hide-on-mobile"
                style={{ backgroundColor: "#666171" }}
              >
                Menu
              </h2>
              <MenuItems
                status={showdish}
                pizzas={menu.pizzas}
                selectedCategoryId={menu.selectedCategoryId}
                menuItems={menu.menuItems}
                restaurantInfo={menu.restaurantInfo}
                searchQuery={menu.searchQuery}
                categories={menu.categoriesList}
                happyhours={menu.happyHours}
                onAddItem={props.onAddItem}
                onRemoveItem={props.onRemoveItem}
                loading={props.loading}
              />
            </div>
            {/* End box_style_1 */}
          </div>
          {/* End col */}
          <div className="col-lg-3" id="sidebar">
            <div
              className="customised_theiaStickySidebar  hide-on-mobile "
              style={{ position: "sticky", top: "65px" }}
            >
              <Cart
                //addItem={handleAddItem}
                addItem={props.onAddItem}
                restinfo={menu.restaurantInfo}
                cartlist={menu.cart}
              />

              {/* End cart_box */}
            </div>

            <button
              className="scroll_to_top_button"
              id="stotop"
              onClick={scrollToTop}
              //style={buttonStyle}
              style={{ display: visible ? "inline" : "none" }}
            >
              <ExpandLessIcon />
            </button>
            {/* End theiaStickySidebar */}
          </div>
          {/* <button
            

            className="scroll_to_top_button"
            id="stotop"
            onClick={scrollToTop}
            //style={buttonStyle}
            style={{ display: visible ? "inline" : "none" }}
          >
            <ExpandLessIcon />
          </button> */}
          {/* End col */}
        </div>

        {/* End row */}
      </div>

      {menu.cart.length >= 1 ? (
        <>
          <div
            class="fixed-bottom hide-on-desktop"
            style={{ height: "60px", backgroundColor: "black" }}
          >
            <div className="parent-mob-footer">
              <div
                className="parent-mob-child"
                onClick={() => setdraweropen(true)}
              >
                <div className="parent-mob-item-container">
                  <p className="parent-mob-item-text">
                    {menu.cart.length} ITEMS
                  </p>
                  <p
                    className="parent-mob-viewcart-text"
                    style={{
                      color: "white",
                      lineHeight: "0.5",
                      fontSize: "15px",
                    }}
                  >
                    VIEW CART <LocalMallIcon fontSize="small" />
                  </p>
                </div>
              </div>

              {user.user.isUserLoggedIn ? (
                <div
                  className="mob-checkout-container"
                  onClick={checkoutformobile}
                >
                  <div className="mob-checkout-button">CHECKOUT</div>
                </div>
              ) : (
                <div
                  className="mob-checkout-container"
                  onClick={loginformobile}
                >
                  <div className="mob-checkout-button-login">LOGIN</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      <SwipeableDrawer
        anchor={"bottom"}
        open={draweropen}
        onClose={() => setdraweropen(false)}
        onOpen={() => {}}
      >
        <div className={classes.list}>
          <div className="orders-conatiner">
            <h2 className="mob-header-text">
              Your Orders{" "}
              <CloseIcon
                style={{ float: "right", marginRight: "25px" }}
                onClick={() => setdraweropen(false)}
              />
            </h2>
          </div>
          <div className="mob-cart-container">
            <Cart
              //addItem={handleAddItem}
              addItem={props.onAddItem}
              restinfo={menu.restaurantInfo}
              cartlist={menu.cart}
            />
          </div>

          {/* <Box textAlign="center">comppomemnts</Box>
          <List>
            <ListItem button onClick={() => {}}>
              <ListItemText primary={"container"}></ListItemText>
            </ListItem>
            <ListItem button onClick={() => {}}>
              <ListItemText primary={"container"}></ListItemText>
            </ListItem>
            <ListItem button onClick={() => {}}>
              <ListItemText primary={"container"}>
               
              </ListItemText>
            </ListItem>
          </List>
          <Divider /> */}
        </div>
      </SwipeableDrawer>

      {user.showLoginForm ? <Login /> : null}
      {user.showRegisterForm ? <CreateAccount /> : null}
      {user.showForgotPasswordForm ? <ForgotPassword /> : null}

      <Footer />
    </>
  );
};

export default Information;
