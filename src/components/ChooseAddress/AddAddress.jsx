import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Radio, Checkbox, InputNumber } from "antd";
import "antd/dist/antd.css";
import HomeIcon from "@material-ui/icons/Home";
import WorkIcon from "@material-ui/icons/Work";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
//import Button from "@material-ui/core/Button";
import { displayAddressModal } from "../../state-management/menu/actions";
import {
  postAddAddress,
  fetchAddressesList,
} from "../../state-management/user/asyncActions";
import { setSelectedAddress } from "../../state-management/user/actions";
import { openModal, closeModal } from "../../state-management/modal/actions";
import { ContactsOutlined } from "@material-ui/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import WaitingOverlay from "../WaitingOverlay/WaitingOverlay";
const AddAddress = (props) => {
  const main = useSelector((state) => state.main);
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    name: `${user.user.firstName} ${user.user.lastName}`,
    //address1: user.deliveryOption.userAddress.address1.address_1,
    address1: "",
    address2: "",
    // city: user.deliveryOption.userAddress.city,
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: user.user.mobile,
    phonecode: menu.restaurantInfo.phone_code,
    // country: user.deliveryOption.userAddress.country,
    // zipcode: user.deliveryOption.userAddress.zipcode,
    // //phone: this.props.user.mobile,
    //phonecode: Number(this.props.selectedRestaurant.phone_code),
    type: "Home",
    is_default: "0",
    client_id: user.user.clientId,
    waitingOverlay: false,
    submitText: "Please fill in all the mandatory(*) fields!",
    submitPressed: false,
    error: false,
    ...(user.deliveryOption ? user.deliveryOption.userAddress : undefined),
    ...modal.modal.state.address,
  });
  const closeLoginModal = () => {
    // dispatch(displayAddressModal(false));
    dispatch(closeModal());
  };

  const handleNameChange = (value) => {
    setState({ ...state, name: value });
  };
  const handleAddress1Change = (value) => {
    setState({ ...state, address1: value });
  };
  const handleAddress2Change = (value) => {
    setState({ ...state, address2: value });
  };
  const handleStateChange = (value) => {
    setState({ ...state, state: value });
  };

  const locationOfDelivery = (value) => {
    setState({ ...state, type: value });
  };

  const onChangeSetDefault = (value) => {
    setState({ ...state, is_default: state["is_default"] === "0" ? "1" : "0" });
  };

  const handleResponse = (payload) => {
    setState({ ...state, waitingOverlay: false, submitPressed: false });

    if (payload.success) {
      //this.props.successCallback && this.props.successCallback();
      //   this.props.modalState.selectAddress &&
      dispatch(setSelectedAddress(state));
      closeLoginModal();
    } else {
      setState({ ...state, submitText: "SUBMIT" });
      setState({ ...state, error: payload.message });
    }
  };

  const onFormSubmit = async () => {
    console.log("state is", state);

    setState({
      ...state,
      waitingOverlay: true,
      submitText: "Please Wait...",
      error: false,
      submitPressed: true,
    });
    const { existingDefaultAddress } = modal.modal.state;
    console.log("existing address", existingDefaultAddress);

    //if k andar yeh b aaega ==> existingDefaultAddress &&
    if (existingDefaultAddress && state["is_default"] === "1") {
      const { payload: payload1 } = await dispatch(
        postAddAddress(
          {
            ...existingDefaultAddress,
            is_default: "0",
          },
          true
        )
      );
      !payload1.success && handleResponse(payload1);
      if (payload1.success) {
        const { payload } = await dispatch(
          postAddAddress(state, modal.modal.state.editMode)
        );

        handleResponse(payload);
      }
    } else {
      const { payload } = await dispatch(
        postAddAddress(
          state,

          modal.modal.state.editMode
        )
      );
      if (!modal.modal.state.editMode)
        if (payload.success) {
          props.refetchAddresses(true);
        }

      console.log("payload on post", payload);
      setState({ ...state, payload });

      handleResponse(payload);

      dispatch(closeModal());
    }
  };

  // const fetchAddressList = async () => {
  //   const payload = await dispatch(fetchAddressesList(user.user.clientId));
  //   const resp = payload.data;
  //   setState({ ...state, resp });
  // };

  useEffect(() => {
    console.log("state in add address", state);
  }, [state]);

  const toggle = () => {
    dispatch(closeModal());
  };
  return (
    <>
      <Modal isOpen={true} toggle={toggle} style={{ top: "10%", left: "2%" }}>
        <ModalHeader toggle={toggle}>
          {" "}
          {modal.modal.state.editMode ? "Edit Address" : "Add Address"}
        </ModalHeader>
        <ModalBody>
          {/* {state.waitingOverlay ? <WaitingOverlay /> : null} */}
          <div className="input-addd-address">
            <Input
              size="medium"
              placeholder="Full Name"
              style={{ borderRadius: "5px" }}
              value={state.name || null}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              size="medium"
              placeholder="Address Line 1"
              style={{ borderRadius: "5px" }}
              value={state.address1 || null}
              onChange={(e) => handleAddress1Change(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              size="medium"
              placeholder="House Number"
              style={{ borderRadius: "5px" }}
              value={state.address2}
              onChange={(e) => handleAddress2Change(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              disabled
              size="medium"
              placeholder="Address Line 2"
              style={{ borderRadius: "5px" }}
              value={state.city || null}
              //onChange={(e) => this.handleAddress2Change(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              size="medium"
              placeholder="state"
              style={{ borderRadius: "5px" }}
              value={state.state || null}
              onChange={(e) => handleStateChange(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              disabled
              size="medium"
              placeholder="Address Line 2"
              style={{ borderRadius: "5px" }}
              value={state.zipcode || null}
              //onChange={(e) => this.handleAddress2Change(e.target.value)}
            />
          </div>
          <div className="input-addd-address">
            <Input
              disabled
              size="medium"
              placeholder="Address Line 2"
              style={{ borderRadius: "5px" }}
              value={state.country || null}
              //onChange={(e) => this.handleAddress2Change(e.target.value)}
            />
          </div>
          <div className="input-addd-address-contact">
            <Input
              size="medium"
              placeholder="phonecode"
              style={{ width: "25%", borderRadius: "5px" }}
              value={menu.restaurantInfo.phone_code || null}
              //onChange={(e) => this.handleAddress2Change(e.target.value)}
            />
            &nbsp;
            <Input
              size="medium"
              placeholder="phone number"
              style={{ width: "75%", borderRadius: "5px" }}
              value={state.phone || null}
              //onChange={(e) => this.handleAddress2Change(e.target.value)}
            />
          </div>

          <div
            className="address-type"
            style={{
              marginLeft: "15px",
              // marginTop: "5px",
            }}
          >
            <input
              className="check_payment"
              type="radio"
              name="delivery_type"
              id="home"
              value="home"
              onChange={(e) => locationOfDelivery(e.target.value)}
            />
            <label
              //onClick={paymentoptioncardClick}
              for="home"
              class="btn_radio_type"
            >
              Home &nbsp;
              <HomeIcon className="icon-delivery-address" />
            </label>

            <input
              className="check_payment"
              type="radio"
              name="delivery_type"
              id="work"
              value="work"
              onChange={(e) => locationOfDelivery(e.target.value)}
            />
            <label
              //onClick={paymentoptioncardClick}
              for="work"
              class="btn_radio_type"
            >
              Work &nbsp; <WorkIcon className="icon-delivery-address" />
            </label>

            <input
              className="check_payment"
              type="radio"
              name="delivery_type"
              id="others"
              value="others"
              onChange={(e) => locationOfDelivery(e.target.value)}
            />
            <label
              //onClick={paymentoptioncardClick}
              for="others"
              class="btn_radio_type"
            >
              Others &nbsp; <HomeIcon className="icon-delivery-address" />
            </label>
          </div>

          <div className="set-default">
            <Checkbox
              checked={state["is_default"] === "1"}
              onChange={(e) => onChangeSetDefault(e.target.value)}
            >
              {state["is_default"] === "1" ? "Default" : "Set To Default?"}
            </Checkbox>
          </div>

          <div
            style={{
              width: "100%",
            }}
          >
            <Button
              className="add-address-button"
              style={{ backgroundColor: "#302f31" }}
              onClick={onFormSubmit}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <div
          style={{
            width: "100%",
            marginLeft: "25px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
          >
            <Button
              onClick={onFormSubmit}
              style={{
                backgroundColor: "black",
                padding: "7px",
                color: "white",
                width: "90%",
                borderRadius: "10px",
              }}
            >
              Submit
            </Button>
          </div>
        </ModalFooter> */}
      </Modal>
    </>
  );
};
export default AddAddress;
