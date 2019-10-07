import {
  createSelector
} from 'reselect';

const getStocks = state => state.stocks.stockList

const stocksSelector = createSelector(
  [getStocks],
  (stockList) => stockList
)

export {
  stocksSelector
}