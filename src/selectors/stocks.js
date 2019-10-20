import {
  createSelector
} from 'reselect';

const getStocks = state => state.stocks.stockList
const getRanking = state => state.admin.ranking
const getStockList = state => state.stocks.stockList
const getExchangeRate = state => state.app.exchangeRate

const rankingSelector = createSelector(
  [getRanking, getStockList, getExchangeRate],
  (ranking, stockList, exchangeRate) => {

    return ranking.map((user) => {
      return {
        ...user,
        totals: user.holdings.reduce((prev, curr) => {
          if (stockList[curr["stock_uuid"]].currency === 'USD') {
            prev.usd += curr.quantity * stockList[curr["stock_uuid"]].price
            return prev
          } else {
            prev.pen += curr.quantity * stockList[curr["stock_uuid"]].price
            return prev

          }

        }, { usd: 0, pen: 0 })
      }
    }).sort((a, b) => {
      return (b.totals.usd + b.balance + (b.totals.pen / exchangeRate)) - (a.totals.usd + a.balance + (a.totals.pen / exchangeRate))
    })

  }
)


const stocksSelector = createSelector(
  [getStocks],
  (stockList) => stockList
)



export {
  stocksSelector,
  rankingSelector
}