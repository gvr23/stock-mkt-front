import { SET_IS_LOADING, LOGGED_IN, UPDATE_BALANCE, LOG_OUT, SET_STATUS, SET_COMISSION, SET_EXCHANGE_RATE, ADD_NEWS } from '../constants';

const INITIAL_STATE = {
    isLoading: true,
    userUUID: null,
    username: null,
    balance: null,
    admin: false,

    status: null,
    comission: null,
    exchangeRate: null,
    news: {}

}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case ADD_NEWS:
            if (payload.time === 'old') {
                return {
                    ...state,
                    news: {
                        old: payload.news
                    }
                }
            }
            return {
                ...state,
                news: {
                    [payload.time]: payload.news,
                    ...state.news
                }
            }
        case SET_STATUS:
            return {
                ...state,
                status: payload,
            }
        case SET_COMISSION:
            return {
                ...state,
                comission: payload
            }
        case SET_EXCHANGE_RATE:
            return {
                ...state,
                exchangeRate: payload
            }
        case UPDATE_BALANCE:
            return {
                ...state,
                balance: payload
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        case LOG_OUT:
            return {
                ...INITIAL_STATE
            }
        case LOGGED_IN:
            return {
                ...state,
                userUUID: payload.uuid,
                username: payload.username,
                balance: payload.balance,
                admin: payload.admin,
                status: payload.params.status,
                comission: payload.params.comission,
                exchangeRate: payload.params.exchangeRate,
            }
        default:
            return state
    }
}