import { combineReducers } from 'redux';

import login from './LoginReducer';
import countries from './CountriesReducer';
import parcels from './ParcelsReducer';
import currencies from './CurrenciesReducer';
import geolocation from './GeolocationReducer';

import register_parcel from './RegisterParcelReducer';

const reducer = combineReducers({
  geolocation,
  countries,
  parcels,
  currencies,
  login,
  register_parcel,
});

export default reducer;
