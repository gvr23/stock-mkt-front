import {
  SET_STOCKS,
  UPDATE_STOCK_PRICE,
  SET_HOLDINGS
} from "../constants";

export const setStocks = (payload) => ({
  type: SET_STOCKS,
  payload,
})

export const updatePrice = (payload) => ({
  type: UPDATE_STOCK_PRICE,
  payload,
})

export const setHoldings = (payload) => ({
  type: SET_HOLDINGS,
  payload,
})