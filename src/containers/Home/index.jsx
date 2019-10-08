import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import { setStocks, logInUser, setHoldings, upsertHolding } from '../../actions'
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { numberWithCommas } from '../../utils';
import { stocksSelector } from '../../selectors/stocks';



class LeftSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: '',
            isSelling: false,
            error: undefined,
        }
    }

    componentDidMount() {
        console.log('MOUNTED')
    }
    changeState(newState) {
        this.setState({ ...newState })
    }

    reset(onlyBtn = false) {
        if (onlyBtn) {
            return this.setState({
                isSelling: false
            })
        }
        this.setState({
            quantity: '',
            isSelling: false,
        })
    }
    getQuantity() {
        return parseInt(this.state.quantity)
    }
    getTotal() {

        const { stockList, stockToSell } = this.props

        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToSell] || {})["price"]))
        const comission = actionValue * 0.008
        const totalAmount = actionValue - comission
        return totalAmount
    }
    render() {

        const { show, stockToSell, stockList, balance } = this.props

        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToSell] || {})["price"]))
        const comission = actionValue * 0.008
        const totalAmount = actionValue - comission
        const newBalance = balance + totalAmount
        return <>
            <div
                onClick={() => {
                    if (!this.state.isSelling) {
                        this.setState({
                            isSelling: false,
                            error: undefined
                        }, () => {
                            this.props.onClose()
                        })
                    }
                }}
                className={`_overlay${show ? ' show' : ''}`}
            />
            <div
                className={`_sell_bar${show ? ' show' : ''}`}
                style={{
                    // paddingTop: (document.querySelector('#navbar') || {}).clientHeight
                }}
            >
                <div
                    className="header"
                >
                    <Icon
                        onClick={() => {
                            this.setState({ error: undefined }, () => { this.props.onClose() })
                        }}
                        className="fa-2x"
                        name="times"
                    />
                </div>
                <div
                    className="content"
                    style={{
                        maxHeight: (window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight) || 0
                    }}
                >



                    {stockToSell !== undefined && <div
                        className=""
                    >
                        <div className="_stock is-full-width"   >
                            <div
                                className="left"
                            >
                                <AdaptableImg

                                    src={stockList[stockToSell].companylogo}
                                />
                            </div>
                            <div
                                className="right"
                            >


                                <h2>{stockList[stockToSell].companyname}</h2>
                                <h3
                                // className={`${item.change > 0 ? 'has-text-success' : 'has-text-danger'}`}


                                >{stockList[stockToSell].price} {stockList[stockToSell].currency}</h3>
                                {/* <p
                >{item.description.slice(0, 64)}</p> */}
                                {/* <div> */}
                                {/* <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        background: 'red',
                        alignSelf: 'stretch'
                    }}
                > */}
                                <Icon

                                    className={`fa-2x${stockList[stockToSell].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}

                                    name={stockList[stockToSell].changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                                />


                                <p className={`value${stockList[stockToSell].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{stockList[stockToSell].changePercent} % </p>
                                {/* </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>}


                    {stockToSell !== undefined && <form>
                        <br />



                        <p
                            className="has-text-centered is-fullwidth"
                        >

                            Actualizada por última vez el {stockList[stockToSell]["timestamp"]}
                        </p>
                        <br />
                        <div
                            className="_holdings"
                        >
                            Tienes <b>{this.props.holdings[stockToSell]}</b> acciones valorizadas en <b>{numberWithCommas((this.props.holdings[stockToSell] * stockList[stockToSell].price).toFixed(2))} {stockList[stockToSell].currency}</b> para vender
                        </div>

                        <br />
                        <Input
                            onChange={(e) => this.setState({
                                error: undefined,
                                quantity: e.target.value.replace(/[^0-9]+/g, '')
                            }, () => {
                                if (this.state.quantity > this.props.holdings[stockToSell]) {
                                    this.setState({
                                        error: 'No tienes suficientes acciones para vender'
                                    })
                                }
                            })}
                            error={this.state.error}
                            placeholder={"Cantidad de acciones"}
                            value={this.state.quantity}
                            extra={<Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    this.setState({
                                        quantity: this.props.holdings[stockToSell]
                                    })
                                }}
                                className="is-primary is-input-addon"
                                text={<span>Todo</span>}
                            />}

                        />
                        <small>Valor de acciones a vender</small>
                        <Input
                            readOnly

                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(actionValue.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding
                        />
                        <small>Comisión de venta</small>
                        <Input
                            readOnly

                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(comission.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding
                        />
                        <small>Total a pagar</small>
                        <Input
                            readOnly
                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(totalAmount.toFixed(2))}
                            onChange={() => { }}
                            disabled
                            noPadding

                        />
                        <hr />
                        <small>Nuevo balance al finalizar venta</small>
                        <Input
                            className={this.state.quantity > this.props.holdings[stockToSell] ? 'error' : 'success'}
                            readOnly
                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas((newBalance).toFixed(2))}
                            onChange={() => { }}
                            disabled
                        />
                        <Button
                            isLoading={this.state.isSelling}
                            isConfirm
                            textConfirm="Click para vender"
                            disabled={this.state.isSelling || typeof this.state.error === 'string'}
                            onClick={(e) => {
                                if (e)
                                    e.preventDefault()
                                this.setState({
                                    isSelling: true
                                }, () => {
                                    this.props.onSubmitSell()
                                })
                            }}
                            className="is-primary is-fullwidth"
                            text="Vender"
                        />
                    </form>}
                </div>
            </div>
        </>
    }
}


class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: '',
            isBuying: false,
        }
    }
    reset(onlyBtn = false) {
        if (onlyBtn) {
            return this.setState({
                isBuying: false
            })
        }
        this.setState({
            quantity: '',
            isBuying: false,
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
                onClick={() => {
                    if (!this.state.isBuying) {
                        this.setState({
                            isBuying: false,
                        }, () => {
                            this.props.onClose()
                        })
                    }
                }}
                className={`_overlay${show ? ' show' : ''}`}
            />
            <div
                className={`_buy_bar${show ? ' show' : ''}`}
                style={{
                    // paddingTop: (document.querySelector('#navbar') || {}).clientHeight
                }}
            >
                <div
                    className="header"
                >
                    <Icon
                        onClick={this.props.onClose}
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

                                <h2>{stockList[stockToBuy].companyname}</h2>
                                <h3
                                // className={`${item.change > 0 ? 'has-text-success' : 'has-text-danger'}`}
                                >{stockList[stockToBuy].price} {stockList[stockToBuy].currency}</h3>
                                {/* <p
                >{item.description.slice(0, 64)}</p> */}
                                {/* <div> */}
                                {/* <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        background: 'red',
                        alignSelf: 'stretch'
                    }}
                > */}
                                <Icon
                                    className={`fa-2x${stockList[stockToBuy].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                                    name={stockList[stockToBuy].changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                                />
                                <p className={`value${stockList[stockToBuy].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{stockList[stockToBuy].changePercent} % </p>
                                {/* </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>}

                    {stockToBuy !== undefined && <form>
                        <br />
                        <p
                            className="has-text-centered is-fullwidth"
                        >
                            Actualizada por última vez el {stockList[stockToBuy]["timestamp"]}
                        </p>
                        <br />
                        <Input
                            onChange={(e) => this.setState({
                                quantity: e.target.value.replace(/[^0-9]+/g, '')
                            })}
                            error={this.props.error}
                            placeholder={"Cantidad de acciones"}
                            value={this.state.quantity}

                        />
                        <small>Valor de acciones a comprar</small>
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
                            isLoading={this.state.isBuying}
                            isConfirm
                            textConfirm="Confirmar compra"
                            disabled={this.state.isBuying}
                            onClick={(e) => {
                                if (e)
                                    e.preventDefault()
                                this.setState({
                                    isBuying: true
                                }, () => {
                                    this.props.onSubmitBuy(e)
                                })
                            }}
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
            stockToSell: undefined,
            showSell: false,
            sellAll: false,
            showTransactions: false
        }
        this.onSubmitBuy = this.onSubmitBuy.bind(this)
        this.onSubmitSell = this.onSubmitSell.bind(this)
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
            this.props.setStocks(data.data.stocks)
            this.props.logInUser(data.data.user)
            this.props.setHoldings(data.data.holdings)
        }

        this.setState({
            loading: false,
        })
    }

    onSubmitBuy(e) {
        // e.preventDefault()
        return this.setState({
            errorBuy: undefined
        }, async () => {

            const quantity = this.sideBar.getQuantity()
            if (isNaN(quantity) || quantity == 0) {
                this.sideBar.reset(true)
                return this.setState({
                    errorBuy: 'Ingresa la cantidad de acciones'
                })
            }


            const total = this.sideBar.getTotal()

            if (total < 1500) {
                this.sideBar.reset(true)
                return this.setState({
                    errorBuy: 'Minima compra: 1500.00 USD o 4995.00 PEN'
                })
            }

            const { balance } = this.props

            if (balance < total) {
                this.sideBar.reset(true)
                return this.setState({
                    errorBuy: 'No tiendes fondos suficientes para esta compra'
                })
            }

            const { data } = await Axios.post(API_URL, {
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
            return <Card
                onBuy={() => this.setState({ showBuy: true, stockToBuy: stockKey })}
                key={stockKey}
                item={stockList[stockKey]}
            />
        })
    }

    onSubmitSell(e) {
        this.leftSideBar.setState({ error: undefined }, async () => {
            const quantity = this.leftSideBar.getQuantity()
            if (isNaN(quantity) || quantity == 0) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'Ingresa la cantidad de acciones a vender'
                })
            }
            if (this.props.holdings[this.state.stockToSell] < quantity) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'No tienes suficientes acciones para vender'
                })
            }
            const total = this.leftSideBar.getTotal()

            let totalPossibleSell = this.props.holdings[this.state.stockToSell] * this.props.stockList[this.state.stockToSell].price
            totalPossibleSell -= totalPossibleSell * 0.008
            if (total < 1500 && (totalPossibleSell >= 1500)) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'Mínima venta: 1500 USD o 4995 PEN'
                })
            }

            const { data } = await Axios.post(API_URL, {
                query: `mutation{
                    buyOrSell(
                      user_uuid: "${this.props.userUUID}"
                      stock_uuid: "${this.state.stockToSell}"
                      stock_price_uuid: "${this.props.stockList[this.state.stockToSell].priceUUID}"
                      is_buy: false		
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
            console.log('VENTA', data.data)
            if (!data.errors) {
                this.setState({
                    showSell: false,
                }, () => {
                    this.leftSideBar.reset()
                })
            }

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
                    flex: '4 1',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    overflowX: 'scroll',
                    // flexBasis: '5%'

                }}
            >
                {this.renderStocks(stockList)}
            </div>
            <div
                style={{
                    flex: '6 1',
                    display: 'flex',
                    flexDirection: 'row',
                    // borderTop: 'solid 1px black',
                    maxHeight: '60%',
                    position: 'relative',
                    paddingTop: 40
                }}
            >
                <nav id="middle-navbar" style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} className="navbar is-primary" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a className="navbar-item" href="#">
                            <h1
                                className="has-text-weight-bold"
                            >
                                Portafolio de usuario
                        </h1>
                        </a>

                        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <Button
                                    onClick={() => this.setState({
                                        showTransactions: true
                                    })}
                                    style={{
                                        color: '#fff',
                                        borderColor: '#fff'
                                    }}
                                    className="is-primary is-outlined"
                                    text={<span>Ver transacciones</span>}
                                />
                                <Button
                                    // disabled
                                    style={{
                                        color: '#fff',
                                        borderColor: '#fff'
                                    }}
                                    className="is-primary is-outlined"
                                    text={<span>USD <b>{numberWithCommas(Object.keys(this.props.holdings).reduce((prev, curr) => {
                                        prev += stockList[curr]["price"] * this.props.holdings[curr]
                                        return prev
                                    }, 0).toFixed(2))}</b> en valor de acciones</span>}
                                />
                            </div>
                        </div>
                    </div>
                </nav>
                <div
                    className="holdings"

                >
                    {Object.keys(this.props.holdings).length == 0 ? <div
                        style={{
                            flex: '1 1',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '2rem'
                            }}
                        >No haz realizado ninguna compra aún.</h1>
                    </div> : Object.keys(this.props.holdings).map((stockUUID) => {
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
                                    className={`price${changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                                >{stockPrice} {currency} / Acción</span>
                                <Button
                                    style={{
                                        marginTop: 10
                                    }}
                                    onClick={() => this.setState({
                                        showSell: true,
                                        stockToSell: stockUUID,
                                        sellAll: false
                                    }, _ => this.leftSideBar.setState({
                                        quantity: ''
                                    }))}
                                    className={`is-primary is-outlined is-medium is-fullwidth`}
                                    dangerouslySetInnerHTML={{ __html: `Vender por <b style="margin:0px 5px">${stockPrice.toFixed(2)}</b> ${currency} C/U` }}
                                />
                                <Button
                                    onClick={() => this.setState({
                                        showSell: true,
                                        stockToSell: stockUUID,
                                        sellAll: true,
                                    }, _ => this.leftSideBar.setState({ quantity: `${quantity}` }))}
                                    style={{
                                        marginTop: 10
                                    }}
                                    className={`${changePercent > 0 ? 'is-success' : 'is-danger'} is-medium is-fullwidth`}
                                    dangerouslySetInnerHTML={{ __html: `Todo por <b style="margin:0px 5px">${numberWithCommas((stockPrice * quantity).toFixed(2), true) + ' '}</b> ${currency}` }}
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
                    <div
                        style={{
                            flex: '1 1',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '2rem'
                            }}
                        >Aquí se mostrarán las noticias.</h1>
                    </div>
                </div>
            </div>
            <LeftSideBar
                sellAll={this.state.sellAll}
                balance={this.props.balance}
                holdings={this.props.holdings}
                ref={(ref) => {
                    this.leftSideBar = ref
                }}
                onClose={() => this.setState({
                    showSell: false,
                })}
                show={this.state.showSell}
                stockToSell={this.state.stockToSell}
                stockList={this.props.stockList}
                onSubmitSell={this.onSubmitSell}
            />
            <SideBar
                error={this.state.errorBuy}
                balance={this.props.balance}
                ref={(ref) => {
                    this.sideBar = ref
                }}
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
    const { holdings } = state.stocks
    return {
        stockList: stocksSelector(state),
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

