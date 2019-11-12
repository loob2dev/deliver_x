import {
  GET_COUNTRIES,
  GET_PARCELS,
  GET_CURRENCIES,
  GET_ALL_ADDRESS,
  GET_ALL_TRANSPORT_REQUESTS,
  REGISTER_NEW_REQUEST,
  GET_ALL_UNACCEPTED,
  GET_ALL_OWN_UNDELIVERIED_TRANSPORT_REQUESTS,
} from '../actions/ActionTypes';
import { set_coords } from './GeolocationAction';
import { get_no_response, auth_get, auth_post, auth_get_response } from '../../utils/httpRequest';

import api from '../../config/api';

export const update_last_location = coords => async (dispatch, getState) => {
  try {
    await get_no_response(api.update_last_Location + coords.latitude + '/' + coords.longitude);
    dispatch(set_coords(coords));
  } catch (error) {
    throw { api: 'updated_last_location', error: error };
  }
};

export const get_all_countries = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_countries, person_info.token);
    dispatch({ type: GET_COUNTRIES, payload: response });
  } catch (error) {
    throw { api: 'get_all_countries', error: error };
  }
};

export const get_all_parcels = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_parcels, person_info.token);
    dispatch({ type: GET_PARCELS, payload: response });
  } catch (error) {
    throw { api: 'get_all_parcels', error: error };
  }
};

export const get_all_currencies = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_currencies, person_info.token);
    dispatch({ type: GET_CURRENCIES, payload: response });
  } catch (error) {
    throw { api: 'get_all_currencies', error: error };
  }
};

export const get_all_address = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_address_book_items, person_info.token);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw { api: 'get_all_address', error: error };
  }
};

export const add_address = prams => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.create_address_book_items, person_info.token, prams);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw { api: 'add_address', error: error };
  }
};

export const delete_address = IDs => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.delete_address_book_item, person_info.token, IDs);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw { api: 'delete_address', error: error };
  }
};

export const get_all_transport_requests = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.get_all_transport_requests, person_info.token);
    dispatch({ type: GET_ALL_TRANSPORT_REQUESTS, payload: response });
  } catch (error) {
    throw { api: 'get_all_transport_requests', error: error };
  }
};

export const register_new_request = params => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.register_new_request, person_info.token, params);
    await set_current_request(response, person_info.token, dispatch);
  } catch (error) {
    throw { api: 'register_new_request', error: error };
  }
};

export const accept_transport_request_by_client = RequestID => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.accept_transport_request_by_client + RequestID, person_info.token);
    await set_current_request(response, person_info.token, dispatch);
  } catch (error) {
    throw { api: 'accept_transport_request_by_client', error: error };
  }
};

export const get_request = RequestID => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    let response = await auth_get(api.get_request + RequestID, person_info.token);
    await set_current_request(response, person_info.token, dispatch);
  } catch (error) {
    throw { api: 'get_request', error: error };
  }
};

const set_current_request = async (response, token, dispatch) => {
  let items = [];
  for (let i = 0; i < response.items.length; i++) {
    const element = response.items[i];
    if (element.parcelPicture == null) {
      element.parcelPicture = api.get_parcel_image + element.id;
    }
    items.push(element);
  }
  response.items = items;

  await dispatch({ type: REGISTER_NEW_REQUEST, payload: response });
};

export const get_all_unaccepted_by_transporter = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    setInterval(async () => {
      try {
        const response = await auth_get(api.get_all_unaccepted_by_transporter, person_info.token);
        // const response = await auth_post(api.get_all_transport_requests, person_info.token);
        dispatch({ type: GET_ALL_UNACCEPTED, payload: response });
      } catch (error) {
        throw { api: 'get_all_unaccepted_by_transporter', error: error };
      }
    }, 15000);
  } catch (error) {
    throw { api: 'get_all_unaccepted_by_transporter', error: error };
  }
};

export const accept_request = RequestID => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get_response(api.accept_request + RequestID, person_info.token);
    if (response && response.status !== 200) {
      throw { api: 'accept_request', error: response.status };
    }
  } catch (error) {
    throw { api: 'accept_request', error: error };
  }
};

export const reject_request = RequestID => async (dispatch, getState) => {
  const { person_info } = getState().login;
  console.log(api.reject_request + RequestID, person_info.token);
  try {
    const response = await auth_get_response(api.reject_request + RequestID, person_info.token);
    if (response && response.status !== 200) {
      throw { api: 'accept_request', error: response.status };
    }
  } catch (error) {
    throw { api: 'reject_request', error: error };
  }
};

export const load_pachages = TransportRequestID => async dispatch => {
  try {
    await get_no_response(api.reject_request + TransportRequestID);
  } catch (error) {
    throw { api: 'load_pachages', error: error };
  }
};

export const deliveried_pachage = Code => async dispatch => {
  try {
    const response = await auth_get(api.deliveried_pachage + Code);
    if (response.result === false) {
      throw { result: false };
    }
  } catch (error) {
    throw { api: 'deliveried_pachage', error: error };
  }
};

export const all_own_undelivered_transport_requests = () => async dispatch => {
  try {
    const response = await auth_get(api.all_own_undelivered_transport_requests);
    await dispatch({ type: GET_ALL_OWN_UNDELIVERIED_TRANSPORT_REQUESTS, payload: response });
  } catch (error) {
    // throw { api: 'all_own_undelivered_transport_requests', error: error };
  }
};
