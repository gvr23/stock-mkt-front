import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import {
  setRanking,
  setStocks

} from '../../actions'
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { numberWithCommas } from '../../utils';
import { stocksSelector, rankingSelector } from '../../selectors/stocks';
import { store } from 'react-notifications-component'


class AdminRanking extends Component {
  constructor(props) {
    super(props)

  }
  async componentDidMount() {
    const { data } = await Axios.post(API_URL, {
      query: `{
        stocks {
          uuid
          name
          description
          companyname
          companylogo
          currency
          last_price {
            uuid
            close_price
            timestamp(format: "DD/MM/YYYY @ HH:mm")
            change_price
            change_percent
          }
          stock_price_history {
            uuid
            close_price
            timestamp(format: "DD/MM/YYYY @ HH:mm")
            change_price
            change_percent
          }
        }
        users {
          uuid
          username
          admin
          balance
          
          holdings{
          stock_uuid
          user_uuid
          quantity
          user {
            uuid
            uuid
          }
          stock {
            uuid
            name
            description
            companyname
            quantity
            currency
            last_price {
              close_price
              change_price
              change_percent
            }
          } 
          }
        }
      }
      `
    })
    if (!data.errors) {
      this.props.setStocks(data.data.stocks)
      this.props.setRanking(data.data.users)
    }
  }
  calculateTotalHoldings(holdings) {
    return holdings.reduce((prev, curr) => {
      if (this.props.stockList[curr["stock_uuid"]].currency === 'USD') {
        prev.usd += curr.quantity * this.props.stockList[curr["stock_uuid"]].price
        return prev
      } else {
        prev.pen += curr.quantity * this.props.stockList[curr["stock_uuid"]].price
        return prev

      }

    }, { usd: 0, pen: 0 })
  }
  render() {
    // if(Object.keys(stockList))
    return <div
      style={{
        flex: '1 1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {this.props.ranking.map((user) => {
        // const totals = this.calculateTotalHoldings(user.holdings)
        return <div className="_user" key={user.uuid}>
          <div
            className="header"
          >
            <h1
            >{user.username}</h1>
          </div>
          <div
            className="content"
          >
            <div
              className="left"
            >
            </div>
            <div
              className="right"
            >
              <div
                style={{
                  flex: 1,
                }}
              >

              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  className="_amounts"
                >
                  {/* <table>
                <thead>
                
                </thead>
              </table> */}
                  <Button
                    className={`is-danger is-outlined _balance`}
                    text={<p><span>Balance:</span> <strong>{numberWithCommas(user.balance)} USD</strong></p>}
                  />
                  <Button
                    className={`is-primary is-outlined _total_holdings_value`}
                    text={<p><span>Total acciones moneda nacional:</span> <strong>{numberWithCommas(user.totals.pen.toFixed(2))} PEN</strong></p>}
                  />
                  <Button
                    className={`is-primary is-outlined _total_holdings_value`}
                    text={<p><span>Total acciones moneda extranjera:</span> <strong>{numberWithCommas(user.totals.usd.toFixed(2))} USD</strong></p>}
                  />
                  <Button

                    className={`is-primary is-outlined _total`}
                    text={<p><span>Total de cartera:</span> <strong>{numberWithCommas((user.balance + user.totals.usd + (user.totals.pen / this.props.exchangeRate)).toFixed(2))}</strong></p>}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      })}
    </div>
  }
}

const mapStateToProps = state => {
  // const { ranking } = state.admin
  const stockList = stocksSelector(state)
  return {
    stockList,
    ranking: rankingSelector(state),
    exchangeRate: state.app.exchangeRate,
  }
}

export default connect(mapStateToProps, {
  setRanking,
  setStocks
})(AdminRanking);

