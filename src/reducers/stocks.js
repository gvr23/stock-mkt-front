import {
  SET_STOCKS
} from '../constants';

const INITIAL_STATE = {
  stockList: {}
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case SET_STOCKS:
      console.log({ payload })
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
    default:
      return state;
  }
}