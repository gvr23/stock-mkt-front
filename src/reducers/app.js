import { SET_IS_LOADING, LOGGED_IN } from '../constants';

const INITIAL_STATE = {
    isLoading: true,
    userUUID: null,
    username: null,
    balance: null,
    admin: false,
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        case LOGGED_IN:
            return {
                ...state,
                userUUID: payload.uuid,
                username: payload.username,
                balance: payload.balance,
                admin: payload.admin,
            }
        default:
            return state
    }
}