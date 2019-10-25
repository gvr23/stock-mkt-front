import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import Axios from 'axios';
import AdaptableImg from '../../components/AdaptableImg'
import {setStocks, logInUser, setHoldings, upsertHolding, setTransactions, addTransacction} from '../../actions'
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Input from '../../components/Input';
import {stocksSelector} from '../../selectors/stocks';
import { numberWithCommas } from '../../utils'
import {store} from 'react-notifications-component'


class Transactions extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {showTransactions} = this.props;
        return <>
            <div
                onClick={this.props.onClose}
                className={`_overlay${showTransactions ? ' show' : ''}`}
            />
            <div
                style={{
                    height: (window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight) * 0.6
                }}
                className={`_transactions_bottom${this.props.showTransactions ? ' show' : ''}`}
            >
                <nav id="middle-navbar" style={{position: 'absolute', top: 0, left: 0, width: '100%'}}
                     className="navbar is-primary" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a className="navbar-item" href="#">
                            <h1
                                className="has-text-weight-bold"
                            >
                                Transacciones realizadas
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
                                    onClick={this.props.onClose}
                                    style={{
                                        color: '#fff',
                                        borderColor: '#fff'
                                    }}
                                    className="is-primary is-outlined"
                                    text={<span>Cerrar</span>}
                                />

                            </div>
                        </div>
                    </div>
                </nav>
                <div
                    className="_container"
                >
                    {
                        (this.props.transactions.length > 0) ?
                            this.props.transactions.map((transaction) => {
                                const price = this.props.stockList[transaction.stock_uuid].price
                                const transactionPrice = transaction.stock_price.close_price
                                const isBuy = transaction.is_buy
                                return <div className="_transaction" key={transaction.uuid}>
                                    <div className="left">
                                        <AdaptableImg
                                            src={this.props.stockList[transaction.stock_uuid].companylogo}
                                        />
                                    </div>
                                    <div className="right">

                                        <p>Fecha y hora de transaccion: <b>{transaction.created_at}</b></p>
                                        <p>Estado: <b>{transaction.status}</b></p>
                                        <p>Moneda: <b>{transaction.stock.currency == 'USD' ? 'Dólares' : 'Soles'}</b>
                                        </p>
                                        <p>Cantidad de acciones: <b>{transaction.quantity}</b></p>
                                        <p>Precio al momento
                                            de {isBuy ? 'compra' : 'venta'}: <b>{transactionPrice.toFixed(2)} {transaction.stock.currency}</b>
                                        </p>
                                        <hr/>
                                        <p>Monto {isBuy ? 'pagado' : 'recibido'}: <b>{numberWithCommas((transaction.quantity * transactionPrice).toFixed(2))} {transaction.stock.currency}</b>
                                        </p>


                                        <div className={`${isBuy ? 'buy' : 'sell'}`}>
                                            <Button
                                                style={{
                                                    // color: '#fff',
                                                    // borderColor: '#fff'
                                                }}
                                                className={`is-primary is-outlined`}
                                                text={<span>{isBuy ? 'COMPRA' : 'VENTA'}</span>}
                                            />

                                            <Button
                                                className={`is-primary is-outlined${((!isBuy && transactionPrice > price) || (isBuy && price > transactionPrice)) ? ' is-win' : ((isBuy && price < transactionPrice) || (!isBuy && transactionPrice < price)) ? ' is-lose' : ' is-draw'}`}
                                                text={<span><Icon
                                                    style={{marginRight: 15}}
                                                    name={`${((!isBuy && transactionPrice > price) || (isBuy && price > transactionPrice)) ? 'arrow-circle-up' : ((isBuy && price < transactionPrice) || (!isBuy && transactionPrice < price)) ? 'arrow-circle-down' : 'equals'}`}
                                                />{`      VA: ${price.toFixed(2)}`}</span>}
                                            />
                                        </div>
                                    </div>
                                </div>
                            })
                            :
                            <div className="columns">
                                <div className="column is-5">
                                    <div className="message-header notification is-link" style={{
                                        marginTop: '1%',
                                        marginLeft: '2%',
                                        marginBottom: '1%',
                                        backgroundColor: '#1A2E8F'
                                    }}>
                                        <p>No se encuentran transacciones registradas en este momento</p>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    }
}

