import { GET_ALL_UNACCEPTED, GET_ALL_OWN_UNDELIVERIED_TRANSPORT_REQUESTS } from '../actions/ActionTypes';

const initialState = {
  all_unaccepted: [],
  all_own_undelivered_transport_requests: [],
};

const RegisterParcelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_UNACCEPTED:
      return { ...state, all_unaccepted: action.payload };
    case GET_ALL_OWN_UNDELIVERIED_TRANSPORT_REQUESTS:
      return { ...state, all_own_undelivered_transport_requests: action.payload };
    default:
      return state;
  }
};

export default RegisterParcelReducer;
