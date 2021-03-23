import React from "react";
import { useSelector } from "react-redux";
import {animateScroll as scroll} from 'react-scroll'
import MenuCategories from "../../../components/MenuCategories/MenuCategories";
import MenuItems from "../../MenuItems/MenuItems";

const buttonStyle = {
  position:"fixed",
  bottom: "5%",
  right:"10%",
  border:"none",
  outline:"none",
  backgroundColor:"#5B53CD",
  borderRadius: "20px",
  height:"50px",
  color:"white",
  fontSize:"0.8rem",
  fontWeight:"600",
}

const Information = (props) => {
  const menu = useSelector((state) => state.menu);
  const scrollToTop = () =>{
    scroll.scrollToTop()
  }
  return (
    <>
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
        <button
          style={{ zIndex: "1000" }}
          onClick={scrollToTop}
          style={buttonStyle}
        >
          Scroll to Top
        </button>
        <div id="subheader">
          <div id="sub_content">
            <div id="thumb">
              <img src={props.restaurantInfo.logo} alt />
            </div>
            {/* <div className="rating">
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star" /> (
              <small>
                <a href="detail_page_2.html">Read 98 reviews</a>
              </small>
              )
            </div> */}
            <h1>{props.restaurantInfo.rname}</h1>
            <div>
              <em>{props.restaurantInfo.description}</em>
            </div>
            <div>
              <i className="icon_pin" />{" "}
              {`${props.restaurantInfo.address} - ${props.restaurantInfo.city} - ${props.restaurantInfo.country}`}{" "}
              <strong>Delivery charge:</strong> free over{" "}
              {props.restaurantInfo?.monetary_symbol}-
              {props.restaurantInfo.cost.free_delivery_eligible_amount}.
            </div>
          </div>
          {/* End sub_content */}
        </div>
        {/* End subheader */}
      </section>
      {/* End section */}
      {/* content */}
      <div className="container margin_60_35">
        <div className="row">
          <div className="col-lg-3">
            <p>
              <a
                href="list_page.html"
                className="btn_side"
                style={{ backgroundColor: "#5B53CD" }}
              >
                Back to search
              </a>
            </p>
            <MenuCategories categories={menu.categoriesList} />

            {/* End box_style_1 */}
            <div className="box_style_2 d-none d-sm-block" id="help">
              <i className="icon_lifesaver" />
              <h4>
                Need <span>Help?</span>
              </h4>
              <a
                href="tel://004542344599"
                className="phone"
                style={{ color: "#5B53CD" }}
              >
                {props.restaurantInfo.phone}
              </a>
              <small>Monday to Friday 9.00am - 7.30pm</small>
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
              />
            </div>
            {/* End box_style_1 */}
          </div>
          {/* End col */}
          <div className="col-lg-3" id="sidebar">
            <div
              className="theiaStickySidebar"
              style={{ position: "sticky", top: "65px" }}
            >
              <div id="cart_box">
                <h3>
                  Your order <i className="icon_cart_alt float-right" />
                </h3>
                <table className="table table_summary">
                  <tbody>
                    <tr>
                      <td>
                        <a href="#0" className="remove_item">
                          <i className="icon_minus_alt" />
                        </a>{" "}
                        <strong>1x</strong> Enchiladas
                      </td>
                      <td>
                        <strong className="float-right">$11</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="#0" className="remove_item">
                          <i className="icon_minus_alt" />
                        </a>{" "}
                        <strong>2x</strong> Burrito
                      </td>
                      <td>
                        <strong className="float-right">$14</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="#0" className="remove_item">
                          <i className="icon_minus_alt" />
                        </a>{" "}
                        <strong>1x</strong> Chicken
                      </td>
                      <td>
                        <strong className="float-right">$20</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="#0" className="remove_item">
                          <i className="icon_minus_alt" />
                        </a>{" "}
                        <strong>2x</strong> Corona Beer
                      </td>
                      <td>
                        <strong className="float-right">$9</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="#0" className="remove_item">
                          <i className="icon_minus_alt" />
                        </a>{" "}
                        <strong>2x</strong> Cheese Cake
                      </td>
                      <td>
                        <strong className="float-right">$12</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <div className="row" id="options_2">
                  <div className="col-xl-4 col-md-12 col-sm-12 col-4">
                    <label>
                      <input
                        type="radio"
                        defaultValue
                        defaultChecked
                        name="option_2"
                        className="icheck"
                      />
                      Delivery
                    </label>
                  </div>
                  <div className="col-xl-4 col-md-12 col-sm-12 col-4">
                    <label>
                      <input
                        type="radio"
                        defaultValue
                        name="option_2"
                        className="icheck"
                      />
                      Eat In
                    </label>
                  </div>
                  <div className="col-xl-4 col-md-12 col-sm-12 col-4">
                    <label>
                      <input
                        type="radio"
                        defaultValue
                        name="option_2"
                        className="icheck"
                      />
                      Take Away
                    </label>
                  </div>
                </div>
                {/* Edn options 2 */}
                <hr />
                <table className="table table_summary">
                  <tbody>
                    <tr>
                      <td>
                        Subtotal <span className="float-right">$56</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Delivery fee <span className="float-right">$10</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="total">
                        TOTAL <span className="float-right">$66</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <a
                  className="btn_full"
                  href="cart.html"
                  style={{ backgroundColor: "#5B53CD" }}
                >
                  Order now
                </a>
              </div>
              {/* End cart_box */}
            </div>
            {/* End theiaStickySidebar */}
          </div>
          {/* End col */}
        </div>
        {/* End row */}
      </div>
    </>
  );
};

export default Information;
