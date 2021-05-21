import Appheader from "../AppHeader/AppHeader";
import "../ManageAddress/ManageAddress.css";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { displayAddressModal } from "../../state-management/menu/actions";
import { useEffect } from "react";
import ChooseAddress from "../ChooseAddress/ChooseAddress";

const ManageAddress = () => {
  const menu = useSelector((state) => state.menu);
  useEffect(() => {
    dispatch(displayAddressModal(false));
  }, []);
  const dispatch = useDispatch();
  const callAddressModal = () => {
    dispatch(displayAddressModal(true));
  };
  return (
    <>
      <section
        className="parallax-window_myprofile "
        data-parallax="scroll"
        // data-image-src="https://cutt.ly/Kkb7BY9"
        style={{
          background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
          backgroundSize: "cover",
        }}
        data-natural-width={1400}
        data-natural-height={470}
      >
        {/* {/* <div id="subheader_myprofile">
          <div id="sub_content">
            <h1>Manage Address</h1>
          </div>
        </div> */}
      </section>
      <div id="address-container">
        <main class="main-container">
          <section className="add-address">
            <h5>Add Address</h5>
            <span
              onClick={() => callAddressModal()}
              style={{ cursor: "pointer" }}
            >
              <AddIcon />
            </span>
          </section>
        </main>
      </div>
      {menu.displayAddressModal ? <ChooseAddress /> : null}
    </>
  );
};
export default ManageAddress;
