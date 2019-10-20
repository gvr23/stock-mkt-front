import React from 'react';
import Loadable from 'react-loadable';

const withLoader = (loader) => ({
    ...loader,
    loading: () => <div className="pageloader is-active is-primary"><span className="title">Cargando...</span></div>
})

export const Home = Loadable(
    withLoader({
        loader: () => import(/* webpackChunkName: "home" */'../containers/Home')
    })
)
export const Login = Loadable(
    withLoader({
        loader: () => import(/* webpackChunkName: "login" */'../containers/Login')
    })
)
export const AdminDashboard = Loadable(
    withLoader({
        loader: () => import(/* webpackChunkName: "admin_dashboard" */'../containers/AdminDashboard')
    })
)
export const AdminManageGame = Loadable(
    withLoader({
        loader: () => import(/* webpackChunkName: "admin_manage" */'../containers/AdminManageGame')
    })
)
export const AdminRanking = Loadable(
    withLoader({
        loader: () => import(/* webpackChunkName: "admin_ranking" */'../containers/AdminRanking')
    })
)