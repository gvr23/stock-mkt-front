import {
  SET_STOCKS,
  UPDATE_STOCK_PRICE,
  SET_HOLDINGS,
  CONNECTED,
  SET_TRANSACTIONS
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

export const setConnected = _ => ({
  type: CONNECTED
})

export const setTransactions = payload => ({
  type: SET_TRANSACTIONS,
  payload
})