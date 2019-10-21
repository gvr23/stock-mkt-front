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
        flexDirection: 'column'
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flex: 4 }}>
              <article className="message is-info" style={{ flex: 1, marginRight: '1%', height: '5%' }}>
                <div className="message-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Balance</p>
                </div>
                <div className="message-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4FAFF' }}><strong>{numberWithCommas(user.balance)} USD</strong></div>
              </article>

              <article className="message is-link" style={{ flex: 1, marginRight: '1%', height: '5%' }}>
                <div className="message-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Acciones nacionales</p>
                </div>
                <div className="message-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8EFFF' }}><strong>{numberWithCommas(user.totals.pen.toFixed(2))} PEN</strong></div>
              </article>

              <article className="message is-primary" style={{ flex: 1, marginRight: '1%', height: '5%' }}>
                <div className="message-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p className="is-size-6">Acciones extranjeras</p>
                </div>
                <div className="message-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d4daf7' }}><strong>{numberWithCommas(user.totals.usd.toFixed(2))} USD</strong></div>
              </article>

              <article className="message is-success" style={{ flex: 1, height: '5%' }}>
                <div className="message-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Total</p>
                </div>
                <div className="message-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D8F9DA' }}><strong>{numberWithCommas((user.balance + user.totals.usd + (user.totals.pen / this.props.exchangeRate)).toFixed(2))}</strong></div>
              </article>
            </div>

          {/*  <div
              className="right"
            >
              <div
                style={{flex: 1}}
              >
                <article className="message is-dark">
                  <div className="message-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p>Balance</p>
                  </div>
                  <div className="message-body"><strong>{numberWithCommas(user.balance)} USD</strong></div>
                </article>
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  className="_amounts"
                >
                   <table>
                <thead>
                
                </thead>
              </table>
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
            </div>*/}
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

