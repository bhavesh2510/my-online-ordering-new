import Appheader from "../AppHeader/AppHeader";
import "../ManageAddress/ManageAddress.css";
import { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { displayAddressModal } from "../../state-management/menu/actions";
import { openModal } from "../../state-management/modal/actions";
import AddAddress from "../ChooseAddress/AddAddress";
import ChooseAddress from "../ChooseAddress/ChooseAddress";
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
    props.refetchAddresses(false);
  }, [props.refetchAddresses]);
  useEffect(() => {
    dispatch(displayAddressModal(false));
    fetchAddressList();
  }, []);
  const dispatch = useDispatch();

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
    }
  };

  return (
    <>
      <div id="address-container">
        <main class="main-container">
          <section className="add-address">
            <h5>Add Address</h5>
            <span
              onClick={() => callAddressModal(false, {})}
              style={{ cursor: "pointer" }}
            >
              <AddIcon />
            </span>
          </section>

          {state.addresses.map((address, i) => {
            console.log("add", address);
            return (
              <>
                <section
                  className="address-section"
                  // key={i}
                >
                  <Address address={address} key={i} />
                  <ul className="address-actions">
                    <li onClick={() => callAddressModal(true, address)}>
                      <span>
                        <h5 className="actions">Edit</h5>
                      </span>
                    </li>
                    <li onClick={() => handleRemove(address)}>
                      <span>
                        <h5 className="actions">Remove</h5>
                      </span>
                    </li>
                    <li>
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
                    </li>
                  </ul>
                </section>
              </>
            );
          })}
        </main>
      </div>
      {modal.modal.modalToShow == "findAddress" ? (
        <ChooseAddress refetchAddresses={props.refetchAddresses} />
      ) : null}
      {modal.modal.modalToShow == "AddAddress" ? (
        <AddAddress refetchAddresses={props.refetchAddresses} />
      ) : null}
    </>
  );
};
export default ManageAddress;
