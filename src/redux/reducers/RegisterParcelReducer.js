import { GET_ALL_ADDRESS, GET_ALL_TRANSPORT_REQUESTS, REGISTER_NEW_REQUEST } from '../actions/ActionTypes';

const initialState = {
  addresses: [],
  requests: [],
  transport_request_dto: {},
};

const RegisterParcelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ADDRESS:
      return { ...state, addresses: action.payload };
    case GET_ALL_TRANSPORT_REQUESTS:
      return { ...state, requests: action.payload };
    case REGISTER_NEW_REQUEST:
      return { ...state, transport_request_dto: action.payload };
    default:
      return state;
  }
};

export default RegisterParcelReducer;
