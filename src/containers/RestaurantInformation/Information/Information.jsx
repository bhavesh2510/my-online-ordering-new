import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
const buttonStyle = {
  position: "fixed",
  bottom: "5%",
  right: "10%",
  border: "none",
  outline: "none",
  backgroundColor: "#5B53CD",
  borderRadius: "20px",
  height: "50px",
  color: "white",
  fontSize: "0.8rem",
  fontWeight: "600",
};

const Information = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const main = useSelector((state) => state.main);
  console.log("menu in selector is", menu);
  console.log("loading in menuItems", props.loading);
  const [timings, settimings] = useState();
  const scrollToTop = () => {
    scroll.scrollToTop();
  };
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

  return (
    <>
      <AppHeader />
      {console.log("informations", props)}
      <section
        className="parallax-window"
        data-parallax="scroll"
        // data-image-src="https://cutt.ly/Kkb7BY9"
        style={{
          background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
          backgroundSize: "cover",
        }}
        data-natural-width={1400}
        data-natural-height={470}
      >
        {/* <button
          style={{ zIndex: "1000" }}
          onClick={scrollToTop}
          style={buttonStyle}
        >
          Scroll to Top
        </button> */}
        <div id="subheader">
          <div id="sub_content">
            {/* <div id="thumb">
              <img src={props.restaurantInfo.logo} alt />
            </div> */}

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
                  {menu.restaurantInfo.cost.free_delivery_eligible_amount}&nbsp;
                  {props.restaurantInfo?.monetary_symbol}
                  {/* {props.restaurantInfo.cost.free_delivery_eligible_amount}. */}
                  <br />
                </>
              ) : null}
              Delivery Options : &nbsp;
              {menu.restaurantInfo.order_option?.split(",").map((option, i) => {
                return (
                  <b style={{ textTransform: "capitalize" }}>
                    {option}
                    <CheckCircleOutlineIcon /> &nbsp;
                  </b>
                );
              })}
            </div>
          </div>
          {/* End sub_content */}
        </div>
        {/* End subheader */}
      </section>
      {/* End section */}
      {/* content */}
      <div className="container margin_60_35">
        <div className="row customised_row">
          <div className="col-lg-3">
            <p>
              <a
                href="#"
                className="btn_side"
                style={{ backgroundColor: "#5B53CD" }}
              >
                Back to search
              </a>
            </p>
            <MenuCategories
              categories={menu.categoriesList}
              loading={props.loading}
            />

            {/* End box_style_1 */}
            <div className="box_style_2 d-none d-sm-block" id="help">
              <img
                src="https://i.ibb.co/PwH9KGP/life-saver-icon-2.jpg"
                height="120px"
                width="120px"
                alt="help"
                border="0"
              />

              <h4>
                Need <span>Help?</span>
              </h4>
              <a href="#" className="phone" style={{ color: "#5B53CD" }}>
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
            <div className="box_style_2" id="main_menu">
              <h2 className="inner" style={{ backgroundColor: "#5B53CD" }}>
                Menu
              </h2>
              <MenuItems
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
              className="customised_theiaStickySidebar"
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
            {/* End theiaStickySidebar */}
          </div>

          {/* End col */}
        </div>

        {/* End row */}
      </div>

      {user.showLoginForm ? <Login /> : null}
      {user.showRegisterForm ? <CreateAccount /> : null}
      {user.showForgotPasswordForm ? <ForgotPassword /> : null}

      <Footer />
    </>
  );
};

export default Information;
