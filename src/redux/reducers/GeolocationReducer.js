import { SET_GEOLOCATION, GET_GEO_CODE } from '../actions/ActionTypes';

const initialState = {
  coords: {
    latitude: 49.8175,
    longitude: 15.473,
  },
  geo_code: {
    address_name: null,
    street: null,
    street_nr: null,
    city: null,
    postal_code: null,
    country: null,
  },
};

const GeolocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GEOLOCATION:
      return { ...state, coords: action.payload };
    case GET_GEO_CODE:
      return { ...state, geo_code: action.payload };
    default:
      return state;
  }
};

export default GeolocationReducer;
