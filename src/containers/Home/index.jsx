import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import { setStocks } from '../../actions'
import { stocksSelector } from '../../selectors';

class Home extends PureComponent {
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

    renderStocks() {
        const { stockList } = this.props
        return Object.keys(stockList).map((stockKey) => {
            const stock = stockList[stockKey]
            return <div className="_stock" key={stockKey}>
                <div
                    className="left"
                >
                    <AdaptableImg
                        src={stock.companylogo}
                    />
                </div>
                <div
                    className="right"
                >

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
                    flex: '1 1',
                    display: 'flex',
                    border: 'solid 1px #000000',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflowX: 'scroll'
                }}
            >
                {this.renderStocks()}
                {this.renderStocks()}
                {this.renderStocks()}
                {this.renderStocks()}
                {this.renderStocks()}
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
    const stockList = stocksSelector(state)
    return {
        stockList
    }
}

export default connect(mapStateToProps, {
    setStocks
})(Home);

