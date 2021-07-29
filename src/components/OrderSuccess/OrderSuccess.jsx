import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyOrderList,
  fetchMyOrderDetails,
} from "../../state-management/user/asyncActions";
import AppHeader from "../AppHeader/AppHeader";
import Footer from "../Footer/Footer";
import WaitingOverlay from "../WaitingOverlay/WaitingOverlay";
import moment from "moment";
import { truncateDecimal } from "../../state-management/menu/utils";
import HelpIcon from "@material-ui/icons/Help";
import "./OrderSuccess.css";
import icon from "./dersucces-icon.png";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const [ordersession, setordersession] = useState();

  const [state, setstate] = useState({
    showOrderDetails: false,
    loadingData: false,
    showOverlay: false,
    errorMessage: false,
    requestSuccess: null,
  });
  var ordersList = [];
  var ordersData = [];
  const [orderCoompleteDetails, setorderCoompleteDetails] = useState({});

  const fetchdata = async () => {
    setstate({ ...state, loadingData: true });
    console.log("clientid", user.user.clientId);
    const response = await dispatch(fetchMyOrderList(user.user.clientId));
    const { payload } = await response;
    console.log("payload is", payload);

    setstate({ ...state, loadingData: false });
    let dataSource = [];
    if (payload.status == "200") {
      //setstate({ ...state, ordersList: payload.data });
      ordersList = payload.data;
      console.log(
        ordersList.filter(
          (order) => order.restaurant_id === menu.restaurantInfo.restaurant_id
        )
      );
      //console.log("orderList", state.ordersList);

      ordersList
        .filter(
          (order) => order.restaurant_id === menu.restaurantInfo.restaurant_id
        )
        .map((order, i) => {
          let data = {};
          data["key"] = `${i}`;
          data["order_no"] = order.order_id;
          data["order_date"] = order.order_date;
          data["paid"] = order.paid === "1" ? "Yes" : "No";
          data["status"] = order.order_status;
          // console.log(data);
          dataSource.push(data);
          // console.log(this.state.ordersData);
        });
      ordersData = dataSource;

      var oid = ordersList[0].order_id;
      console.log("orders data", oid);
      //setstate({ ...state, ordersData: dataSource });
      //console.log("complete data", state);
    }

    const urlParams = new URLSearchParams(window.location.search);
    var order_session = "";
    for (const entry of urlParams.entries()) {
      order_session = entry[1].slice("30");
    }
    console.log("order session in 78", order_session);
    const response_2 = await dispatch(fetchMyOrderDetails(order_session));
    const { payload_again } = await response_2;

    console.log("response_2 in ordersuccess", response_2);

    if (response_2.payload.status == 200) {
      //orderCoompleteDetails = response_2.payload.data;
      setorderCoompleteDetails(response_2.payload.data[0]);
    }
    console.log("complete details", orderCoompleteDetails);
    var order_session = "";
    console.log("order session in 89", order_session);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <>
      <AppHeader />
      <div className="container margin_60_35">
        {/* style={{ marginTop: "20px" }} */}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div style={{ marginTop: "80px" }}>
              <img src={icon} style={{ height: "400px" }} />
              <div className="myorder-parent">
                <p className="order-confirm-text">Order confirmed !</p>

                <p className="hi-text">Hi {user.user.firstName} !</p>
                <p className="hi-text-2">Thanks for your order !</p>
                <p className="order-number-text">
                  Order Number : {orderCoompleteDetails.order_id}
                </p>

                {orderCoompleteDetails.products &&
                  orderCoompleteDetails.products.map((currval) => {
                    return (
                      <>
                        <div className="list-of-orders">
                          <p className="list-of-order-text">
                            {currval.product_name} &nbsp; x {currval.quantity}
                          </p>
                          <p className="list-of-order-text2">
                            {orderCoompleteDetails.currency}{" "}
                            {truncateDecimal(
                              Number(currval.subtotal) + Number(currval.tax)
                            )}
                          </p>
                        </div>
                        <hr style={{ marginTop: "0px" }} />
                      </>
                    );
                  })}

                <div className="list-of-orders">
                  <p className="list-of-order-text">Total</p>
                  <p className="list-of-order-text2" style={{ color: "black" }}>
                    {orderCoompleteDetails.currency}&nbsp;
                    {orderCoompleteDetails.total}
                  </p>
                </div>

                <div className="list-of-orders">
                  <p className="list-of-order-text">Payment method</p>
                  <p className="list-of-order-text2" style={{ color: "black" }}>
                    {orderCoompleteDetails.pay_method}
                  </p>
                </div>

                <div className="list-of-orders">
                  <p className="list-of-order-text">Order Option</p>

                  {orderCoompleteDetails.delivery_option == "pickup" ? (
                    <>
                      <p
                        className="list-of-order-text2"
                        style={{ color: "black" }}
                      >
                        {orderCoompleteDetails.delivery_option}
                      </p>
                    </>
                  ) : null}
                  {orderCoompleteDetails.delivery_option == "eatin" ? (
                    <p
                      className="list-of-order-text2"
                      style={{ color: "black" }}
                    >
                      {orderCoompleteDetails.delivery_option}
                    </p>
                  ) : null}
                  {orderCoompleteDetails.delivery_option == "delivery" ? (
                    <p
                      className="list-of-order-text2"
                      style={{ color: "black" }}
                    >
                      {orderCoompleteDetails.delivery_option}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};
export default OrderSuccess;
