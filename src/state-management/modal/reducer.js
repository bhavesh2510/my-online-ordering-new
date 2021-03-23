import * as actionTypes from './actionTypes';
const initialState = {
  modal: {
    modalToShow: "",
    state: {
      addAddress:false,
    },
    successCallback: null,
  },
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_MODAL: {
      return {
        ...state,
        modal: {
          modalToShow: action.modalName,
          state: action.modalState || {},
          successCallback: action.successCallback,
          failureCallback: action.failureCallback,
        },
      };
    }

    case actionTypes.CLOSE_MODAL: {
      return {
        ...state,
        modal: {
          modalToShow: '',
          state: {},
          successCallback: undefined,
          failureCallback: undefined,
        },
      };
    }
    default:
      return state;
  }
};

export default modalReducer;