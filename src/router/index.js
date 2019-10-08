import React from 'react';
import io from 'socket.io-client';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import {
    withRouter
} from 'react-router-dom';
import {
    updatePrice,
    updateBalance,
    logOff,
    upsertHolding,
} from '../actions';
import { push } from 'connected-react-router';
import {
    Home,
    Login
} from './asyncRoutes';
import { isLoggedSelector } from '../selectors';
import { numberWithCommas } from '../utils';
import Button from '../components/Button';

class RouterApp extends React.Component {
    componentDidMount() {
        const socket = io.connect(SOCKET_URL, {
            transports: ["websocket"],
            query: {
                userUUID: this.props.userUUID
            }
        });
        socket.on('connect', () => {
            console.log('CONNECTED')
        })
        socket.on('new.balance', (data) => {
            console.log({ data })
            this.props.updateBalance(parseFloat(data.toFixed(2)))
        })
        socket.on('new.stock.value', (data) => {
            console.log({ data })
            this.props.updatePrice(data)
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
                    component={Home}
                    isLogged={this.props.isLogged}
                    exact
                />
                <Route component={() => <Redirect
                    to={{
                        pathname: '/',
                    }}
                />} />

            </Switch>
        </Layout >)
    }
}

export const Layout = withRouter((props) => {
    if (props.isLogged) {
        return <>
            <nav id="navbar" className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="#">
                        <h1
                            className="has-text-weight-bold"
                        >
                            StockMKT
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
                                // disabled
                                style={{
                                    color: '#fff',
                                    borderColor: '#fff'
                                }}
                                className="is-primary is-outlined"
                                text={<span>Balance: <b>{numberWithCommas(props.balance || 0)}</b> USD</span>}
                            />
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

        {props.children}
    </>)
})

const NotLoggedOnlyRoutes = ({ component: Component, ...rest }) => {
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

const ProtectedRoute = ({ component: Component, ...rest }) => {
    /**
     * It's posible to handle Roles.
     * var regex = new RegExp(rest.roles, 'g');
     * let hasScope = rest.requiredScope.match(regex) !== null;
     */
    let hasPerm = rest.isLogged;
    if (hasPerm && ('isAdmin' in rest)) {
        hasPerm = rest.isAdmin;
    }
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
                                state: { from: props.location }
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
    }
}

export default (connect(mapStateToProps, {
    push,
    updatePrice,
    updateBalance,
    logOff,
    upsertHolding
})(RouterApp))