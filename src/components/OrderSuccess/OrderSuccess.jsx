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

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);

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

    const response_2 = await dispatch(
      fetchMyOrderDetails(ordersList[0].order_id)
    );
    const { payload_again } = await response_2;

    if (response_2.payload.status == 200) {
      //orderCoompleteDetails = response_2.payload.data;
      setorderCoompleteDetails(response_2.payload.data[0]);
    }
    console.log("complete details", orderCoompleteDetails);
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
            <div className="box_style_2">
              <h2
                className="inner"
                style={{ textAlign: "center", backgroundColor: "#6244da" }}
              >
                Order confirmed!
              </h2>
              <div id="confirm">
                <i className="icon_check_alt2"></i>
                <br />
                <h3>Thank you!</h3>
                <h3>Order Number :{orderCoompleteDetails.order_id} </h3>
                {/* <p>
                  Lorem ipsum dolor sit amet, nostrud nominati vis ex, essent
                  conceptam eam ad. Cu etiam comprehensam nec. Cibo delicata mei
                  an, eum porro legere no.
                </p> */}
              </div>
              {/* <h3>Order Summary :</h3> */}
              <table className="table table-striped nomargin">
                <tbody>
                  {orderCoompleteDetails.products &&
                    orderCoompleteDetails.products.map((currval) => {
                      console.log("currval", currval);
                      return (
                        <>
                          <tr>
                            <td>
                              <strong>{currval.quantity} &nbsp;x</strong>{" "}
                              {currval.product_name}
                            </td>
                            <td>
                              <strong className="float-right">
                                {Number(currval.price) + Number(currval.tax)}
                              </strong>
                            </td>
                          </tr>
                        </>
                      );
                    })}

                  <br />
                  <br />
                  <tr>
                    <td>
                      Order Option{" "}
                      <a
                        href="#"
                        className="tooltip-1"
                        data-placement="top"
                        title=""
                        data-original-title="Please consider 30 minutes of margin for the delivery!"
                      >
                        <i class="icon_question_alt"></i>
                      </a>
                    </td>

                    <td>
                      <strong className="float-right">
                        {orderCoompleteDetails.delivery_option == "pickup" ? (
                          <>
                            <strong className="float-right">
                              {orderCoompleteDetails.delivery_option}
                              {/* {user.selectedPickUpTime} */}
                            </strong>
                          </>
                        ) : null}
                        {orderCoompleteDetails.delivery_option == "eatin" ? (
                          <strong className="float-right">
                            {orderCoompleteDetails.delivery_option}
                          </strong>
                        ) : null}
                        {orderCoompleteDetails.delivery_option == "delivery" ? (
                          <strong className="float-right">
                            {orderCoompleteDetails.delivery_option}
                            {user.selectedDeliveryTime}
                          </strong>
                        ) : null}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Payment Option{" "}
                      <a
                        href="#"
                        className="tooltip-1"
                        data-placement="top"
                        title=""
                        data-original-title="Please consider 30 minutes of margin for the delivery!"
                      >
                        <i class="icon_question_alt"></i>
                      </a>
                    </td>
                    <td>
                      <strong className="float-right">
                        {orderCoompleteDetails.pay_method}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="total_confirm">TOTAL</td>
                    <td className="total_confirm">
                      <span className="float-right">
                        {orderCoompleteDetails.currency}&nbsp;
                        {orderCoompleteDetails.total}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};
export default OrderSuccess;
