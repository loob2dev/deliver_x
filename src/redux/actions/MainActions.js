import { SET_PERSION_INFO } from '../actions/ActionTypes';

export const set_person_info = info => {
  console.log(info);
  return {
    type: SET_PERSION_INFO,
    payload: info,
  };
};
