import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  fetchMyOrderList,
  fetchMyOrderDetails,
  updatePassword,
} from "../../state-management/user/asyncActions";
import LoadingBar from "../LoadingBar/LoadingBar";
import MyOrderDetails from "../MyOrderDetails/MyOrderDetails";
import "./MyOrders.scss";
import AppHeader from "../AppHeader/AppHeader";
import MyProfile from "../MyProfile/MyProfile";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { truncateDecimal } from "../../state-management/menu/utils";
import { notification } from "antd";
import Footer from "../Footer/Footer";
import moment from "moment";
import WaitingOverlay from "../WaitingOverlay/WaitingOverlay";
import axios from "axios";
import ManageAddress from "../ManageAddress/ManageAddress";
import ChooseAddress from "../ChooseAddress/ChooseAddress";
import AddAddress from "../ChooseAddress/AddAddress";
import PaginationOrderList from "./PaginationOrderList";
import "antd/dist/antd.css";
import {
  isHappyHourStillActive,
  setTimer,
} from "../../state-management/menu/utils";

const MyOrders = React.memo(({ restaurantId }) => {
  const main = useSelector((state) => state.main);
  //const modal = useSelector((state) => state.modal);
  const user = useSelector((state) => state.user);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [passworddata, setpassworddata] = useState({
    oldpass: "",
    newpass: "",
    //confirmnewpass: "",
    token: user.user.token,
  });
  const [state, setstate] = useState({
    showaddress: false,
    showorder: false,
    showprofile: false,
    showOrderDetails: false,
    showpassword: false,
    showloader: false,
    showpasswordoverlay: false,
    // loadingData: false,
    // showOverlay: false,
    // errorMessage: false,
    // requestSuccess: null,
  });

  const [currentdata, setcurrentdata] = useState({
    orderid: "",
    date: "",
    paymentmethod: "",
    type: "",
    stotal: "",
    tax: "",
    gtotal: "",
    delivery_time: "",
  });
  const [handleadd, sethandleadd] = useState(false);
  const [orderList, setorderList] = useState([]);
  const [currentorderData, setcurrentorderData] = useState([]);
  const [product, setproduct] = useState([]);
  const [subtotal, setsubtotal] = useState([]);
  const [modal, setmodal] = useState(false);
  const fetchdata = async () => {
    const response = await dispatch(fetchMyOrderList(user.user.clientId));

    setorderList(response.payload.data);

    console.log("o list", orderList);
  };

  useEffect(() => {
    fetchdata();

    setstate({
      ...state,
      showorder: false,
      showaddress: true,
      showprofile: false,
      showpassword: false,
    });
    var x = document.getElementById("nav-parent-id-2");
    // var y = document.getElementById("nav-parent-id-2");
    // var z = document.getElementById("nav-parent-id-3");
    // var a = document.getElementById("nav-parent-id-4");
    // a.classList.remove("add-color");
    // y.classList.remove("add-color");
    // z.classList.remove("add-color");
    x.classList.add("add-color");
  }, []);

  useEffect(() => {
    console.log("o list", orderList);
  }, [orderList]);

  const onProfileClick = () => {
    var x = document.getElementById("nav-parent-id-2");
    var y = document.getElementById("nav-parent-id");
    var z = document.getElementById("nav-parent-id-3");
    var a = document.getElementById("nav-parent-id-4");
    x.classList.remove("add-color");
    y.classList.remove("add-color");
    z.classList.remove("add-color");
    a.classList.add("add-color");
    setstate({
      ...state,
      showprofile: true,
      showorder: false,
      showaddress: false,
      showpassword: false,
    });
  };
  const onOrderClick = () => {
    setstate({
      ...state,
      showprofile: false,
      showorder: true,
      showpassword: false,
      showaddress: false,
    });

    var x = document.getElementById("nav-parent-id");
    var y = document.getElementById("nav-parent-id-2");
    var z = document.getElementById("nav-parent-id-3");
    var a = document.getElementById("nav-parent-id-4");
    a.classList.remove("add-color");
    y.classList.remove("add-color");
    z.classList.remove("add-color");
    x.classList.add("add-color");
  };

  const onAddressClick = () => {
    var x = document.getElementById("nav-parent-id-2");
    var y = document.getElementById("nav-parent-id");
    var z = document.getElementById("nav-parent-id-3");
    var a = document.getElementById("nav-parent-id-4");
    a.classList.remove("add-color");
    y.classList.remove("add-color");
    z.classList.remove("add-color");

    x.classList.add("add-color");
    setstate({
      ...state,
      showprofile: false,
      showorder: false,
      showpassword: false,
      showaddress: true,
    });
  };
  const onChangePasswordClick = () => {
    var x = document.getElementById("nav-parent-id-2");
    var y = document.getElementById("nav-parent-id");
    var z = document.getElementById("nav-parent-id-3");
    var a = document.getElementById("nav-parent-id-4");
    a.classList.remove("add-color");
    x.classList.remove("add-color");
    y.classList.remove("add-color");
    z.classList.add("add-color");
    setstate({
      ...state,
      showprofile: false,
      showorder: false,
      showpassword: true,
      showaddress: false,
    });
  };

  const closeModal = () => {
    setmodal(false);
  };

  const [extradetails, setextradetails] = useState();
  const [pickuptime, setpickuptime] = useState();
  const [deliverytime, setdeliverytime] = useState();
  const [paymethod, setpaymethod] = useState();

  const showModal = async (currentitem) => {
    setstate({ ...state, showloader: true });
    //console.log("orderid of modal", orderid);
    if (currentitem.pay_method === "2") {
      setpaymethod("Cash");
    } else if (currentitem.pay_method == "1") {
      setpaymethod("Card");
    } else {
      setpaymethod("Bank");
    }
    setcurrentdata({
      ...currentdata,
      orderid: currentitem.order_id,
      date: currentitem.order_date,
      // paymentmethod: currentitem.pay_method,
      type: currentitem.delivery_option,
      tax: currentitem.tax,
      gtotal: currentitem.grand_total,
    });

    const response = await dispatch(fetchMyOrderDetails(currentitem.order_id));
    console.log("response of order details", response);
    var formatted = moment(
      response.payload.data[0].delivery_time,
      "HH:mm"
    ).format("HH:mm A");
    setextradetails(response.payload.data[0].order_time);
    setpickuptime(response.payload.data[0].delivery_time);
    setdeliverytime(formatted);

    setcurrentorderData(response.payload.data);
    setsubtotal(response.payload.data[0].subtotal);
    setproduct(response.payload.data[0].products);
    setmodal(true);

    setstate({ ...state, showloader: false });
  };
  useEffect(() => {
    console.log("current subtotal is", subtotal);
  }, [subtotal]);

  useEffect(() => {
    console.log("current order data is", product);
  }, [product]);

  useEffect(() => {
    console.log("current order  is", extradetails);
  }, [setextradetails]);

  const handleOldPassword = (e) => {
    setpassworddata({ ...passworddata, oldpass: e });
  };

  const handleNewPassword = (e) => {
    setpassworddata({ ...passworddata, newpass: e });
  };

  const handleConfirmNewPassword = (e) => {
    setpassworddata({ ...passworddata, confirmnewpass: e });
  };

  const changePasswordFormSubmit = async () => {
    setstate({ ...state, showpasswordoverlay: true });
    var axios = require("axios");

    const data = {
      current_password: passworddata.oldpass,
      new_password: passworddata.newpass,
    };
    console.log("data is", data);

    const token = user.user.token;

    var status;

    const api = "https://ciboapp.com/api/clients/v2/client/changePassword/";
    axios
      .post(api, data, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log(res.data);
        //setmsg(res.data.message);
        status = res.data.success;
        notification.open({
          message: res.data.message,
          style: {
            marginTop: "50px",
            color: "rgba(0, 0, 0, 0.65)",
            border: "1px solid #b7eb8f",
            backgroundColor: "#f6ffed",
          },
        });
      });
    //console.log("msg is", msg);
    setstate({ ...state, showpasswordoverlay: false });

    // notification.open({
    //   message: msg,
    //   style: {
    //     marginTop: "50px",
    //     color: "rgba(0, 0, 0, 0.65)",
    //     border: "1px solid #b7eb8f",
    //     backgroundColor: "#f6ffed",
    //   },
    // });
  };

  const getSavedAmount = () => {
    return menu.cart.length
      ? truncateDecimal(
          menu.cart.reduce((acc, item) => {
            if (
              isHappyHourStillActive(item, menu.restaurantInfo.timezone)
                .isActive &&
              item.happyHourItem
            ) {
              return (
                acc +
                (item.subTotal -
                  ((item.happyHourItem && item.happyHourItem.subTotal) || 0))
              );
            }

            return acc;
          }, 0)
        )
      : "";
  };

  const savedAmount = Math.abs(getSavedAmount());
  return (
    <>
      {state.showloader ? <WaitingOverlay /> : null}
      {state.showpasswordoverlay ? <WaitingOverlay /> : null}

      <AppHeader />

      <section
        //className="parallax-window_myprofile "
        data-parallax="scroll"
        // data-image-src="https://cutt.ly/Kkb7BY9"
        style={{
          background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
          backgroundSize: "cover",
        }}
        data-natural-width={1400}
        data-natural-height={470}
      >
        <div id="subheader_myprofile">
          <div id="sub_content">
            <h1>My Profile</h1>
          </div>
        </div>
      </section>
      <div
        className="container margin_60"
        style={{ backgroundColor: "#f9f9f9", border: "1px solid #f1f1f1" }}
      >
        <nav className="nav-parent">
          <ul className="ul-parent">
            <li className="tab-current">
              <p
                id="nav-parent-id-2"
                onClick={onAddressClick}
                className="anchor-parent"
              >
                <span>
                  Address &nbsp;
                  <HomeIcon />
                </span>
              </p>
            </li>
            <li className="tab-current">
              <p
                id="nav-parent-id"
                onClick={onOrderClick}
                className="anchor-parent"
              >
                <span>
                  Orders &nbsp;
                  <FastfoodIcon />
                </span>
              </p>
            </li>

            <li className="tab-current">
              <p
                id="nav-parent-id-4"
                onClick={onProfileClick}
                className=" anchor-parent"
              >
                <span>
                  Profile &nbsp;
                  <PersonIcon />
                </span>
              </p>
            </li>
            <li className="tab-current">
              <p
                id="nav-parent-id-3"
                onClick={onChangePasswordClick}
                className="anchor-parent"
              >
                <span>
                  Change Password
                  <PersonIcon />
                </span>
              </p>
            </li>
          </ul>
        </nav>
        <div
          style={{
            backgroundColor: "white",

            marginTop: "-13px",
          }}
        >
          <div className="row">
            {state.showorder ? (
              <>
                <>
                  <PaginationOrderList
                    orderList={orderList}
                    showModal={showModal}
                  />
                </>
                {/* {orderList.map((currval) => {
                  return (
                  
                  );
                })} */}
              </>
            ) : null}

            {/* popup */}
            {/* <div> */}
            {modal ? (
              <>
                <div className="modal-wrapper">
                  <div className="modal-overlay"></div>
                  <div className="modal-content" style={{ marginTop: "50px" }}>
                    <section className="section-header">
                      <h2
                        className="heading-modal"
                        style={{ textAlign: "center" }}
                      >
                        <b>Order # {currentdata.orderid}</b>
                      </h2>
                      <span className="close-modal">
                        <CloseIcon
                          onClick={closeModal}
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    </section>
                    <section className="order-contents">
                      <div className="restroname">
                        <div className="namerestroflex">
                          <div className="exactrestroname">
                            <h4 className="headrestro">
                              {menu.restaurantInfo.rname}
                            </h4>
                            <div className="restrolocation">
                              {menu.restaurantInfo.city},{" "}
                              {menu.restaurantInfo.country}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                      <hr style={{ width: "90%", backgroundColor: "black" }} />
                      <div className="item-list">
                        <h5 className="heading-list">Order List</h5>
                        {product &&
                          product.map((currval) => {
                            return (
                              <div className="dish-item">
                                <div className="dish-name">
                                  <div className="dish-name-child">
                                    <div className="para-tax">
                                      {currval.quantity} x{" "}
                                      {currval.product_name}
                                    </div>
                                    <div className="para-tax">
                                      {truncateDecimal(
                                        Number(currval.subtotal) +
                                          Number(currval.tax)
                                      )}
                                      {/* Number(currval.tax)} */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        {/* <div className="dish-item">
                          <div className="dish-name">
                            <div className="dish-name-child">
                              <div className="para-tax">1 x dish1</div>
                              <div className="para-tax">EUR 200</div>
                            </div>
                          </div>
                        </div>

                        <div className="dish-item">
                          <div className="dish-name">
                            <div className="dish-name-child">
                              <div className="para-tax">1 x dish1</div>
                              <div className="para-tax">EUR 200</div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <hr style={{ width: "90%", backgroundColor: "black" }} />
                      <div className="tax-area">
                        <div className="subtotal">
                          <p className="para-tax">Subtotal</p>
                          <p className="para-tax">
                            {truncateDecimal(subtotal)}
                          </p>
                        </div>

                        <div className="subtotal">
                          <p className="para-tax">Taxes</p>
                          <p className="para-tax">
                            {truncateDecimal(currentdata.tax)}
                          </p>
                        </div>

                        <div className="subtotal">
                          <p className="para-tax">Delivery Charge</p>
                          <p className="para-tax">{user.delivery_cost}.00</p>
                        </div>
                      </div>

                      {savedAmount ? (
                        <>
                          <div className="savings">
                            <p className="para-savings">YOU SAVED</p>
                            <p className="para-savings">EUR 10</p>
                          </div>
                        </>
                      ) : null}
                      <hr style={{ width: "90%", backgroundColor: "black" }} />
                      <div
                        className="subtotal"
                        style={{ marginLeft: "20px", marginRight: "20px" }}
                      >
                        <p className="para-tax">
                          <b>GRAND TOTAL</b>
                        </p>
                        <p className="para-tax">
                          <b>{truncateDecimal(currentdata.gtotal)}</b>
                        </p>
                      </div>
                      <hr />
                      <br />
                      <div className="order-details">
                        <h5
                          className="order-detail-header"
                          style={{ marginLeft: "20px" }}
                        >
                          <b>Order Details</b>
                        </h5>
                        <div className="payment-opted">
                          <div className="pay-opt">Payment</div>
                          <div className="pay-name">
                            <div className="pay-method">{paymethod}</div>
                          </div>
                        </div>
                        <br />
                        <br />
                        <div className="pay-opt">Ordered ON</div>
                        <div className="pay-name">
                          <div className="pay-method">{currentdata.date}</div>
                        </div>
                        <br />
                        <br />
                        <div className="pay-opt">Order Time</div>
                        <div className="pay-name">
                          <div className="pay-method">{extradetails}</div>
                        </div>
                        <br />
                        <br />
                        {currentdata.type == "pickup" ? (
                          <>
                            <div className="pay-opt">Pickup Time</div>
                            <div className="pay-name">
                              <div className="pay-method">
                                {user.selectedPickUpTime}
                              </div>
                            </div>
                            <br />
                            <br />
                          </>
                        ) : null}
                        {currentdata.type == "delivery" ? (
                          <>
                            <div className="pay-opt">Delivery Time</div>
                            <div className="pay-name">
                              <div className="pay-method">
                                {user.selectedDeliveryTime}
                              </div>
                            </div>
                            <br />
                            <br />
                          </>
                        ) : null}

                        <div className="pay-opt">Order type</div>
                        <div className="pay-name">
                          <div className="pay-method">{currentdata.type}</div>
                        </div>
                        <br />
                        <br />
                      </div>
                    </section>
                  </div>
                </div>
              </>
            ) : null}

            {/* popup */}

            {state.showprofile ? (
              <>
                <MyProfile />
              </>
            ) : null}

            {state.showaddress ? (
              <>
                {" "}
                <ManageAddress />{" "}
              </>
            ) : null}

            {state.showpassword ? (
              <>
                <div className="col-lg-6 password-parent-container">
                  <div
                    className="box_style_2 box-passowrd-container"
                    id="main_menu"
                  >
                    <div
                      style={{
                        height: "auto",
                        width: "400px",
                      }}
                    >
                      <div className="password-child-conatiner">
                        <TextField
                          size="small"
                          className="input-passowrd-texfield"
                          // style={{ width: "120%" }}
                          label="Old Password"
                          variant="outlined"
                          value={passworddata.oldpass}
                          onChange={(e) => handleOldPassword(e.target.value)}
                        />
                        <br />
                        <br />
                        <TextField
                          size="small"
                          className="input-passowrd-texfield"
                          label="New Password"
                          variant="outlined"
                          value={passworddata.newpass}
                          onChange={(e) => handleNewPassword(e.target.value)}
                        />
                        <br />
                        <br />
                        <TextField
                          size="small"
                          className="input-passowrd-texfield"
                          label="New Password"
                          variant="outlined"
                          value={passworddata.confirmnewpass}
                          onChange={(e) =>
                            handleConfirmNewPassword(e.target.value)
                          }
                        />
                        <br />
                        <br />

                        <Button
                          onClick={changePasswordFormSubmit}
                          className="password-submit-button"
                          style={{
                            backgroundColor: "#6244da",

                            color: "white",
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* End box_style_1 */}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* {modal.modal.modalToShow == "findAddress" ? <ChooseAddress /> : null}
      {modal.modal.modalToShow == "AddAddress" ? <AddAddress /> : null} */}
      <Footer />
    </>
  );
});

export default MyOrders;
