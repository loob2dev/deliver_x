import { GET_ALL_ADDRESS, GET_ALL_TRANSPORT_REQUESTS } from '../actions/ActionTypes';

const initialState = {
  addresses: [],
  requests: [],
};

const RegisterParcelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ADDRESS:
      return { ...state, addresses: action.payload };
    case GET_ALL_TRANSPORT_REQUESTS:
      return { ...state, requests: action.payload };
    default:
      return state;
  }
};

export default RegisterParcelReducer;
