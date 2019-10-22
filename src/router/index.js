import React from 'react';
import io from 'socket.io-client';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    withRouter
} from 'react-router-dom';
import Input from '../components/Input';
import {
    updatePrice,
    updateBalance,
    logOff,
    upsertHolding,
    logInUser,
    setConnected,
    setStocks,
    setStatus,
    setComission,
    setExchangeRate,
    addNews,
    filterCompanies
} from '../actions';
import {push} from 'connected-react-router';
import {
    Home,
    Login,
    AdminRanking,
    AdminDashboard,
    AdminManageGame
} from './asyncRoutes';
import {isLoggedSelector} from '../selectors';
import {numberWithCommas} from '../utils';
import ReactNotification from 'react-notifications-component'
import Button from '../components/Button';
import Axios from 'axios';

class RouterApp extends React.Component {
    async componentDidMount() {
        const {data} = await Axios.post(API_URL, {
            query: `{
            user(uuid: "${this.props.userUUID}") {
                uuid
                username
                admin
                balance
                params{
                    comission
                    exchangeRate
                    status
                }
            }
            oldNews {
                new
                stockUUID
            }
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
        }`
        })
        if (!this.props.userUUID)
            this.props.logInUser(data.data.user || {})
        else
            this.props.logInUser(data.data.user)
        // if (data.data.stocks)
        this.props.setStocks(data.data.stocks)
        this.props.addNews({
            time: 'old',
            news: data.data.oldNews

        })

        const socket = io.connect(SOCKET_URL, {
            transports: ["websocket"],
            query: {
                userUUID: this.props.userUUID
            }
        });
        socket.on('connect', () => {
            console.log('CONNECTED')
            this.props.setConnected()
        })
        socket.on('param.change', (data) => {
            switch (data.name) {
                case 'comission':
                    this.props.setComission(data.value)
                    break;
                case 'exchangeRate':
                    this.props.setExchangeRate(data.value)
                    break;
                default:
                    this.props.setStatus(data.value)
                    break;
            }
        })
        socket.on('new.balance', (data) => {
            this.props.updateBalance(parseFloat(data.toFixed(2)))
        })
        socket.on('new.stock.values', (data) => {
            this.props.updatePrice(data.values)
        })
        socket.on('new.new', (data) => {
            if (data.news.length > 0) {
                this.props.addNews(data)
            }
            // this.props.updatePrice(data)
        })

        socket.on('upsert.holding', (data) => {
            this.props.upsertHolding(data)
        })

    }

    render() {
        return (<Layout
            {...this.props}
        >
            <Switch>
                <NotLoggedOnlyRoutes
                    path={"/login"}
                    component={Login}
                    isLogged={this.props.isLogged}
                    exact
                />
                <ProtectedRoute
                    path={"/"}
                    component={this.props.admin ? AdminDashboard : Home}
                    isLogged={this.props.isLogged}
                    exact
                />
                <ProtectedRoute
                    path={"/manage"}
                    component={this.props.admin ? AdminManageGame : () => <div>Unauthorized</div>}
                    isLogged={this.props.isLogged}
                    exact
                />
                <ProtectedRoute
                    path={"/ranking"}
                    component={this.props.admin ? AdminRanking : () => <div>Unauthorized</div>}
                    isLogged={this.props.isLogged}
                    exact
                />
                <Route component={() => <Redirect
                    to={{
                        pathname: '/',
                    }}
                />}/>

            </Switch>
        </Layout>)
    }
}

export const Layout = withRouter((props) => {
    const renderContent = (status) => {
        switch (status) {
            case 'UNSTARTED':
                return 'El juego aún no comienza'
            case 'PAUSED':
                return 'El juego se encuentra en pausa'
            case 'ENDED':
                return 'El juego ha terminado. Se publicarán los resultados pronto.'
        }
    }
    if (props.isLogged && !props.admin && props.status !== 'STARTED') {
        return <div className="pageloader is-active is-primary"><span className="title">
            {renderContent(props.status)}
        </span></div>
    }
    if (props.isLogged) {
        return <>
            <ReactNotification/>
            <nav id="navbar" className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <a className="navbar-item" href="#">
                        <h1
                            className="has-text-weight-bold"
                        >
                            StockMKT
                        </h1>
                    </a>
                    {
                        (!props.admin) ?
                            <div className="control has-icons-left has-icons-right">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Buscar compañía"
                                    onChange={(e) => props.filterCompanies(e.target.value)}
                                    value={props.filter}
                                />
                                <span className="icon is-small is-left"><i className="fas fa-search-dollar"/></span>
                                <a className="icon is-small is-right" style={{ pointerEvents: 'auto' }} onClick={() => props.filterCompanies('')}><i className="fas fa-eraser"/></a>
                            </div>
                            :
                            null
                    }
                    {props.admin && <div className="navbar-start">
                        <a
                            className={`navbar-item${props.location.pathname === '/' ? ' is-active' : ''}`}
                            onClick={() => props.push('/')}
                        >
                            Dahboard
                        </a>
                        <a
                            className={`navbar-item${props.location.pathname === '/manage' ? ' is-active' : ''}`}
                            onClick={() => props.push('/manage')}
                        >
                            Manage
                        </a>
                        <a
                            className={`navbar-item${props.location.pathname === '/ranking' ? ' is-active' : ''}`}
                            onClick={() => props.push('/ranking')}
                        >
                            Ranking
                        </a>
                    </div>}


                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {
                                !props.admin ? <Button
                                    // disabled
                                    style={{
                                        color: '#fff',
                                        borderColor: '#fff'
                                    }}
                                    className="is-primary is-outlined"
                                    text={<span>Efectivo: <b>{numberWithCommas(props.balance || 0)}</b> USD</span>}
                                /> : null}
                            <Button
                                // disabled
                                onClick={props.logOff}
                                style={{
                                    color: '#fff',
                                    borderColor: '#fff'
                                }}
                                className="is-primary is-outlined"
                                text={'Salir'}
                            />
                        </div>
                    </div>
                </div>

            </nav>
            {props.children}
        </>
    }
    return (<>
        <ReactNotification/>
        {props.children}
    </>)
})

const NotLoggedOnlyRoutes = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => {
                return (!rest.isLogged) ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: {
                                from: props.location
                            }
                        }}
                    />
                )
            }
            }
        />
    )
}

const ProtectedRoute = ({component: Component, ...rest}) => {
    /**
     * It's posible to handle Roles.
     * var regex = new RegExp(rest.roles, 'g');
     * let hasScope = rest.requiredScope.match(regex) !== null;
     */

        // var regex = new RegExp(rest.roles, 'g');
        // let hasScope = rest.requiredScope.match(regex) !== null;
    let hasPerm = rest.isLogged;
    // if (hasPerm && ('isAdmin' in rest)) {
    //     hasPerm = rest.isAdmin;
    // }
    return (
        <Route
            {...rest}
            render={props => {
                return hasPerm ?
                    (<Component
                            {...props}
                        />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: {from: props.location}
                            }}
                        />
                    )
            }}
        />
    )
}


const mapStateToProps = (state) => {
    const isLogged = isLoggedSelector(state);
    return {
        isLogged,
        balance: state.app.balance,
        userUUID: state.app.userUUID,
        admin: state.app.admin,
        status: state.app.status,
        filter: state.app.filter
    }
}

export default (connect(mapStateToProps, {
    push,
    updatePrice,
    updateBalance,
    logInUser,
    logOff,
    upsertHolding,
    setConnected,
    setStatus,
    setComission,
    setExchangeRate,
    setStocks,
    addNews,
    filterCompanies
})(RouterApp))
