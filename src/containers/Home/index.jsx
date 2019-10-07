import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import { setStocks } from '../../actions'
import { stocksSelector } from '../../selectors';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

class Home extends Component {
    constructor(props) {
        super(props)

    }
    async componentDidMount() {
        const { data: { data } } = await Axios.post(API_URL, {
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
                    timestamp(format: "DD/MM/YYYY HH:mm")
                    change_price
                    change_percent
                  }
                  stock_price_history {
                    uuid
                    close_price
                    timestamp(format: "DD/MM/YYYY HH:mm")
                    change_price
                    change_percent
                  }
                }
              }`
        })

        if (!data.errors) {
            this.props.setStocks(data.stocks)
        }

    }

    componentWillReceiveProps(nexProps) {
        console.log({ nexProps })
    }

    renderStocks(stockList) {
        return Object.keys(stockList).map((stockKey) => {
            // const stock = stockList[stockKey]
            return <div className="_stock" key={stockKey}>
                <div
                    className="left"
                >
                    <AdaptableImg
                        src={stockList[stockKey].companylogo}
                    />
                </div>
                <div
                    className="right"
                >
                    <small><b>{stockList[stockKey]["name"]}</b></small>
                    <small>{stockList[stockKey]["price"]} (verde rojo)</small>
                    <small>{stockList[stockKey]["change"]}(flecha verde roja)</small>
                    <div
                        className="btns"
                    >
                        <Button
                            text={<Icon name="chart-line" />}
                            className="is-primary is-small"
                            style={{
                                marginRight: 10
                            }}
                        />
                        <Button
                            className="is-success is-small"
                            text="Comprar"
                        />

                    </div>
                </div>
            </div>
        })
    }

    render() {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight
            }}
        >

            <div
                style={{
                    flex: '1.25 1',
                    display: 'flex',
                    border: 'solid 1px #000000',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflowX: 'scroll'
                }}
            >
                {this.renderStocks(this.props.stockList)}
            </div>
            <div
                style={{
                    flex: '1 1',
                    border: 'solid 1px #000000'
                }}
            >

            </div>
        </div>
    }
}

const mapStateToProps = state => {
    const { stockList } = state.stocks
    return {
        stockList: stockList
    }
}

export default connect(mapStateToProps, {
    setStocks
})(Home);

