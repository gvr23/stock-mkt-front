import {
    SET_IS_LOADING,
    LOGGED_IN,
} from '../constants';

export const setIsLoading = (payload) => ({
    type: SET_IS_LOADING,
    payload
})

export const logInUser = (payload) => ({
    type: LOGGED_IN,
    payload
})