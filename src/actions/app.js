import {
    SET_IS_LOADING,
    LOGGED_IN,
    UPDATE_BALANCE,
    UPSERT_HOLDING,
    LOG_OUT,
} from '../constants';

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