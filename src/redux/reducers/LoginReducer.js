import { SET_PERSION_INFO } from '../actions/ActionTypes';

const initialState = {
  person_info: {
    email: 'del_x@com',
    mobilePhoneNr: null,
    token: null,
    deviceID: null,
    transporter: null,
  },
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PERSION_INFO:
      return { ...state, person_info: action.payload };
    default:
      return state;
  }
};

export default LoginReducer;
