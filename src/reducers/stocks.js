import {
  SET_STOCKS,
  UPDATE_STOCK_PRICE,
  SET_HOLDINGS,
  UPSERT_HOLDING,
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
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
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [
          payload,
          ...state.transactions
        ]
      }
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
      const newStockList = Object.keys(stockList).reduce((prev, stockKey) => {
        const stockTmp = payload[stockKey] ? payload[stockKey] : stockList[stockKey]
        // console.log('payload[stockKey]', payload[stockKey])
        // console.log({ stockTmp })
        prev[stockKey] = {
          ...stockTmp,
          name: stockList[stockKey].name,
          description: stockList[stockKey].description,
          companyname: stockList[stockKey].companyname,
          currency: stockList[stockKey].currency,
          price: parseFloat(stockTmp.close_price || stockTmp.price),
          priceUUID: stockTmp.priceUUID,
          timestamp: stockTmp.timestamp,
          change: parseFloat(stockTmp.change_price || stockTmp.change),
          changePercent: parseFloat(stockTmp.change_percent || stockTmp.changePercent),
          history: [],
          companylogo: stockList[stockKey].companylogo
        }
        return prev
      }, {})
      return {
        ...state,
        stockList: {
          ...newStockList
        }
      }
    default:
      return state;
  }
}
