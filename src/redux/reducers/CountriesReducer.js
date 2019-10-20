import { GET_COUNTRIES } from '../actions/ActionTypes';

const initialState = {};

const CountriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COUNTRIES:
      return action.payload;
    default:
      return state;
  }
};
export default CountriesReducer;
