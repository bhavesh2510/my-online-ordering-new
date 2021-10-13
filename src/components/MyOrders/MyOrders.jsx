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
import "./MyOrders.css";
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
import RenderModifiers from "../../containers/Modifiers/RenderModifiers";
import clipboard from "./Regular-1.5px-clipboard@3x.png";
import mapicon from "./Regular-1.5px-map@3x.png";
import bag from "./Regular-1.5px-shopping_bag@3x.png";
import lock from "./lock@3x.png";
import RestrictUser from "../RestrictUser/RestrictUser";

const MyOrders = React.memo(({ restaurantId }) => {
  const main = useSelector((state) => state.main);
  //const modal = useSelector((state) => state.modal);
  const user = useSelector((state) => state.user);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [restrict, setRestrict] = useState(false);
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
    if (!user.user.isUserLoggedIn) {
      setRestrict(true);
    }
    fetchdata();

    setstate({
      ...state,
      showorder: false,
      showaddress: true,
      showprofile: false,
      showpassword: false,
    });
    var x = document.getElementById("nav-parent-id-2");
    var y = document.getElementById("mob-parent-id-2");
    // var y = document.getElementById("nav-parent-id-2");
    // var z = document.getElementById("nav-parent-id-3");
    // var a = document.getElementById("nav-parent-id-4");
    // a.classList.remove("add-color");
    // y.classList.remove("add-color");
    // z.classList.remove("add-color");
    x.classList.add("add-color");
    if (window.screen.width <= 768) {
      y.classList.add("add-border");
    }
  }, []);

  useEffect(() => {
    console.log("window screen", window.screen.width);
  }, [window.screen.width]);

  useEffect(() => {
    console.log("o list", orderList);
  }, [orderList]);

  const onProfileClick = () => {
    if (window.screen.width <= 768) {
      var x = document.getElementById("mob-parent-id-2");
      var y = document.getElementById("mob-parent-id");
      var z = document.getElementById("mob-parent-id-3");
      var a = document.getElementById("mob-parent-id-4");
      x.classList.remove("add-border");
      y.classList.remove("add-border");
      z.classList.remove("add-border");
      a.classList.add("add-border");
    }
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
    if (window.screen.width <= 768) {
      var x = document.getElementById("mob-parent-id");
      var y = document.getElementById("mob-parent-id-2");
      var z = document.getElementById("mob-parent-id-3");
      var a = document.getElementById("mob-parent-id-4");
      a.classList.remove("add-border");
      y.classList.remove("add-border");
      z.classList.remove("add-border");
      x.classList.add("add-border");
    }
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
    if (window.screen.width <= 768) {
      var x = document.getElementById("mob-parent-id-2");
      var y = document.getElementById("mob-parent-id");
      var z = document.getElementById("mob-parent-id-3");
      var a = document.getElementById("mob-parent-id-4");
      a.classList.remove("add-border");
      y.classList.remove("add-border");
      z.classList.remove("add-border");

      x.classList.add("add-border");
    }
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
    if (window.screen.width <= 768) {
      var x = document.getElementById("mob-parent-id-2");
      var y = document.getElementById("mob-parent-id");
      var z = document.getElementById("mob-parent-id-3");
      var a = document.getElementById("mob-parent-id-4");
      a.classList.remove("add-border");
      x.classList.remove("add-border");
      y.classList.remove("add-border");
      z.classList.add("add-border");
    }
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
    console.log("cyrrent item is", currentitem);
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
    // var formatted = moment(
    //   response.payload.data[0].delivery_time,
    //   "HH:mm"
    // ).format("HH:mm A");
    setextradetails(response.payload.data[0].order_time);
    setpickuptime(response.payload.data[0].delivery_time);
    setdeliverytime(response.payload.data[0].delivery_time);

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
  }, [extradetails]);

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

  const isFmHaveDetours = (fmId, detoursList) => {
    let data = "";

    let result = false;

    detoursList.map((detour) => {
      if (detour.fm_item_id === fmId) {
        // detour availabe
        result = true;
        // now loop through items
        detour.dom.map((op) => {
          data += ` , ${op.om_item_name}`;
        });
      }
    });

    return {
      result,
      data,
    };
  };

  return (
    <>
      {restrict ? (
        <RestrictUser />
      ) : (
        <>
          {state.showloader ? <WaitingOverlay /> : null}
          {state.showpasswordoverlay ? <WaitingOverlay /> : null}

          <AppHeader />

          <div className='parent-catbar-mobile'>
            <div
              className='child-catbar-mobile'
              id='mob-parent-id-2'
              onClick={onAddressClick}
            >
              <p className='child-catbar-text'>My Address</p>
            </div>
            <div className='child-catbar-mobile' id='mob-parent-id'>
              <p
                className='child-catbar-text-orderhistory'
                onClick={onOrderClick}
              >
                Order History
              </p>
            </div>
            <div className='child-catbar-mobile' id='mob-parent-id-4'>
              <p
                className='child-catbar-text-myprofile'
                onClick={onProfileClick}
              >
                My Profile
              </p>
            </div>
            <div className='child-catbar-mobile' id='mob-parent-id-3'>
              <p className='child-catbar-text' onClick={onChangePasswordClick}>
                My passowrd
              </p>
            </div>
          </div>

          <div className='container margin_60_35'>
            <div className='row customised_row '>
              <div
                className='col-lg-3 customise-width hide-on-mobile'
                style={{
                  backgroundColor: "rgb(234, 232, 237)",
                  marginTop: "20px",
                  height: "280px",
                }}
              >
                <div
                  className='sub-cat-myorder'
                  onClick={onAddressClick}
                  id='nav-parent-id-2'
                >
                  <div className='myorder-icontext-parent'>
                    <img src={mapicon} className='img-myorder-icon' />{" "}
                    <p className='myorder-text'>My Address</p>
                  </div>
                </div>
                <div
                  className='sub-cat-myorder'
                  onClick={onOrderClick}
                  id='nav-parent-id'
                >
                  <div className='myorder-icontext-parent'>
                    <img src={bag} className='img-myorder-icon' />{" "}
                    <p className='myorder-text'>Order History</p>
                  </div>
                </div>
                <div
                  className='sub-cat-myorder'
                  onClick={onProfileClick}
                  id='nav-parent-id-4'
                >
                  <div className='myorder-icontext-parent'>
                    <img src={clipboard} className='img-myorder-icon' />{" "}
                    <p className='myorder-text'>My Profile</p>
                  </div>
                </div>
                <div
                  className='sub-cat-myorder'
                  onClick={onChangePasswordClick}
                  id='nav-parent-id-3'
                >
                  <div className='myorder-icontext-parent'>
                    <img src={lock} className='img-myorder-icon' />
                    <p className='myorder-text'>Change Password</p>
                  </div>
                </div>
              </div>

              <div className='col-lg-9'>
                <div
                  style={{
                    backgroundColor: "white",

                    marginTop: "-13px",
                  }}
                >
                  <div className='row'>
                    <div className='parent-below-row'>
                      {state.showorder ? (
                        <>
                          {orderList.length == 0 ? (
                            <>
                              <img
                                src='https://biryaniblues.com/assets/frontend/images/empty-box.png'
                                style={{ marginLeft: "30%" }}
                              />
                            </>
                          ) : (
                            <>
                              <PaginationOrderList
                                orderList={orderList}
                                showModal={showModal}
                              />
                            </>
                          )}

                          {/* {orderList.map((currval) => {
                  return (
                  
                  );
                })} */}
                        </>
                      ) : null}
                    </div>

                    {/* popup */}
                    {/* <div> */}
                    {modal ? (
                      <>
                        <div className='modal-wrapper'>
                          <div className='modal-overlay'></div>
                          <div
                            className='modal-content'
                            style={{ marginTop: "50px" }}
                          >
                            <section className='section-header'>
                              <h2
                                className='heading-modal'
                                style={{ textAlign: "center" }}
                              >
                                <b>Order # {currentdata.orderid}</b>
                              </h2>
                              <span className='close-modal'>
                                <CloseIcon
                                  onClick={closeModal}
                                  style={{ cursor: "pointer" }}
                                />
                              </span>
                            </section>
                            <section className='order-contents'>
                              <div className='restroname'>
                                <div className='namerestroflex'>
                                  <div className='exactrestroname'>
                                    <h4 className='headrestro'>
                                      {menu.restaurantInfo.rname}
                                    </h4>
                                    <div className='restrolocation'>
                                      {menu.restaurantInfo.city},{" "}
                                      {menu.restaurantInfo.country}
                                    </div>{" "}
                                  </div>
                                </div>
                              </div>
                              <hr
                                style={{
                                  width: "90%",
                                  backgroundColor: "black",
                                }}
                              />
                              <div className='item-list'>
                                <h5 className='heading-list'>Order List</h5>
                                {product &&
                                  product.map((currval) => {
                                    let item = currval;
                                    let forcedModifier = "";

                                    let optionalModifier = "";

                                    let toppings = "";

                                    let sizeAndBase = "";

                                    let halfNhalf = "";

                                    if (
                                      item.forced_modifier === undefined ||
                                      item.forced_modifier.length !== 0
                                    ) {
                                      item.forced_modifier.map(function (fm) {
                                        // check if there is detour availabe
                                        const detours = isFmHaveDetours(
                                          fm.fmid,
                                          item.detours
                                        );

                                        forcedModifier += `, ${fm.name}`;
                                        forcedModifier = forcedModifier
                                          .replace(/[\s,]+/, " ")
                                          .trim();
                                        if (detours.result) {
                                          detours.data = detours.data
                                            .replace(/[\s,]+/, " ")
                                            .trim();
                                          forcedModifier += `(${detours.data})`;
                                        }
                                      });
                                    }
                                    if (
                                      item.optional_modifier === undefined ||
                                      item.optional_modifier.length !== 0
                                    ) {
                                      item.optional_modifier.map(function (om) {
                                        optionalModifier += `, ${om.name}`;
                                      });
                                      optionalModifier = optionalModifier
                                        .replace(/[\s,]+/, " ")
                                        .trim();
                                    }

                                    // PIZZA Details

                                    // Toppings
                                    if (item.toppings !== undefined) {
                                      item.toppings.map(function (top) {
                                        toppings += `, ${top.name}`;
                                      });
                                      toppings = toppings
                                        .replace(/[\s,]+/, " ")
                                        .trim();
                                    }

                                    // SizeAndBase
                                    if (item.base !== undefined) {
                                      console.log("pizaa bug", item);
                                      sizeAndBase = `${item.size_vlaue} ${item.base.base_name}`;
                                    }

                                    // HalfNhalf
                                    if (
                                      item.first_half_toppings !== undefined &&
                                      item.second_half_toppings !== undefined &&
                                      item.first_half_toppings.length > 0 &&
                                      item.second_half_toppings.length > 0
                                    ) {
                                      halfNhalf = `First Half: ${item.first_half_toppings[0].name}, Second Half: ${item.second_half_toppings[0].name}`;
                                    }

                                    console.log("half n half is", halfNhalf);

                                    return (
                                      <>
                                        <div className='dish-item'>
                                          <div className='dish-name'>
                                            <div className='dish-name-child'>
                                              <div className='para-tax'>
                                                {currval.quantity} x{" "}
                                                {currval.product_name}
                                              </div>

                                              <div className='para-tax'>
                                                {truncateDecimal(
                                                  Number(currval.subtotal) +
                                                    Number(currval.tax)
                                                )}
                                                {/* Number(currval.tax)} */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div
                                          style={{
                                            width: "50%",
                                            marginLeft: "28px",
                                            marginTop: "10px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {forcedModifier !== "" ? (
                                            <section className='modifiers'>
                                              <span className='modifiers-heading'>
                                                Modifiers:
                                              </span>
                                              {forcedModifier}
                                            </section>
                                          ) : null}
                                          {optionalModifier !== "" ? (
                                            <section className='modifiers'>
                                              <span className='modifiers-heading'>
                                                Extras:
                                              </span>
                                              {optionalModifier}
                                            </section>
                                          ) : null}
                                          {toppings !== "" ? (
                                            <section className='modifiers'>
                                              <span className='modifiers-heading'>
                                                Toppings:
                                              </span>
                                              {toppings}
                                            </section>
                                          ) : null}
                                          {halfNhalf !== "" ? (
                                            <section className='modifiers'>
                                              <span className='modifiers-heading'>
                                                Half And Half Choice:
                                              </span>
                                              {halfNhalf}
                                            </section>
                                          ) : null}
                                        </div>
                                      </>
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
                              <hr
                                style={{
                                  width: "90%",
                                  backgroundColor: "black",
                                }}
                              />
                              <div className='tax-area'>
                                <div className='subtotal'>
                                  <p className='para-tax'>Subtotal</p>
                                  <p className='para-tax'>
                                    {truncateDecimal(subtotal)}
                                  </p>
                                </div>

                                <div className='subtotal'>
                                  <p className='para-tax'>Taxes</p>
                                  <p className='para-tax'>
                                    {truncateDecimal(currentdata.tax)}
                                  </p>
                                </div>

                                <div className='subtotal'>
                                  <p className='para-tax'>Delivery Charge</p>
                                  <p className='para-tax'>
                                    {user.delivery_cost}.00
                                  </p>
                                </div>
                              </div>

                              {savedAmount ? (
                                <>
                                  <div className='savings'>
                                    <p className='para-savings'>YOU SAVED</p>
                                    <p className='para-savings'>EUR 10</p>
                                  </div>
                                </>
                              ) : null}
                              <hr
                                style={{
                                  width: "90%",
                                  backgroundColor: "black",
                                }}
                              />
                              <div
                                className='subtotal'
                                style={{
                                  marginLeft: "20px",
                                  marginRight: "20px",
                                }}
                              >
                                <p className='para-tax'>
                                  <b>GRAND TOTAL</b>
                                </p>
                                <p className='para-tax'>
                                  <b>{truncateDecimal(currentdata.gtotal)}</b>
                                </p>
                              </div>
                              <hr />
                              <br />
                              <div className='order-details'>
                                <h5
                                  className='order-detail-header'
                                  style={{ marginLeft: "20px" }}
                                >
                                  <b>Order Details</b>
                                </h5>
                                <div className='payment-opted'>
                                  <div className='pay-opt'>Payment</div>
                                  <div className='pay-name'>
                                    <div className='pay-method'>
                                      {paymethod}
                                    </div>
                                  </div>
                                </div>
                                <br />
                                <br />
                                <div className='pay-opt'>Ordered ON</div>
                                <div className='pay-name'>
                                  <div className='pay-method'>
                                    {currentdata.date}
                                  </div>
                                </div>
                                <br />
                                <br />
                                <div className='pay-opt'>Order Time</div>
                                <div className='pay-name'>
                                  <div className='pay-method'>
                                    {extradetails}
                                  </div>
                                </div>
                                <br />
                                <br />
                                {currentdata.type == "pickup" ? (
                                  <>
                                    <div className='pay-opt'>Pickup Time</div>
                                    <div className='pay-name'>
                                      <div className='pay-method'>
                                        {pickuptime}
                                      </div>
                                    </div>
                                    <br />
                                    <br />
                                  </>
                                ) : null}
                                {currentdata.type == "delivery" ? (
                                  <>
                                    <div className='pay-opt'>Delivery Time</div>
                                    <div className='pay-name'>
                                      <div className='pay-method'>
                                        {deliverytime}
                                      </div>
                                    </div>
                                    <br />
                                    <br />
                                  </>
                                ) : null}

                                <div className='pay-opt'>Order type</div>
                                <div className='pay-name'>
                                  <div className='pay-method'>
                                    {currentdata.type}
                                  </div>
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
                        <div style={{ marginLeft: "-10%" }}>
                          <MyProfile />
                        </div>
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
                        <div style={{ marginLeft: "-15%" }}>
                          <div className='col-lg-6 password-parent-container'>
                            <div
                              className='box_style_2 box-passowrd-container'
                              id='main_menu'
                            >
                              <div className='parent-container-password-height-width'>
                                <div className='password-child-conatiner'>
                                  <TextField
                                    size='small'
                                    className='input-passowrd-texfield'
                                    // style={{ width: "120%" }}
                                    label='Old Password'
                                    variant='outlined'
                                    value={passworddata.oldpass}
                                    onChange={(e) =>
                                      handleOldPassword(e.target.value)
                                    }
                                  />
                                  <br />
                                  <br />
                                  <TextField
                                    size='small'
                                    className='input-passowrd-texfield'
                                    label='New Password'
                                    variant='outlined'
                                    value={passworddata.newpass}
                                    onChange={(e) =>
                                      handleNewPassword(e.target.value)
                                    }
                                  />
                                  <br />
                                  <br />
                                  <TextField
                                    size='small'
                                    className='input-passowrd-texfield'
                                    label='New Password'
                                    variant='outlined'
                                    value={passworddata.confirmnewpass}
                                    onChange={(e) =>
                                      handleConfirmNewPassword(e.target.value)
                                    }
                                  />
                                  <br />
                                  <br />

                                  <Button
                                    onClick={changePasswordFormSubmit}
                                    className='password-submit-button'
                                    style={{
                                      height: "45px",
                                      backgroundColor: "#000000",

                                      borderRadius: "12px",

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
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
});

export default MyOrders;
