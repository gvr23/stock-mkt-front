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
    updatePrice
} from '../actions';
import { push } from 'connected-react-router';
import {
    Home,
    Login
} from './asyncRoutes';
import { isLoggedSelector } from '../selectors';

class RouterApp extends React.Component {
    componentDidMount() {
        const socket = io.connect(SOCKET_URL, {
            transports: ["websocket"]
        });
        socket.on('connect', () => {
            console.log('CONNECTED')
        })
        socket.on('new.stock.value', (data) => {
            console.log({ data })
            this.props.updatePrice(data)
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
                    <a className="navbar-item" href="https://bulma.io">
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
    console.log({ isLogged })
    return {
        isLogged
    }
}

export default (connect(mapStateToProps, {
    push,
    updatePrice
})(RouterApp))