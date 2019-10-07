import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import { setStocks, logInUser, setHoldings, upsertHolding } from '../../actions'
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import { numberWithCommas } from '../../utils';

class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: ''
        }
    }
    reset() {
        this.setState({
            quantity: ''
        })
    }
    getQuantity() {
        return parseInt(this.state.quantity)
    }
    getTotal() {
        const { stockList, stockToBuy } = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToBuy] || {})["price"]))
        const comission = actionValue * 0.008
        const totalAmount = actionValue + comission
        return totalAmount
    }
    render() {
        const { show, stockToBuy, stockList, balance } = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToBuy] || {})["price"]))
        const comission = actionValue * 0.008
        const totalAmount = actionValue + comission
        const newBalance = balance - totalAmount
        return <>
            <div
                onClick={this.props.onClose}
                className={`_overlay${show ? ' show' : ''}`}
            />
            <div
                className={`_buy_bar${show ? ' show' : ''}`}
                style={{
                    paddingTop: (document.querySelector('#navbar') || {}).clientHeight
                }}
            >
                <div
                    className="header"
                >
                    <Icon
                        className="fa-2x"
                        name="times"
                    />
                </div>
                <div
                    className="content"
                    style={{
                        maxHeight: (window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight - (document.querySelector('._buy_bar .header') || {}).clientHeight) || 0
                    }}
                >


                    {stockToBuy !== undefined && <div
                        className=""
                    >
                        <div className="_stock is-full-width"   >
                            <div
                                className="left"
                            >
                                <AdaptableImg
                                    src={stockList[stockToBuy].companylogo}
                                />
                            </div>
                            <div
                                className="right"
                            >
                                <small><b>{stockList[stockToBuy]["name"]}</b></small>
                                <small>{stockList[stockToBuy]["price"]} (verde rojo)</small>
                                <small>{stockList[stockToBuy]["change"]}(flecha verde roja)</small>
                                <div
                                    className="btns"
                                >

                                </div>
                            </div>
                        </div>
                    </div>}

                    {stockToBuy !== undefined && <form>
                        <br />
                        <Input
                            onChange={(e) => this.setState({
                                quantity: e.target.value.replace(/[^0-9]+/g, '')
                            })}
                            error={this.props.error}
                            placeholder={"Cantidad de acciones"}
                            value={this.state.quantity}

                        />
                        <small>Valor de acciones</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(actionValue.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding
                        />
                        <small>Comisión de compra</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(comission.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding
                        />
                        <small>Total a pagar</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(totalAmount.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding

                        />
                        <hr />
                        <small>Nuevo balance al finalizar compra</small>
                        <Input
                            className={newBalance < 0 ? 'error' : 'success'}
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas((newBalance).toFixed(2))}
                            onChange={() => { }}
                            disabled

                        />
                        <Button
                            onClick={this.props.onSubmitBuy}
                            className="is-primary is-fullwidth"
                            text="Comprar"
                        />
                    </form>}
                </div>
            </div>
        </>
    }
}
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            showBuy: false,
            errorBuy: undefined,
            stockToBuy: undefined,
        }
        this.onSubmitBuy = this.onSubmitBuy.bind(this)
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
                user(uuid: "${this.props.userUUID}") {
                    uuid
                    username
                    admin
                    balance
                }
                holdings(user_uuid: "${this.props.userUUID}") {
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
              `
        })
        if (!data.errors) {
            this.props.setStocks(data.stocks)
            this.props.logInUser(data.user)
            this.props.setHoldings(data.holdings)
        }

        this.setState({
            loading: false,
        })
    }

    onSubmitBuy(e) {
        e.preventDefault()
        return this.setState({
            errorBuy: undefined
        }, async () => {

            const quantity = this.sideBar.getQuantity()
            if (isNaN(quantity) || quantity == 0) {
                return this.setState({
                    errorBuy: 'Ingresa la cantidad de acciones'
                })
            }


            const total = this.sideBar.getTotal()

            if (total < 1500) {
                return this.setState({
                    errorBuy: 'Minima compra: 1500.00 USD o 4995.00 PEN'
                })
            }

            const { balance } = this.props

            if (balance < total) {
                return this.setState({
                    errorBuy: 'No tiendes fondos suficientes para esta compra'
                })
            }

            const { data: { data } } = await Axios.post(API_URL, {
                query: `mutation{
                    buyOrSell(
                      user_uuid: "${this.props.userUUID}"
                      stock_uuid: "${this.state.stockToBuy}"
                      stock_price_uuid: "${this.props.stockList[this.state.stockToBuy].priceUUID}"
                      is_buy: true		
                      quantity: ${quantity}
                    ){
                      uuid
                      status
                      stock_uuid
                      stock_price_uuid
                      user_uuid
                      created_at(format: "DD/MM/YYYY HH:mm")
                      updated_at(format: "DD/MM/YYYY HH:mm")
                      is_buy
                      is_sell
                      comission
                      total
                      quantity

                    }
                  }`
            })

            if (!data.errors) {
                this.setState({
                    showBuy: false,
                }, () => {
                    this.sideBar.reset()
                })
            }

        })
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
                            onClick={() => this.setState({
                                showBuy: true,
                                stockToBuy: stockKey,
                            })}
                            className="is-success is-small"
                            text="Comprar"
                        />

                    </div>
                </div>
            </div>
        })
    }

    render() {
        if (this.state.loading) {
            return <div>Loading</div>
        }
        const { stockList } = this.props
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
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflowX: 'scroll',

                }}
            >
                {this.renderStocks(stockList)}
            </div>
            <div
                style={{
                    flex: '1 1',
                    display: 'flex',
                    flexDirection: 'row',
                    borderTop: 'solid 1px black',
                }}
            >
                <div
                    className="holdings"

                >
                    {Object.keys(this.props.holdings).map((stockUUID) => {
                        const quantity = this.props.holdings[stockUUID]
                        const stockObj = stockList[stockUUID]
                        const stockPrice = stockObj["price"]
                        const changePercent = stockObj["changePercent"]
                        const currency = stockObj["currency"]
                        return <div
                            key={stockUUID}
                            className={"holding"}
                        >
                            <div
                                className="left"
                            >
                                <AdaptableImg
                                    src={stockObj["companylogo"]}

                                />
                            </div>
                            <div
                                className="center"
                            >
                                <div className="left">
                                    <strong
                                        style={{
                                            fontWeight: 600
                                        }}
                                    > {stockObj["companyname"]}</strong>
                                    <small className="has-text-centered">Tienes <b style={{ fontWeight: 700 }}>{quantity}</b> acciones de esta empresa.</small>
                                </div>
                                <div className="right">
                                    {/* <p> {stockPrice.toFixed(2)} {stockObj["currency"]}</p> */}
                                    <Icon
                                        className={`fa-3x${changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                                        name={changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                                    />
                                    <span className={`value${changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{changePercent} % </span>
                                </div>
                            </div>
                            <div
                                className="right"
                            >
                                <span
                                    className="price"
                                >{stockPrice} {currency} / Acción</span>
                                <Button
                                    className={`${changePercent > 0 ? 'is-success' : 'is-danger'} is-medium is-fullwidth`}
                                    dangerouslySetInnerHTML={{ __html: `Vender por <b style="margin:0px 5px">${numberWithCommas((stockPrice * quantity).toFixed(2), true) + ' '}</b> ${currency}` }}
                                />
                            </div>
                        </div>
                    })}
                </div>
                <div
                    style={{
                        flex: 1
                    }}
                >

                </div>
            </div>

            <SideBar
                error={this.state.errorBuy}
                balance={this.props.balance}
                ref={(ref) => this.sideBar = ref}
                onClose={() => this.setState({
                    showBuy: false
                })}
                show={this.state.showBuy}
                stockToBuy={this.state.stockToBuy}
                stockList={this.props.stockList}
                onSubmitBuy={this.onSubmitBuy}
            />
        </div>
    }
}

const mapStateToProps = state => {
    const { stockList, holdings } = state.stocks
    return {
        stockList: stockList,
        userUUID: state.app.userUUID,
        balance: state.app.balance,
        holdings,
    }
}

export default connect(mapStateToProps, {
    setStocks,
    upsertHolding,
    logInUser,
    setHoldings,
})(Home);

