import * as actionTypes from './actionTypes';

export function openModal(
  modalName,
  modalState,
  successCallback,
  failureCallback,
) {
  return {
    type: actionTypes.OPEN_MODAL,
    modalName,
    modalState,
    successCallback,
    failureCallback,
  };
}

export function closeModal() {
  return { type: actionTypes.CLOSE_MODAL };
}