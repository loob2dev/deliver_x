import {
  GET_COUNTRIES,
  GET_PARCELS,
  GET_CURRENCIES,
  GET_ALL_ADDRESS,
  GET_ALL_TRANSPORT_REQUESTS,
  REGISTER_NEW_REQUEST,
} from '../actions/ActionTypes';
import { set_coords } from './GeolocationAction';
import { get, auth_get, post, auth_post } from '../../utils/httpRequest';

import api from '../../config/api';

export const update_last_location = coords => async (dispatch, getState) => {
  try {
    await get(api.update_last_Location + coords.latitude + '/' + coords.longitude);
    dispatch(set_coords(coords));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const get_all_countries = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_countries, person_info.token);
    dispatch({ type: GET_COUNTRIES, payload: response });
  } catch (error) {
    throw error;
  }
};

export const get_all_parcels = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_parcels, person_info.token);
    dispatch({ type: GET_PARCELS, payload: response });
  } catch (error) {
    throw error;
  }
};

export const get_all_currencies = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_parcels, person_info.token);
    dispatch({ type: GET_CURRENCIES, payload: response });
  } catch (error) {
    throw error;
  }
};

export const get_all_address = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_get(api.get_all_address_book_items, person_info.token);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw error;
  }
};

export const add_address = prams => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.create_address_book_items, person_info.token, prams);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw error;
  }
};

export const delete_address = IDs => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.delete_address_book_item, person_info.token, IDs);
    dispatch({ type: GET_ALL_ADDRESS, payload: response });
  } catch (error) {
    throw error;
  }
};

export const get_all_transport_requests = () => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.get_all_transport_requests, person_info.token);
    dispatch({ type: GET_ALL_TRANSPORT_REQUESTS, payload: response });
  } catch (error) {
    throw error;
  }
};

export const register_new_request = params => async (dispatch, getState) => {
  const { person_info } = getState().login;
  try {
    const response = await auth_post(api.register_new_request, person_info.token, params);
    dispatch({ type: REGISTER_NEW_REQUEST, payload: response });
  } catch (error) {
    throw error;
  }
};

export const accept_transport_request_by_client = RequestID => async (dispatch, getState) => {
  const { person_info } = getState().login;
  const { transport_request_dto } = getState().register_parcel;
  console.log('accept_transport', api.accept_transport_request_by_client + RequestID);
  try {
    const response = await auth_get(api.accept_transport_request_by_client + RequestID, person_info.token);
    dispatch({ type: REGISTER_NEW_REQUEST, payload: response });
  } catch (error) {
    throw error;
  }
};
