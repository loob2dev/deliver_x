import { Platform } from 'react-native';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { SET_GEOLOCATION, GET_GEO_CODE } from '../actions/ActionTypes';

import key from '../../config/api_keys';

export const set_coords = coords => async (dispatch, getState) => {
  dispatch({
    type: SET_GEOLOCATION,
    payload: coords,
  });
};

export const get_geo_code = () => async (dispatch, getState) => {
  const { coords } = getState().geolocation;
  const geo_code = {};
  console.log('geo_code', geo_code);
  Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios) : RNGeocoder.fallbackToGoogle(key.google_map_android);
  RNGeocoder.geocodePosition({ lat: coords.latitude, lng: coords.longitude }).then(res => {
    console.log(res);
    res.forEach((item, index) => {
      geo_code.address_name = item.formattedAddress != null ? item.formattedAddress : geo_code.address_name;
      geo_code.email = null;
      geo_code.phone = null;
      geo_code.street = item.streetName != null ? item.streetName : geo_code.street;
      geo_code.street_nr = item.streetNumber != null ? item.streetNumber : geo_code.street_nr;
      geo_code.city = item.locality != null ? item.locality : geo_code.city;
      geo_code.postal_code = item.postalCode != null ? item.postalCode : geo_code.postal_code;
      geo_code.country = item.country != null ? item.country : geo_code.country;
      if (index + 1 === res.length) {
        Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios) : Geocoder.init(key.google_map_android);
        Geocoder.from(coords.latitude, coords.longitude).then(json => {
          json.results.forEach(array_component => {
            array_component.types.forEach(type => {
              if (type === 'country') {
                geo_code.country = array_component.formatted_address;
              }
              if (type === 'street_address') {
                array_component.address_components.forEach(item_address => {
                  item_address.types.forEach(type_address => {
                    if (type_address === 'postal_code') {
                      geo_code.postal_code = item_address.long_name;
                    }
                  });
                });
              }
            });
          });
        });
      }
    });
    console.log('GET_GEO_CODE', geo_code);
    dispatch({ type: GET_GEO_CODE, payload: geo_code });
  });
};
