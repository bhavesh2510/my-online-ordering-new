import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../assets/img/zottoLogo.png";
import {
  setUserLoggedOut,
  showLoginFormMethod,
  showRegisterFormMethod,
} from "../../state-management/user/actions";
// import "./AppHeader.scss";

const Appheader = () => {
  const History = useHistory();
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

  return (
    <header
      className="main-header"
      style={{
        background: `${navbar ? "#242B2E" : "black"}`,
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
            <img width="100px" height="30px" src={Logo} alt="zotto" />
          </div>
          <nav className="col-md-8 col-sm-8 col-8">
            <a
              className="cmn-toggle-switch cmn-toggle-switch__htx open_close"
              href="javascript:void(0);"
            >
              <span>Menu mobile</span>
            </a>
            <div className="main-menu">
              <div id="header_menu">
                <img src="img/logo.png" width={190} height={23} alt />
              </div>
              <a href="#" className="open_close" id="close_in">
                <i className="icon_close" />
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
                    onClick={() => History.push("myOrders")}
                  >
                    {user.user.isUserLoggedIn ? (
                      <a className="show-submenu">
                        {user.user.firstName}
                        <i className="icon-down-open-mini" />
                      </a>
                    ) : (
                      <a className="show-submenu">
                        user
                        <i className="icon-down-open-mini" />
                      </a>
                    )}
                    {/* <a href="javascript:void(0);" className="show-submenu">
                    user
                    <i className="icon-down-open-mini" />
                  </a> */}

                    <ul>
                      <li
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => History.push("myOrders")}
                      >
                        <a
                          style={{ color: "black", cursor: "pointer" }}
                          //href={`?/restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                          //onClick={()=>History.push(`/restId=${menu.restaurantInfo.restaurant_id}/myProfile`)}
                        >
                          Edit Profile
                        </a>
                      </li>
                      <li
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
                      </li>
                      <li
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => History.push("myOrders")}
                      >
                        <a
                          style={{ color: "black" }}
                          //href={`?/restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                        >
                          My Orders
                        </a>
                      </li>
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

                <li>
                  <a
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => dispatch(showLoginFormMethod())}
                    data-toggle="modal"
                    data-target="#login_2"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => dispatch(showRegisterFormMethod())}
                    data-toggle="modal"
                    data-target="#login_2"
                  >
                    Register
                  </a>
                </li>
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
