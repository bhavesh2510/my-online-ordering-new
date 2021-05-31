// import React, { Suspense, useState } from "react";
// import { connect } from "react-redux";
// import { closeModal } from "../../state-management/modal/actions";
// import AddAddress from "../ChooseAddress/AddAddress";
// import ChooseAddress from "../ChooseAddress/ChooseAddress";

// const AppModal = () => {
//   const modalNames = {
//     ADD_ADDRESS: "AddAddress",
//     CHOOSE_ADDRESS: "ChooseAddress",
//     FIND_ADDRESS: "findAddress",
//   };
//   const modal = useSelector((state) => state.modal);
//   const dispatch = useDispatch();

//   const state = useState({
//     modalContent: getModalContentComponent(),
//     modalRef: null,
//   });

//   //   useEffect(()=>{
//   //     if (modal.modal.modalToShow !== prevProps.modalToShow) {
//   //         setState({ ...state,modalContent: getModalContentComponent() });
//   //       }
//   //   }, []);

//   const getModalContentComponent = () => {
//     const { modalToShow } = modal.modal.modalToShow;

//     switch (modalToShow) {
//       //   case modalNames.DISH_MODAL:
//       //     return DishModal;
//       //   case modalNames.INTERMEDIATE_ADD_MODAL:
//       //     return IntermediateAddModal;
//       //   case modalNames.INTERMEDIATE_REMOVE_ITEMS_MODAL:
//       //     return IntermediateRemoveItemsModal;
//       //   case modalNames.ADD_CARDS:
//       //     return AddPaymentCard;
//       //   case modalNames.CHOOSE_CARDS:
//       //     return PaymentCards;
//       case modalNames.ADD_ADDRESS:
//         return <AddAddress />;
//       case modalNames.CHOOSE_ADDRESS:
//         return <ChooseAddress />;
//       //   case modalNames.FIND_ADDRESS:
//       //     return FindAddress;
//       //   case modalNames.PIZZA_MODAL:
//       //     return PizzaModal;
//       default:
//         return null;
//     }
//   };
//   const { modalContent: ModalContent } = state;
//   return (
//     <>
//       <div
//         className={`app-modal ${
//           modal.modal.modalToShow && modal.modal.modalToShow.toLowerCase()
//         }`}
//       >
//         <div className="modal-content">
//           <Suspense
//             fallback={<div style={{ padding: "20px" }}> Loading ... </div>}
//           >
//             {ModalContent && (
//               <ModalContent
//                 modalState={modal.modal.modalState}
//                 onCloseModal={() => dispatchEvent(closeModal())}
//                 successCallback={modal.modal.successCallback}
//                 //failureCallback={this.props.failureCallback}
//               />
//             )}
//           </Suspense>
//         </div>
//       </div>
//     </>
//   );
// };
// export default AppModal;

// // function mapStateToProps({ modal: { modal }, menu }) {
// //   return {
// //     modalToShow: modal.modalToShow,
// //     modalState: modal.state,
// //     successCallback: modal.successCallback,
// //     failureCallback: modal.failureCallback,
// //     displayAddressModal: menu.displayAddressModal,
// //   };
// // }

// // const mapDispatchToProps = { closeModal };

// // export default connect(mapStateToProps, mapDispatchToProps)(AppModal);
