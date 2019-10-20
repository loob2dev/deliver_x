import { GET_PARCELS } from '../actions/ActionTypes';

const initialState = {};

const ParcelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PARCELS:
      return action.payload;
    default:
      return state;
  }
};
export default ParcelsReducer;
