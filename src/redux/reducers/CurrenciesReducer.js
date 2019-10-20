import { GET_CURRENCIES } from '../actions/ActionTypes';

const initialState = {};

const CurrenciesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENCIES:
      return action.payload;
    default:
      return state;
  }
};

export default CurrenciesReducer;
