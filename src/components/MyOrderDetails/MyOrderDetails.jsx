import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { fetchMyOrderDetails } from "../../state-management/user/asyncActions";

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

const MyOrderDetails = (props) => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});
  const [modal, setModal] = useState(false);
  const fetchAndShowOrderDetails = async (orderId) => {
    props.loading(true);
    const { payload } = await dispatch(fetchMyOrderDetails(orderId));
    console.log(payload.data);
    if (payload.status === "200") {
      setDetails(payload.data[0]);
    }
    props.loading(false);
  };
  const toggle = () => {
    setModal(!modal);
  };
  const openModal = () => {
    setModal(!modal);
    fetchAndShowOrderDetails(props.orderId);
  };
  //   const itemList = details?.products?.map((item, i) => {
  //     let forcedModifier = "";

  //     let optionalModifier = "";

  //     let toppings = "";

  //     let sizeAndBase = "";

  //     let halfNhalf = "";

  //     if (
  //       item.forced_modifier === undefined ||
  //       item.forced_modifier.length !== 0
  //     ) {
  //       item.forced_modifier.map(function (fm) {
  //         // check if there is detour availabe
  //         const detours = isFmHaveDetours(fm.fmid, item.detours);

  //         forcedModifier += `, ${fm.name}`;
  //         forcedModifier = forcedModifier.replace(/[\s,]+/, " ").trim();
  //         if (detours.result) {
  //           detours.data = detours.data.replace(/[\s,]+/, " ").trim();
  //           forcedModifier += `(${detours.data})`;
  //         }
  //       });
  //     }
  //     if (
  //       item.optional_modifier === undefined ||
  //       item.optional_modifier.length !== 0
  //     ) {
  //       item.optional_modifier.map(function (om) {
  //         optionalModifier += `, ${om.name}`;
  //       });
  //       optionalModifier = optionalModifier.replace(/[\s,]+/, " ").trim();
  //     }

  //     // PIZZA Details

  //     // Toppings
  //     if (item.toppings !== undefined) {
  //       item.toppings.map(function (top) {
  //         toppings += `, ${top.name}`;
  //       });
  //       toppings = toppings.replace(/[\s,]+/, " ").trim();
  //     }

  //     // SizeAndBase
  //     if (item.base !== undefined) {
  //       console.log("pizaa bug", item);
  //       sizeAndBase = `${item.size_vlaue} ${item.base.base_name}`;
  //     }

  //     // HalfNhalf
  //     if (
  //       item.first_half_toppings !== undefined &&
  //       item.second_half_toppings !== undefined &&
  //       item.first_half_toppings.length > 0 &&
  //       item.second_half_toppings.length > 0
  //     ) {
  //       halfNhalf = `First Half: ${item.first_half_toppings[0].name}, Second Half: ${item.second_half_toppings[0].name}`;
  //     }

  //   });
  return (
    <div>
      <Button color="black" onClick={openModal}>
        Details
      </Button>
      <Modal isOpen={modal} toggle={toggle} style={{ top: "25%" }}>
        <ModalHeader toggle={toggle}>Order Details</ModalHeader>
        <ModalBody>
          <div>
            <strong>Order No - </strong>
            <span>&nbsp;{details.order_id}</span>
          </div>
          <div>
            <strong>Order Date - </strong>
            <span>&nbsp;{details.order_date}</span>
          </div>
          <div>
            <strong>Order Status - </strong>
            <span>&nbsp;{details.order_status}</span>
          </div>
          <div>
            <strong>Order Type - </strong>
            <span>&nbsp;{details.delivery_option}</span>
          </div>
          <div>
            <strong>Order Time - </strong>
            <span>&nbsp;{details.order_time}</span>
          </div>
          <div>
            <strong>Comments - </strong>
            <span>&nbsp;{details.comments}</span>
          </div>
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity x Price</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {details &&
                details?.products?.map((product, i) => {
                  return (
                    <tr key={i}>
                      <th>{product.product_name}</th>
                      <th>{`${product.quantity} X ${product.price}`}</th>
                      <th>{product.tax}</th>
                      <th>
                        {Number(product.quantity) * Number(product.price)}
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <div style={{ width: "100%" }}>
            <div>
              <strong>Subtotal - </strong>
              <span>&nbsp;{details.subtotal}</span>
            </div>
            <div>
              <strong>Tax - </strong>
              <span>&nbsp;{details.tax}</span>
            </div>
            <div>
              <strong>Delivery Cost - </strong>
              <span>&nbsp;{details.delivery_cost}</span>
            </div>
            {details.happy_hours_discount ? (
              <div>
                <strong>Happy Hour Discount - </strong>
                <span>&nbsp;{details.happy_hours_discount}</span>
              </div>
            ) : null}
          </div>
          <div>
            <strong>Total - </strong>
            <span>&nbsp;{details.total}</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            Close
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MyOrderDetails;
