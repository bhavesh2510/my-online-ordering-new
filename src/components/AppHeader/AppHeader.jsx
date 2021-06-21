import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
//import Logo from "../../assets/img/zottoLogo.png";
import {
  setUserLoggedOut,
  showLoginFormMethod,
  showRegisterFormMethod,
} from "../../state-management/user/actions";
// import "./AppHeader.scss";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";

const Appheader = () => {
  const History = useHistory();
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);

  const [navbar, setNavbar] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const changeBackground = () => {
    if (window.scrollY >= 60) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  const callLogout = () => {
    dispatch(setUserLoggedOut());
    window.location.replace(
      `${process.env.REACT_APP_PUBLIC_URL}restId=${menu.restaurantInfo.restaurant_id}/menu`
    );
  };

  const showMobileMenu = () => {
    var x = document.getElementById("main-menu-id");
    x.classList.add("show");
  };

  const showEditProfileOnMobile = () => {
    var x = document.getElementById("editprofile");
    x.classList.add("show_normal");
  };
  const closemobilemenu = () => {
    var x = document.getElementById("main-menu-id");
    x.classList.remove("show");
  };

  return (
    <header
      className="main-header"
      style={{
        background: `${navbar ? "black" : "black"}`,
        boxShadow: "1px 6px 18px -4px #000000",
      }}
    >
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-4 col-sm-4 col-4"
            style={{ fontSize: "1.2rem", color: "black" }}
          >
            {/* paste logo here */}
            <img
              style={{ marginTop: "-12px" }}
              width="130px"
              height="50px"
              src={main.selectedRestaurant.logo}
              alt="zotto"
            />
          </div>
          <nav className="col-md-8 col-sm-8 col-8">
            <a
              className="cmn-toggle-switch cmn-toggle-switch__htx open_close"
              onClick={showMobileMenu}
            >
              <span>Menu mobile</span>
            </a>

            <div className="main-menu" id="main-menu-id">
              <div id="header_menu" style={{ backgroundColor: "black" }}>
                <img
                  src={main.selectedRestaurant.logo}
                  width="150px"
                  height="50px"
                  alt
                />
              </div>
              <a
                href="#"
                className="open_close"
                id="close_in"
                onClick={closemobilemenu}
              >
                <CloseIcon style={{ color: "white" }} />
              </a>
              <ul>
                {Number(menu.restaurantInfo["chain_owner_id"]) ? (
                  <li key={11} className="navigation-buttons">
                    {/* Should figure out why Link is not working as expected, page getting redirected */}
                    <a
                      // onClick={() =>
                      //   history.push(
                      //     `${process.env.REACT_APP_PUBLIC_URL}chainId=${menu.restaurantInfo.chain_owner_id}`
                      //   )
                      // }
                      href={`?/chainId=${menu.restaurantInfo.chain_owner_id}`}
                    >
                      Home
                    </a>
                  </li>
                ) : null}
                <li
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => History.push("menu")}
                >
                  <a
                  // href={`?/restId=${menu.restaurantInfo.restaurant_id}/menu`}
                  >
                    Menu
                  </a>
                </li>

                {user.user.isUserLoggedIn ? (
                  <li
                    className="submenu"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={showEditProfileOnMobile}
                  >
                    {user.user.isUserLoggedIn ? (
                      <a className="show-submenu">
                        {user.user.firstName}
                        <ExpandMoreIcon
                          fontSize="small"
                          style={{ float: "right" }}
                        />
                      </a>
                    ) : (
                      <a className="show-submenu">
                        user
                        <ExpandMoreIcon fontSize="small" />
                      </a>
                    )}
                    {/* <a href="javascript:void(0);" className="show-submenu">
                    user
                    <i className="icon-down-open-mini" />
                  </a> */}

                    <ul className="" id="editprofile">
                      <li
                        style={{
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => History.push("myOrders")}
                      >
                        <a
                          style={{ color: "black", cursor: "pointer" }}
                          //href={`?/restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                          //onClick={()=>History.push(`/restId=${menu.restaurantInfo.restaurant_id}/myProfile`)}
                        >
                          My Profile
                        </a>
                      </li>
                      {/* <li
                        style={{ color: "black", cursor: "pointer" }}
                        onClick={() => History.push("myOrders")}
                      >
                        <a
                          style={{ color: "black" }}
                          style={{ color: "black" }}
                          //href={`?/restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                        >
                          Manage Addresses
                        </a>
                      </li> */}
                      {/* <li
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => History.push("myOrders")}
                      >
                        <a
                          style={{ color: "black" }}
                          //href={`?/restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                        >
                          My Orders
                        </a>
                      </li> */}
                      <li>
                        <a
                          onClick={callLogout}
                          style={{ color: "black", cursor: "pointer" }}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}

                {!user.user.isUserLoggedIn ? (
                  <>
                    <li>
                      <a
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => {
                          var x = document.getElementById("main-menu-id");
                          x.classList.remove("show");
                          dispatch(showLoginFormMethod());
                        }}
                        data-toggle="modal"
                        data-target="#login_2"
                      >
                        Login
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => {
                          var x = document.getElementById("main-menu-id");
                          x.classList.remove("show");
                          dispatch(showRegisterFormMethod());
                        }}
                        data-toggle="modal"
                        data-target="#login_2"
                      >
                        Register
                      </a>
                    </li>
                  </>
                ) : (
                  <li>
                    <a
                      style={{ color: "white", cursor: "pointer" }}
                      // onClick={() => dispatch(showRegisterFormMethod())}
                      data-toggle="modal"
                      data-target="#login_2"
                    >
                      Help
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {/* End main-menu */}
          </nav>
        </div>
        {/* End row */}
      </div>
      {/* End container */}
    </header>
  );
};

export default Appheader;
