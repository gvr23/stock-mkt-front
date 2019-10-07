import {
  SET_STOCKS, UPDATE_STOCK_PRICE
} from '../constants';

const INITIAL_STATE = {
  stockList: {}
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case SET_STOCKS:
      return {
        ...state,
        stockList: payload.reduce((prev, curr) => {
          prev[curr.uuid] = {
            name: curr.name,
            description: curr.description,
            companyname: curr.companyname,
            currency: curr.currency,
            price: curr.last_price.close_price,
            timestamp: curr.last_price.timestamp,
            change: curr.last_price.change_price,
            changePercent: curr.last_price.change_percent,
            history: curr.stock_price_history,
            companylogo: curr.companylogo
          }
          return prev
        }, {})
      }
    case UPDATE_STOCK_PRICE:
      const { stockList } = state
      stockList[payload.stock_uuid] = {
        ...stockList[payload.stock_uuid],
        price: payload.close_price,
        timestamp: payload.timestamp,
        change: payload.change_price,
        changePercent: payload.change_percent
      }
      return {
        ...state,
        stockList: {
          ...stockList
        }
      }
    default:
      return state;
  }
}