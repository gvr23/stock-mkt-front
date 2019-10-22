import {
    SET_IS_LOADING,
    LOGGED_IN,
    UPDATE_BALANCE,
    UPSERT_HOLDING,
    LOG_OUT,
    SET_COMISSION,
    SET_EXCHANGE_RATE,
    SET_STATUS,
    ADD_NEWS,
    ADD_TRANSACTION,
    FILTER_COMPANIES,
    SET_SELECTED,
} from '../constants';

export const addTransacction = payload => ({
    type: ADD_TRANSACTION,
    payload
})

export const setIsLoading = (payload) => ({
    type: SET_IS_LOADING,
    payload
})

export const logInUser = (payload) => ({
    type: LOGGED_IN,
    payload
})

export const updateBalance = (payload) => ({
    type: UPDATE_BALANCE,
    payload,
})

export const upsertHolding = payload => ({
    type: UPSERT_HOLDING,
    payload
})

export const logOff = _ => ({
    type: LOG_OUT
})

export const setComission = payload => ({
    type: SET_COMISSION,
    payload
})
export const setExchangeRate = payload => ({
    type: SET_EXCHANGE_RATE,
    payload
})
export const setStatus = payload => ({
    type: SET_STATUS,
    payload
})
export const addNews = payload => ({
    type: ADD_NEWS,
    payload
})
export const filterCompanies = payload => ({
    type: FILTER_COMPANIES,
    payload
});
export const setSelected = payload => ({
    type: SET_SELECTED,
    payload
});
