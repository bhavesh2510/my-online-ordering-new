import Appheader from "../AppHeader/AppHeader";
import "../ManageAddress/ManageAddress.css";
import { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { displayAddressModal } from "../../state-management/menu/actions";
import { openModal } from "../../state-management/modal/actions";
import AddAddress from "../ChooseAddress/AddAddress";
import ChooseAddress from "../ChooseAddress/ChooseAddress";
import img1 from "./Regular-1.5px-edit@3x.png";
import img2 from "./Regular-1.5px-trash@3x.png";
import img3 from "./Light-1px-add_circled@3x.png";
import {
  fetchAddressesList,
  fetchMyOrderList,
  postAddAddress,
  removeAddress,
} from "../../state-management/user/asyncActions";

import Address from "../ManageAddress/Address";

const ManageAddress = (props) => {
  const menu = useSelector((state) => state.menu);
  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const [handleadd, sethandleadd] = useState(false);

  const modalNames = {
    ADD_ADDRESS: "AddAddress",
    CHOOSE_ADDRESS: "ChooseAddress",
    FIND_ADDRESS: "findAddress",
  };

  const [state, setState] = useState({
    name: "",
    addresses: [],
  });
  useEffect(async () => {
    const { payload } = await dispatch(fetchAddressesList(user.user.clientId));

    setState({ ...state, addresses: payload.data });
    sethandleadd(false);
  }, [handleadd]);
  useEffect(() => {
    dispatch(displayAddressModal(false));
    fetchAddressList();
  }, []);
  const dispatch = useDispatch();
  const [frompayment, setfrompayment] = useState(false);

  const fetchAddressList = async () => {
    const { payload } = await dispatch(fetchAddressesList(user.user.clientId));

    setState({ ...state, addresses: payload.data });
  };

  const handleAddDeliveryAddressSuccess = (editMode, address) => {
    dispatch(
      openModal(
        modalNames.ADD_ADDRESS,
        {
          editMode,
          address,
          existingDefaultAddress: this.state.addresses.find(
            (addr) => addr["is_default"] === "1"
          ),
        },
        fetchAddressList()
      )
    );
  };

  const callAddressModal = (editMode = false, address = {}) => {
    if (!editMode) {
      dispatch(displayAddressModal(true));
      dispatch(
        openModal(
          modalNames.FIND_ADDRESS,
          {
            addAddress: true,
            existingDefaultAddress:
              state.addresses &&
              state.addresses.find((addr) => addr["is_default"] === "1"),
          },
          () => handleAddDeliveryAddressSuccess(editMode, address)
        )
      );
    } else {
      dispatch(
        openModal(modalNames.ADD_ADDRESS, {
          editMode,
          address,
          existingDefaultAddress: state.addresses.find(
            (addr) => addr["is_default"] === "1"
          ),
        })
      );
      fetchAddressList();
    }
  };

  const handleRemove = (address) => {
    dispatch(removeAddress({ id: address.id }));
    fetchAddressList();
  };

  const handleSetDefault = async (address) => {
    if (address["is_default"] === "1") {
      await dispatch(
        postAddAddress(
          {
            ...address,
            address12: address.address2,
            is_default: "0",
          },
          true
        )
      );
      fetchAddressList();
      //window.location.reload();
    } else {
      const existingDefaultAddress = state.addresses.find(
        (addr) => addr["is_default"] === "1"
      );

      if (existingDefaultAddress) {
        await dispatch(
          postAddAddress(
            {
              ...existingDefaultAddress,
              address12: existingDefaultAddress.address2,
              is_default: "0",
            },
            true
          )
        );
      }
      await dispatch(
        postAddAddress(
          {
            ...address,
            address12: address.address2, //TODO: get this fixed from api, which is broken at them moment
            is_default: "1",
          },
          true
        )
      );
      fetchAddressList();
      //window.location.reload();
    }
  };

  const [countOfAddress, setcountOfAddress] = useState(false);

  useEffect(() => {
    console.log("add in map", state.addresses.length);

    if (state.addresses.length == 0) {
      setcountOfAddress(true);
    } else if (state.addresses.length >= 1) {
      setcountOfAddress(false);
    }
  }, [state]);

  useEffect(() => {
    console.log("count of address", countOfAddress);
  }, [countOfAddress]);

  return (
    <>
      <div id='address-container'>
        <main class='main-container customised-main-container'>
          <div
            // className='add-address-for-mobile hide-on-desktop'
            className={
              countOfAddress
                ? "css-for-single-address css-for-single-address-mobile-text hide-on-desktop"
                : "add-address-for-mobile hide-on-desktop"
            }
            onClick={() => callAddressModal(false, {})}
          >
            <p className='add-for-mobile-text'>Add Address</p>
          </div>
          <section
            className='add-address hide-on-mobile'
            onClick={() => callAddressModal(false, {})}
          >
            <span style={{ cursor: "pointer" }}>
              <img src={img3} style={{ height: "30px", width: "30px" }} />
            </span>
            <span
              style={{
                whiteSpace: "nowrap",
                marginTop: "10px",
                fontWeight: "700",
                color: "rgb(168, 166, 170)",
              }}
            >
              Add an address
            </span>
          </section>

          {state.addresses.map((address, i) => {
            return (
              <>
                <section
                  className='address-section'
                  // key={i}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      onClick={() => callAddressModal(true, address)}
                      style={{
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        marginTop: "-4px",
                        marginLeft: "70%",
                        marginRight: "10px",
                      }}
                    >
                      <img
                        src={img1}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "60%",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        cursor: "pointer",
                        marginTop: "-4px",
                        marginLeft: "10px",
                      }}
                    >
                      <img
                        onClick={() => handleRemove(address)}
                        src={img2}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "10%",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "-15px" }}>
                    <Address address={address} key={i} />
                    <p
                      className={`actions ${
                        address["is_default"] === "1" ? "default" : ""
                      }`}
                      style={{ marginLeft: "60%" }}
                      onClick={() => handleSetDefault(address)}
                    >
                      {" "}
                      {address["is_default"] === "1" ? (
                        <span
                          className='default-address'
                          style={{ marginLeft: "30%" }}
                        >
                          Default
                        </span>
                      ) : (
                        "Set default"
                      )}
                    </p>
                  </div>
                  <ul className='address-actions'>
                    {/* <li onClick={() => callAddressModal(true, address)}>
                      <span>
                        <h5
                          className="actions"
                          style={{ backgroundColor: "#6244da" }}
                        >
                          Edit
                        </h5>
                      </span>
                    </li> */}
                    {/* <li onClick={() => handleRemove(address)}>
                      <span>
                        <h5
                          className="actions"
                          style={{ backgroundColor: "#6244da" }}
                        >
                          Remove
                        </h5>
                      </span>
                    </li> */}
                    {/* <li>
                      <span onClick={() => handleSetDefault(address)}>
                        <h5
                          className={`actions ${
                            address["is_default"] === "1" ? "default" : ""
                          }`}
                        >
                          {address["is_default"] === "1" ? (
                            <span className="default-address">Default</span>
                          ) : (
                            "Set default"
                          )}
                        </h5>
                      </span>
                    </li> */}
                  </ul>
                </section>
              </>
            );
          })}
        </main>
      </div>
      {modal.modal.modalToShow == "findAddress" ? (
        <ChooseAddress
          refetchAddresses={sethandleadd}
          bool='no'
          isItFromCheckout={setfrompayment}
        />
      ) : null}
      {modal.modal.modalToShow == "AddAddress" ? <AddAddress /> : null}
    </>
  );
};
export default ManageAddress;
