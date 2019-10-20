import { SET_RANKING } from '../constants';

const INITIAL_STATE = {
  ranking: []
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case SET_RANKING:
      return {
        ...state,
        ranking: payload,
      }
    default:
      return state;
  }
}