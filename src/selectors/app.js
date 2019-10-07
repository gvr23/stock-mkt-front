import {
    createSelector
} from 'reselect';

const getIsLoading = state => state.app.isLoading
const getUserUUID = state => state.app.userUUID

const isLoggedSelector = createSelector(
    [getUserUUID],
    (userUUID) => typeof userUUID === 'string'
)

const appSelector = createSelector(
    [getIsLoading],
    (isLoading) => ({
        isLoading
    })
)

export {
    appSelector,
    isLoggedSelector,
}