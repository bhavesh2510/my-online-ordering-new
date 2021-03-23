import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Logo from '../../assets/img/zottoLogo.png'
// import "./AppHeader.scss";

const Appheader = () => {
  const menu = useSelector((state)=>state.menu)
  const [navbar, setNavbar] = useState(false);
  const history = useHistory()

  const changeBackground = () =>{
    if (window.scrollY>=60){
      setNavbar(true);
    }
    else{
      setNavbar(false);
    }
  }

  window.addEventListener('scroll', changeBackground);

  return (
    <header
      style={{
        background: `${navbar ? "#242B2E" : "transparent"}`,
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
                      href={`${process.env.REACT_APP_PUBLIC_URL}chainId=${menu.restaurantInfo.chain_owner_id}`}
                    >
                      Home
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href="about.html">About us</a>
                </li>
                <li className="submenu">
                  <a href="javascript:void(0);" className="show-submenu">
                    User
                    <i className="icon-down-open-mini" />
                  </a>
                  <ul>
                    <li>
                      <a href="list_page.html">Edit Profile</a>
                    </li>
                    <li>
                      <a href="grid_list.html">Manage Addresses</a>
                    </li>
                    <li>
                      <Link
                        to={`${process.env.REACT_APP_PUBLIC_URL}restId=${menu.restaurantInfo.restaurant_id}/myOrders`}
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <a href="detail_page.html">Logout</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#0" data-toggle="modal" data-target="#login_2">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#0" data-toggle="modal" data-target="#login_2">
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
