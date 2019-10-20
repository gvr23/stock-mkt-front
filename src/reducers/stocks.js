import {
  SET_STOCKS,
  UPDATE_STOCK_PRICE,
  SET_HOLDINGS,
  UPSERT_HOLDING,
  SET_TRANSACTIONS,
  CONNECTED
} from '../constants';

const INITIAL_STATE = {
  stockList: {},
  holdings: {},
  connected: false,
  transactions: []
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: payload
      }
    case CONNECTED:
      return {
        ...state,
        connected: true
      }
    case UPSERT_HOLDING:
      if (payload.quantity == 0) {
        delete state.holdings[payload.stock_uuid]
        return {
          ...state,
          holdings: {
            ...state.holdings
          }
        }
      }
      return {
        ...state,
        holdings: {
          ...state.holdings,
          [payload.stock_uuid]: payload.quantity
        }
      }
    case SET_HOLDINGS:
      return {
        ...state,
        holdings: payload.reduce((prev, curr) => {
          prev[curr.stock_uuid] = curr["quantity"]
          return prev
        }, {}),
      }
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
            priceUUID: curr.last_price.uuid,
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
      console.log(stockList[payload.stock_uuid])

      stockList[payload.stock_uuid] = {
        ...stockList[payload.stock_uuid],
        price: payload.close_price,
        timestamp: payload.timestamp,
        change: payload.change_price,
        changePercent: payload.change_percent,
        priceUUID: payload.uuid,
        history: [
          ...stockList[payload.stock_uuid].history,
          {
            "uuid": payload.uuid,
            "close_price": payload.close_price,
            "timestamp": payload.timestamp,
            "change_price": payload.change_price,
            "change_percent": payload.change_percent
          }
        ]
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