const Modal = ({children, closeModal, modalState, title}) => {
    if (!modalState) {
        return null;
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={closeModal}/>
            <div className="modal-card">
                <header className="modal-card-head" style={{backgroundColor: '#371E9E'}}>
                    <p className="modal-card-title" style={{color: 'white'}}>{title}</p>
                    <button className="delete" onClick={closeModal}/>
                </header>
                <section className="modal-card-body">
                    <div className="content">
                        {children}
                    </div>
                </section>
                <footer className="modal-card-foot" style={{backgroundColor: '#371E9E'}}>
                    <div className="control" style={{marginRight: '2%'}}>
                        <button onClick={closeModal} className="button is-danger">Cerrar</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

class LeftSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: '',
            isSelling: false,
            error: undefined,
        }
        this.sideSellRef = createRef();
    }

    componentDidMount() {
        console.log('MOUNTED')
    }

    changeState(newState) {
        this.setState({...newState})
    }
    _onScrollSideBuy = () => {
        if(this.sideSellRef.current) {
            this.sideSellRef.current.scrollTo(0,0);
        }
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
        const {stockList, stockToSell} = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToSell] || {})["price"]))
        const comission = actionValue * this.props.comission
        const totalAmount = actionValue - comission
        return totalAmount
    }

    render() {
        const {show, stockToSell, stockList, balance} = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToSell] || {})["price"]))
        const comission = actionValue * this.props.comission
        const totalAmount = actionValue - comission
        const newBalance = balance + totalAmount
        const newBalancePen = balance + (totalAmount / this.props.exchangeRate)
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
                            this.setState({error: undefined}, () => {
                                this.props.onClose()
                            })
                        }}
                        className="fa-2x"
                        name="times"
                    />
                </div>
                <div
                    ref={this.sideSellRef}
                    className="content"
                    style={{
                        maxHeight: (window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight) || 0
                    }}
                >
                    {stockToSell !== undefined && <div
                        className=""
                    >
                        <div className="_stock is-full-width">
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
                                <h3>{stockList[stockToSell].price} {stockList[stockToSell].currency}</h3>
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
                        <br/>


                        <p
                            className="has-text-centered is-fullwidth"
                        >

                            Actualizada por última vez el {stockList[stockToSell]["timestamp"]}
                        </p>
                        <br/>
                        <div
                            className="_holdings"
                        >
                            Tienes <b>{this.props.holdings[stockToSell]}</b> acciones valorizadas
                            en <b>{numberWithCommas((this.props.holdings[stockToSell] * stockList[stockToSell].price).toFixed(2))} {stockList[stockToSell].currency}</b> para
                            vender
                        </div>

                        <br/>
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
                                        error: undefined,
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

                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(actionValue.toFixed(2)) + (stockList[stockToSell]["currency"] === 'PEN' ? (` >>  ${(actionValue / this.props.exchangeRate).toFixed(2)} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding
                        />
                        <small>Comisión de venta</small>
                        <Input
                            readOnly

                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(comission.toFixed(2)) + (stockList[stockToSell]["currency"] === 'PEN' ? (` >>  ${(comission / this.props.exchangeRate).toFixed(2)} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding
                        />
                        <small>Total a recibir</small>
                        <Input
                            readOnly
                            value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas(totalAmount.toFixed(2)) + (stockList[stockToSell]["currency"] === 'PEN' ? (` >>  ${(totalAmount / this.props.exchangeRate).toFixed(2)} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding

                        />
                        <hr/>
                        <small>Nuevo balance al finalizar venta</small>
                        <Input
                            className={this.state.quantity > this.props.holdings[stockToSell] ? 'error' : 'success'}
                            readOnly
                            // value={stockList[stockToSell]["currency"] + '  ' + numberWithCommas((newBalance).toFixed(2))}
                            value={'USD' + '  ' + numberWithCommas((stockList[stockToSell]["currency"] === 'PEN' ? newBalancePen : newBalance).toFixed(2))}
                            onChange={() => {
                            }}
                            disabled
                        />

                        <Button
                            isLoading={this.state.isSelling}
                            isConfirm
                            textConfirm="Click para confirmar venta"
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

        this.sideBuyRef = createRef();
        this._onScrollSideBuy.bind(this);
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
    _onScrollSideBuy = () => {
        if(this.sideBuyRef.current) {
            this.sideBuyRef.current.scrollTo(0,0);
        }
    }

    getTotal() {
        const {stockList, stockToBuy} = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToBuy] || {})["price"]))
        const comission = actionValue * this.props.comission
        const totalAmount = actionValue + comission
        return totalAmount
    }

    render() {
        const {show, stockToBuy, stockList, balance} = this.props
        const actionValue = (parseInt(this.state.quantity || 0) * parseFloat((stockList[stockToBuy] || {})["price"]))
        const comission = actionValue * this.props.comission
        const totalAmount = actionValue + comission
        const newBalance = balance - totalAmount
        const newBalancePen = balance - (totalAmount / this.props.exchangeRate)
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
                    ref={this.sideBuyRef}
                    className="content"
                    style={{
                        maxHeight: (window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight) || 0
                    }}
                >
                    {stockToBuy !== undefined && <div
                        className=""
                    >
                        <div className="_stock is-full-width">
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
                                >{stockList[stockToBuy].price} {stockList[stockToBuy].currency}</h3>
                                <Icon
                                    className={`fa-2x${stockList[stockToBuy].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                                    name={stockList[stockToBuy].changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                                />
                                <p className={`value${stockList[stockToBuy].changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{stockList[stockToBuy].changePercent} % </p>
                            </div>
                        </div>
                    </div>}
                    {stockToBuy !== undefined && <form>
                        <br/>
                        <p
                            className="has-text-centered is-fullwidth"
                        >
                            Actualizada por última vez el {stockList[stockToBuy]["timestamp"]}
                        </p>
                        {stockList[stockToBuy]["currency"] === 'PEN' ? <>
                            <br/>
                            <small>Tipo de cambio</small>
                            <Input
                                editable={"false"}
                                disabled
                                value={`${this.props.exchangeRate} PEN`}
                            />
                        </> : <br/>}
                        <Input
                            onChange={(e) => this.setState({
                                quantity: e.target.value.replace(/[^0-9]+/g, '')
                            })}
                            error={this.props.error}
                            placeholder={"Cantidad de acciones"}
                            value={this.state.quantity.toString()}
                        />
                        <small>Valor de acciones a comprar</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(actionValue.toFixed(2)) + (stockList[stockToBuy]["currency"] === 'PEN' ? (` >>  ${(actionValue / this.props.exchangeRate).toFixed(2)} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding
                        />
                        <small>Comisión de compra</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(comission.toFixed(2)) + (stockList[stockToBuy]["currency"] === 'PEN' ? (` >> ${(comission / this.props.exchangeRate).toFixed(2)} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding
                        />
                        <small>Total a pagar</small>
                        <Input
                            readOnly
                            value={stockList[stockToBuy]["currency"] + '  ' + numberWithCommas(totalAmount.toFixed(2)) + (stockList[stockToBuy]["currency"] === 'PEN' ? (` >> ${numberWithCommas((totalAmount / this.props.exchangeRate).toFixed(2))} USD`) : '')}
                            onChange={() => {
                            }}
                            disabled
                            noPadding

                        />
                        <hr/>
                        <small>Nuevo balance al finalizar compra</small>
                        <Input
                            className={((stockList[stockToBuy]["currency"] === 'USD' && newBalance < 0) || (stockList[stockToBuy]["currency"] === 'PEN') && newBalancePen < 0) ? 'error' : 'success'}
                            readOnly
                            value={'USD' + '  ' + numberWithCommas((stockList[stockToBuy]["currency"] === 'PEN' ? newBalancePen : newBalance).toFixed(2))}
                            onChange={() => {
                            }}
                            disabled

                        />
                        <Button
                            isLoading={this.state.isBuying}
                            isConfirm
                            textConfirm="Click para confirmar compra"
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
            showTransactions: false,
            modalState: false,
            news: [],
            filtered_companies: null
        }
        this.myRef = createRef();
        this.toggleModal = this.toggleModal.bind(this);
        this.onSubmitBuy = this.onSubmitBuy.bind(this)
        this.onSubmitSell = this.onSubmitSell.bind(this)
    }

    async componentDidMount() {
        const {data} = await Axios.post(API_URL, {
            query: `{
                transactions(user_uuid: "${this.props.userUUID}") {
                    uuid
                    status
                    stock_uuid
                    stock_price_uuid
                    user_uuid
                    created_at(format: "DD/MM/YYYY HH:mm")
                    updated_at(format: "DD/MM/YYYY HH:mm")
                    is_buy
                    is_sell
                    quantity
                    comission
                    comission_rate
                    total
                    stock_price {
                    close_price
                    }
                    stock {
                    name
                    description
                    companyname
                    currency
                    }
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
            this.props.setHoldings(data.data.holdings)
            this.props.setTransactions(data.data.transactions)
        }

        this.setState({
            loading: false
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.filter === '') {
            return {filtered_companies: props.stockList}
        } else {
            const filtered_companies = Object.values(props.stockList).filter((company) => {
                const re = new RegExp(props.filter, 'gi');
                return re.test(company.companyname + ' ' + company.name);
            });

            return {filtered_companies}
        }
    }

    _scroll = () => {
        if (this.myRef.current) {
            this.myRef.current.scrollTo(0, 0);
        }
    }

    toggleModal() {
        this.setState((prev, props) => {
            const newState = !prev.modalState;
            return {modalState: newState};
        });
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
                }, () => this.sideBar._onScrollSideBuy())
            }


            const total = this.sideBar.getTotal()
            const currency = this.props.stockList[this.state.stockToBuy].currency
            if ((currency === 'USD' && total < 1500) || (currency === 'PEN' && total < 5025)) {
                this.sideBar.reset(true)
                return this.setState({
                    errorBuy: 'Minima compra: 1500.00 USD o 5025.00 PEN'
                }, () => this.sideBar._onScrollSideBuy())
            }
            const {balance} = this.props
            if ((currency === 'USD' && balance < total) || (currency === 'PEN' && balance < (total / this.props.exchangeRate))) {
                this.sideBar.reset(true)
                return this.setState({
                    errorBuy: 'No tienes fondos suficientes para esta compra'
                }, () => this.sideBar._onScrollSideBuy())
            }
            const {data} = await Axios.post(API_URL, {
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
                      stock_price {
                        close_price
                      }
                      stock {
                        name
                        description
                        companyname
                        currency
                      }
                    }
                  }`
            })
            if (!data.errors) {
                this.setState({
                    showBuy: false,
                }, () => {
                    if (!data.data.buyOrSell) {
                        return store.addNotification({
                            title: "Error",
                            message: `Hubo un error en la compra`,
                            type: "danger",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                    }
                    this.sideBar.reset()
                    this.props.addTransacction(data.data.buyOrSell)
                    store.addNotification({
                        title: "Transacción exitosa",
                        message: `Se compraron ${quantity} acciones de ${this.props.stockList[this.state.stockToBuy].companyname}`,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                })
            }

        })
    }

    renderStocks(stockList) {
        return Object.keys(stockList).map((stockKey) => {
            // const stock = stockList[stockKey]
            return <Card
                onBuy={() => this.setState({showBuy: true, stockToBuy: stockKey})}
                key={stockKey}
                item={stockList[stockKey]}
                stockUUID={stockKey}
                showModal={this.toggleModal}
                getNews={this.getNewsFromOneStock}
            />
        })
    }

    onSubmitSell(e) {
        this.leftSideBar.setState({error: undefined}, async () => {
            const quantity = this.leftSideBar.getQuantity()
            if (isNaN(quantity) || quantity == 0) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'Ingresa la cantidad de acciones a vender'
                }, () => this.leftSideBar._onScrollSideBuy())
            }
            if (this.props.holdings[this.state.stockToSell] < quantity) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'No tienes suficientes acciones para vender'
                }, () => this.leftSideBar._onScrollSideBuy())
            }
            const total = this.leftSideBar.getTotal()

            let totalPossibleSell = this.props.holdings[this.state.stockToSell] * this.props.stockList[this.state.stockToSell].price
            totalPossibleSell -= totalPossibleSell * this.props.comission

            const currency = this.props.stockList[this.state.stockToSell].currency

            if (
                (currency === 'USD' && (total < 1500 && (totalPossibleSell >= 1500)))
                ||
                (currency === 'PEN') && (total < 5025 && (totalPossibleSell >= 5025))
            ) {
                this.leftSideBar.reset(true)
                return this.leftSideBar.setState({
                    error: 'Mínima venta: 1500 USD o 5025 PEN'
                }, () => this.leftSideBar._onScrollSideBuy())
            }

            const {data} = await Axios.post(API_URL, {
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
                      stock_price {
                        close_price
                      }
                      stock {
                        name
                        description
                        companyname
                        currency
                      }
                    }
                  }`
            })
            if (!data.errors) {
                this.setState({
                    showSell: false,
                }, () => {
                    if (!data.data.buyOrSell) {
                        return store.addNotification({
                            title: "Error",
                            message: `Ubo un error en la compra`,
                            type: "danger",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                    }
                    this.leftSideBar.reset()
                    this.props.addTransacction(data.data.buyOrSell)
                    store.addNotification({
                        title: "Transacción exitosa",
                        message: `Se vendieron ${quantity} acciones de ${this.props.stockList[this.state.stockToSell].companyname}`,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                })
            }

        })
    }

    getNewsFromOneStock = (stockUUID) => {
        let news = [];
        Object.keys(this.props.news).reduce((accumulator, key) => {
            let section = true;
            this.props.news[key].filter((item, i) => {
                if (item.stockUUID === stockUUID) {
                    if (section) {
                        news.push(<article className="tile is-rounded"
                                           style={{marginBottom: '3%', backgroundColor: '#6543C8', padding: '2%'}}>
                            <p className="subtitle"
                               style={{color: 'white'}}>{(String(key).toUpperCase() === 'OLD') ? 'NOTICIAS ANTIGUAS' : String(key).toUpperCase().replace(/_/gi, ' ')}</p>
                        </article>);


                        section = false;
                    }
                    news.push(<article className="message is-link" style={{marginBottom: '1.5%'}}>
                        <div className="message-body">
                            {item.new}
                        </div>
                    </article>);
                }

            })
            section = true;
        }, []);
        /*this.props.news.old.map(item => {
            console.log('this is the item, ', item.stockUUID)
            if (item.stockUUID === stockUUID) news.push(item);
        })*/
        this.setState({news});
    }

    renderNews() {
        const toRender = []
        Object.keys(this.props.news).map((newKey, index) => {
            console.log('hey this is the index, ', index)
            toRender.push(<div key={newKey} className={`message-header notification is-link ${(index === 0) ? 'newNews' : null}`} style={{
                marginTop: '1%',
                marginBottom: '1%',
                backgroundColor: '#1A2E8F'
            }}>{(String(newKey).toUpperCase() === 'OLD') ? (this.props.news['old'].length === 0 ? 'NO HAY NOTICIAS' : 'NOTICIAS ANTIGUAS') : String(newKey).toUpperCase().replace(/_/gi, ' ')}</div>)
            this.props.news[newKey].forEach((newObj, i) => {
                toRender.push(<div
                    key={`${newKey}-${i}`}
                    className="message-body notification is-link"
                    style={{backgroundColor: '#371E9E'}}
                >
                    <p>{newObj.new}</p>
                </div>)
            })
        })

        return toRender

    }
    getTotal = () => {
        let stockValue = Object.keys(this.props.holdings).reduce((prev, curr) => {
            prev += this.state.filtered_companies[curr]["price"] * this.props.holdings[curr]
            return prev
        }, 0).toFixed(2);

        const total = parseFloat(stockValue) + parseFloat(this.props.balance);

        return numberWithCommas(total);
    }


    render() {
        {this._scroll()}
        const {filtered_companies} = this.state;
        if (this.state.loading || !this.props.connected) {
            return <div className="pageloader is-active is-primary"><span className="title">Conectando...</span></div>
        }
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
                {this.renderStocks(filtered_companies)}
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
                <nav id="middle-navbar" style={{position: 'absolute', top: 0, left: 0, width: '100%'}}
                     className="navbar is-primary" role="navigation" aria-label="main navigation">
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
                                        borderColor: '#fff',
                                        cursor: 'default'
                                    }}
                                    className="is-primary is-outlined"
                                    text={
                                        <span>Valor de acciones: <b>{numberWithCommas(Object.keys(this.props.holdings).reduce((prev, curr) => {
                                            prev += filtered_companies[curr]["price"] * this.props.holdings[curr]
                                            return prev
                                        }, 0).toFixed(2))}</b> USD</span>}
                                />
                                <Button
                                    // disabled
                                    style={{
                                        color: '#fff',
                                        borderColor: '#fff',
                                        cursor: 'default'
                                    }}
                                    className="is-primary is-outlined"
                                    text={
                                        <span>Total: <b>{this.getTotal()}</b> USD</span>}
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
                        const stockObj = filtered_companies[stockUUID]
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
                                    <small className="has-text-centered">Tienes <b
                                        style={{fontWeight: 700}}>{quantity}</b> acciones de esta empresa.</small>
                                </div>
                                <div className="right">
                                    {/* <p> {stockPrice.toFixed(2)} {stockObj["currency"]}</p> */}
                                    <Icon
                                        className={`fa-3x${changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                                        name={changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                                    />
                                    <span
                                        className={`value${changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{changePercent} % </span>
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
                                    dangerouslySetInnerHTML={{__html: `Vender por <b style="margin:0px 5px">${parseFloat(stockPrice).toFixed(2)}</b> ${currency} C/U`}}
                                />
                                <Button
                                    onClick={() => this.setState({
                                        showSell: true,
                                        stockToSell: stockUUID,
                                        sellAll: true,
                                    }, _ => this.leftSideBar.setState({quantity: `${quantity}`}))}
                                    style={{
                                        marginTop: 10
                                    }}
                                    className={`${changePercent > 0 ? 'is-success' : 'is-danger'} is-medium is-fullwidth`}
                                    dangerouslySetInnerHTML={{__html: `Todo por <b style="margin:0px 5px">${numberWithCommas((stockPrice * quantity).toFixed(2), true) + ' '}</b> ${currency}`}}
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
                        {this.props.news.length === 0 && <h1
                            style={{
                                fontSize: '2rem'
                            }}
                        >Aquí se mostrarán las noticias.</h1>}
                        <div
                            ref={this.myRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 20,
                                // overflow: 'hidden',
                                overflowY: 'scroll',
                                maxHeight: '100%'
                            }}
                        >
                            {this.renderNews()}
                            {/* {this.props.news.map((n, i) => {
                                return <div
                                    key={`_${i}`}
                                    style={{
                                        padding: 15,
                                        margin: 10
                                    }}
                                >
                                    {n}
                                </div>
                            })} */}
                        </div>
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
                stockList={filtered_companies}
                onSubmitSell={this.onSubmitSell}
                comission={this.props.comission}
                exchangeRate={this.props.exchangeRate}
                addTransacction={this.props.addTransacction}
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
                stockList={filtered_companies}
                onSubmitBuy={this.onSubmitBuy}
                comission={this.props.comission}
                addTransacction={this.props.addTransacction}
                exchangeRate={this.props.exchangeRate}
            />
            <Transactions
                stockList={filtered_companies}
                transactions={this.props.transactions}
                showTransactions={this.state.showTransactions}
                onClose={() => this.setState({showTransactions: false})}
                comission={this.props.comission}
                exchangeRate={this.props.exchangeRate}
            />

            <Modal
                closeModal={this.toggleModal}
                modalState={this.state.modalState}
                title="Noticias"
            >
                {
                    (this.state.news.length > 0) ?
                        this.state.news.map(item => <div>{item}</div>)
                        :
                        <p className="message-header">No existen noticias para esta acción</p>
                }
            </Modal>
        </div>
    }
}

const mapStateToProps = state => {
    const {holdings} = state.stocks
    return {
        stockList: stocksSelector(state),
        userUUID: state.app.userUUID,
        balance: state.app.balance,
        comission: state.app.comission,
        exchangeRate: state.app.exchangeRate,
        holdings,
        connected: state.stocks.connected,
        transactions: state.stocks.transactions,
        news: state.app.news,
        filter: state.app.filter
    }
}

export default connect(mapStateToProps, {
    setStocks,
    upsertHolding,
    setTransactions,
    logInUser,
    setHoldings,
    addTransacction
})(Home);

