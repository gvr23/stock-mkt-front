import { SET_IS_LOADING, LOGGED_IN, UPDATE_BALANCE, LOG_OUT, SET_STATUS, SET_COMISSION, SET_EXCHANGE_RATE, ADD_NEWS, FILTER_COMPANIES, SET_SELECTED } from '../constants';

const INITIAL_STATE = {
    isLoading: true,
    userUUID: null,
    username: null,
    balance: null,
    admin: false,
    filter: '',
    status: null,
    comission: null,
    exchangeRate: null,
    news: {},
    selected: 0

}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case ADD_NEWS:
            if (payload.time === 'old') {
                // console.log({ payload })
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
        case FILTER_COMPANIES:
            return {
                ...state,
                filter: payload
            }
        case SET_SELECTED:
            return {
                ...state,
                selected: payload
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
