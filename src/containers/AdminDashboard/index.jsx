import React from 'react'
import {connect} from 'react-redux';
import Axios from 'axios';
import {
    setStocks
} from '../../actions'
import {stocksSelector} from '../../selectors';
import Card from '../../components/Card';
import Icon from "../../components/Icon";

class AdminDashboard extends React.Component {
    async componentDidMount() {
        const {data} = await Axios.post(API_URL, {
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
          }
          `
        })
        if (!data.errors) {
            this.props.setStocks(data.data.stocks)
        }

        this.setState({
            loading: false,
        })
    }

    renderStocks(stockList) {
        return Object.keys(stockList).map((stockKey) => {
            // const stock = stockList[stockKey]
            return <Card
                onBuy={() => this.setState({showBuy: true, stockToBuy: stockKey})}
                key={stockKey}
                item={stockList[stockKey]}
                screen={true}
            />
        })
    }

    render() {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: window.innerHeight - 50,
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: window.innerHeight - 50 - ((window.innerHeight - 50) * 0.8)
                }}
            >
                {/* <h2>Notices</h2> */}
            </div>
            {/*<div
        style={{
          flex: 4,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          height: window.innerHeight - 50 - ((window.innerHeight - 50) * 0.2)
        }}
      >*/}
            {/*{this.renderStocks(this.props.stockList)}*/}
            <table className="table">
                <thead>
                <tr>
                    <th className="is-size-4">Razón Social</th>
                    <th className="is-size-4">Nombre Comercial</th>
                    <th className="is-size-4">Moneda</th>
                    <th className="is-size-4">Precio</th>
                    <th className="is-size-4">Desviación</th>
                    <th className="is-size-4">Cambio %</th>
                    <th className="is-size-4">Logo</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.values(this.props.stockList).map(item => {
                        return (
                            <tr valign="middle">
                                <td className="is-size-4"><strong>{item.name}</strong></td>
                                <td className="is-size-4">{item.companyname}</td>
                                <td className="is-size-4">{item.currency}</td>
                                <td className="is-size-4">{parseFloat(item.price).toFixed(2)}</td>
                                <td className="is-size-4">{item.changePercent}</td>
                                <td className="is-size-4">
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Icon
                                            className={`fa-2x${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}
                                            name={item.changePercent > 0 ? 'arrow-circle-up' : item.changePercent == 0 ? 'minus-circle' : 'arrow-circle-down'}
                                        />
                                        <p style={{marginLeft: '12%'}}
                                           className={`value${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}>{item.changePercent} % </p>
                                    </div>
                                </td>
                                <td>
                                    <figure className="image is-128x128" style={{height: '0%'}}>
                                        <img src={item.companylogo}/>
                                    </figure>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>

            {/*</div>*/}

        </div>
    }
}


const mapStateToProps = state => {
    return {
        stockList: stocksSelector(state),

    }
}

export default connect(mapStateToProps, {
    setStocks
})(AdminDashboard)
