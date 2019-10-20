import React from 'react'
import { connect } from 'react-redux'
import Input from '../../components/Input'
import Axios from 'axios'
import Button from '../../components/Button'

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
    const { data } = await Axios.post(API_URL, {
      query: `{
        users {
          uuid
          username 
        }
      }
      `
    })
    console.log({ data })
    this.setState({ users: data.data.users })
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
      <div
        className="left"
      >
        <small>Comisión</small>
        <Input
          value={this.state.comission}
          onChange={e => this.setState({ comission: e.target.value })}
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
          onChange={e => this.setState({ exchangeRate: e.target.value })}
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
        <br />
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
        <br />
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
          }} ƒ
        />
        <br />
      </div>
      <div
        className="right"
      >
        <h2 className="has-text-centered is-size-2">Participantes</h2>
        <br />
        <br />
        {this.state.users.map((user) => {
          return <Input
            value={user.username}
            editable="false"
            onChange={e => this.setState({})}
            extra={<Button
              disabled={this.props.status !== 'UNSTARTED'}
              text="Eliminar"
              className="is-danger  is-input-addon"
            />}
          />
        })}
        <br />
        <br />
        <Button
          className="is-fullwidth is-success"
          text="Agregar participante"
          onClick={() => {

          }}
        />
      </div>
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

export default connect(mapStateToProps, {

})(AdminManageGame)