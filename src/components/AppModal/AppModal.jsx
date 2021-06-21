import React, { Suspense } from "react";
import { connect } from "react-redux";
import { closeModal } from "../../state-management/modal/actions";
import { modalNames } from "./constants";
import "./AppModal.css";

const DishModal = React.lazy(() =>
  import("../../containers/Modals/DishModal/DishModal")
);
const IntermediateAddModal = React.lazy(() =>
  import("../../containers/Modals/DishModal/IntermediateAddModal")
);
const PizzaDetailsForChekout = React.lazy(() =>
  import("../Checkout/PizzaDetailsForCheckout")
);
// const IntermediateRemoveItemsModal = React.lazy(() =>
//   import("../Modals/IntermediateRemoveItemsModal")
// );
// const AddPaymentCard = React.lazy(() => import("../Modals/AddPaymentCard"));
// const PaymentCards = React.lazy(() => import("../Modals/PaymentCards"));
// const AddAddress = React.lazy(() => import("../Modals/Addresses/AddAddress"));
// const ChooseAddress = React.lazy(() => import("../Modals/ChooseAddress"));
// const FindAddress = React.lazy(() => import("../Modals/FindAddressModal"));
const PizzaModal = React.lazy(() =>
  import("../../containers/Modals/PizzaModal/PizzaModal")
);

export class AppModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modalContent: this.getModalContentComponent() };
    this.modalRef = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.modalToShow !== prevProps.modalToShow) {
      this.setState({ modalContent: this.getModalContentComponent() });
    }
  }

  getModalContentComponent() {
    const { modalToShow } = this.props;

    switch (modalToShow) {
      case modalNames.DISH_MODAL:
        return DishModal;
      case modalNames.INTERMEDIATE_ADD_MODAL:
        return IntermediateAddModal;
      case modalNames.RENDER_PIZZADETAILS_CHECKOUT:
        return PizzaDetailsForChekout;
      //   case modalNames.INTERMEDIATE_REMOVE_ITEMS_MODAL:
      //     return IntermediateRemoveItemsModal;
      //   case modalNames.ADD_CARDS:
      //     return AddPaymentCard;
      //   case modalNames.CHOOSE_CARDS:
      //     return PaymentCards;
      //   case modalNames.ADD_ADDRESS:
      //     return AddAddress;
      //   case modalNames.CHOOSE_ADDRESS:
      //     return ChooseAddress;
      //   case modalNames.FIND_ADDRESS:
      //     return FindAddress;
      case modalNames.PIZZA_MODAL:
        return PizzaModal;
      default:
        return null;
    }
  }

  render() {
    const { modalContent: ModalContent } = this.state;
    console.log("modal content", ModalContent);

    return (
      !!this.props.modalToShow && (
        <div
          className={` ${
            this.props.modalToShow && this.props.modalToShow.toLowerCase()
          }`}
        >
          <div className="modal-content">
            <Suspense
              fallback={<div style={{ padding: "20px" }}> Loading ... </div>}
            >
              {ModalContent && (
                <>
                  <ModalContent
                    modalState={this.props.modalState}
                    onCloseModal={this.props.closeModal}
                    toggle={this.props.closeModal}
                    successCallback={this.props.successCallback}
                    failureCallback={this.props.failureCallback}
                  />
                </>
              )}
            </Suspense>
          </div>
        </div>
      )
    );
  }
}

function mapStateToProps({ modal: { modal }, menu }) {
  return {
    modalToShow: modal.modalToShow,
    modalState: modal.state,
    successCallback: modal.successCallback,
    failureCallback: modal.failureCallback,
    displayAddressModal: menu.displayAddressModal,
  };
}

const mapDispatchToProps = { closeModal };

export default connect(mapStateToProps, mapDispatchToProps)(AppModal);
