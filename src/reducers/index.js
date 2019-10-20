import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import app from './app'
import stocks from './stocks'
import admin from './admin'

export default (history) => combineReducers({
    router: connectRouter(history),
    app,
    stocks,
    admin
}); 