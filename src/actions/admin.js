import { SET_RANKING } from "../constants/admin";

export const setRanking = payload => ({
  type: SET_RANKING,
  payload,
})