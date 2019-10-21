import React from 'react'
import {connect} from 'react-redux'
import Input from '../../components/Input'
import Axios from 'axios'
import Button from '../../components/Button'

import {play, pause, stop} from '../../assets/images'

class AdminManageGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comission: this.props.comission,
            exchangeRate: this.props.exchangeRate,
            users: []
        }
    }

    async componentDidMount() {
        const {data} = await Axios.post(API_URL, {
            query: `{
        users {
          uuid
          username 
        }
      }
      `
        })
        console.log({data})
        this.setState({users: data.data.users})
    }

    render() {
        return <div
            className="_admin_manage"
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: window.innerHeight - (document.querySelector('#navbar') || {}).clientHeight
            }}
        >
            <aside className="menu">
                <div className="container" style={{width: '90%', marginTop: '4%'}}>
                    <p className="menu-label">Controles</p>

                    <ul className="menu-list">
                        <li>
                            <small style={{color: 'white'}}>Comisión</small>
                            <Input
                                value={this.state.comission}
                                onChange={e => this.setState({comission: e.target.value})}
                                extra={<Button
                                    disabled={this.state.comission == this.props.comission}
                                    text="Guardar"
                                    className="is-input-addon"
                                    style={{backgroundColor: '#00D1B2', color: 'white'}}
                                    onClick={() => {
                                        Axios.post(API_URL, {
                                            query: `mutation{
                  changeComission(comission: ${this.state.comission} ){
                    success
                  }
                }`
                                        })
                                    }}
                                />}
                            />
                        </li>
                        <li>
                            <small style={{color: 'white'}}>Tipo de cambio</small>
                            <Input
                                value={this.state.exchangeRate}
                                onChange={e => this.setState({exchangeRate: e.target.value})}
                                extra={<Button
                                    disabled={this.state.exchangeRate == this.props.exchangeRate}
                                    text="Guardar"
                                    className="is-input-addon"
                                    style={{backgroundColor: '#00D1B2', color: 'white'}}
                                    onClick={() => {
                                        Axios.post(API_URL, {
                                            query: `mutation{
                  changeExchangeRate(exchangeRate: ${this.state.exchangeRate}){
                    success
                  }
                }`
                                        })
                                    }}
                                />}
                            />
                        </li>
                    </ul>
                </div>
                <div className="menu-footer">
                    <div
                        className="btn"
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "PAUSED"){
                                                              success
                                                }
                                      }`
                            })
                        }}>
                        <img style={{width: '54%', height: '40%'}} src={pause}/>
                    </div>
                    <div
                        className="btn"
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "STARTED"){
                                                  success
                                                }
                                        }`
                            })
                        }}
                    >
                        <img style={{width: '54%', height: '40%'}} src={play}/>
                    </div>
                    <div
                        className="btn"
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "ENDED"){
                                                  success
                                                }
                                        }`
                            })
                        }}
                    >
                        <img style={{width: '54%', height: '40%'}} src={stop}/>
                    </div>
                </div>
            </aside>

            {/*<div
                className="left"
            >
                <small>Comisión</small>
                <Input
                    value={this.state.comission}
                    onChange={e => this.setState({comission: e.target.value})}
                    extra={<Button
                        disabled={this.state.comission == this.props.comission}
                        text="Guardar"
                        className="is-primary  is-input-addon"
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                  changeComission(comission: ${this.state.comission} ){
                    success
                  }
                }`
                            })
                        }}
                    />}
                />
                <small>Tipo de cambio</small>
                <Input
                    value={this.state.exchangeRate}
                    onChange={e => this.setState({exchangeRate: e.target.value})}
                    extra={<Button
                        disabled={this.state.exchangeRate == this.props.exchangeRate}
                        text="Guardar"
                        className="is-primary  is-input-addon"
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                  changeExchangeRate(exchangeRate: ${this.state.exchangeRate}){
                    success
                  }
                }`
                            })
                        }}
                    />}
                />
                <Button
                    className="is-warning is-fullwidth"
                    text="Pausa"
                    onClick={() => {
                        Axios.post(API_URL, {
                            query: `mutation{
                changeStatus(status: "PAUSED"){
                  success
                }
              }`
                        })
                    }}
                />
                <br/>
                <Button
                    className="is-success is-fullwidth"
                    text="Start"
                    onClick={() => {
                        Axios.post(API_URL, {
                            query: `mutation{
                changeStatus(status: "STARTED"){
                  success
                }
              }`
                        })
                    }}
                />
                <br/>
                <Button
                    className="is-danger is-fullwidth"
                    text="Stop"
                    onClick={() => {
                        Axios.post(API_URL, {
                            query: `mutation{
                changeStatus(status: "ENDED"){
                  success
                }
              }`
                        })
                    }}
                />
                <br/>
            </div>*/}
            {/*            <div
                className="right"
            >*/}
            <section id="main">
                <br/>
                <h2 className="has-text-centered is-size-4">Participantes</h2>
                <br/>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around'
                    }}
                >
                    {this.state.users.map((user) => {
                        return <div id="row" style={{marginBottom: '2%'}}>
                            <Input
                                value={user.username}
                                editable="false"
                                onChange={e => this.setState({})}
                                extra={<Button
                                    disabled={this.props.status !== 'UNSTARTED'}
                                    text="Eliminar"
                                    className="is-danger  is-input-addon"
                                />}
                            />
                        </div>
                    })}
                </div>

                <div id="add">
                  <Button
                      className="is-success"
                      style={{ width: '100%' }}
                      text="Agregar participante"
                      onClick={() => {

                      }}
                  />
                </div>
            </section>
        </div>
    }
}

const mapStateToProps = state => {

    return {
        comission: state.app.comission,
        exchangeRate: state.app.exchangeRate,
        status: state.app.status
    }
}

export default connect(mapStateToProps, {})(AdminManageGame)
