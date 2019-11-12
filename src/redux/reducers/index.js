import { combineReducers } from 'redux';

import login from './LoginReducer';
import countries from './CountriesReducer';
import parcels from './ParcelsReducer';
import currencies from './CurrenciesReducer';
import geolocation from './GeolocationReducer';

import register_parcel from './RegisterParcelReducer';
import transporter from './TransporterReducer';

const reducer = combineReducers({
  geolocation,
  countries,
  parcels,
  currencies,
  login,
  register_parcel,
  transporter,
});

export default reducer;
