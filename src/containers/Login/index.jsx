import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
  logInUser
} from '../../actions'
import Input from '../../components/Input'
import Button from '../../components/Button'


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorUser: undefined,
      errorPass: undefined,
      user: '',
      pass: '',
    }
    this.onClick = this.onClick.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  async onClick(e) {
    this.setState({ errorPass: undefined, errorUser: undefined })
    e.preventDefault()
    const { user, pass } = this.state
    if (user === '') {
      return this.setState({
        errorUser: 'Debes ingresar usuario',
      })
    }
    if (pass === '') {
      return this.setState({
        errorPass: 'Debes ingresar tu contraseña'
      })
    }

    const { data } = await axios.post(API_URL, {
      query: `{
        login(username: "${user}", password: "${pass}") {
          uuid
          username
          admin
          balance
          params{
            comission
            exchangeRate
            status
          }
        }
      }`
    })
    if (data.errors) {
      const key = data["errors"][0] === 'NOT_FOUND' ? 'errorUser' : 'errorPass'
      const err = data["errors"][0] === 'NOT_FOUND' ? 'El usuario ingresado no existe' : 'La contraseña ingresada es incorrecta'
      return this.setState({
        [key]: err
      })
    }
    this.props.logInUser(data.data.login)
    setTimeout(() => {
      window.location.reload()
    }, 250);
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const {
      errorUser,
      errorPass,
      user,
      pass,
    } = this.state
    return (
      <div
        className="_login_container"
      >
        <form
          className="_login_form"
        >
          <h1
            className="is-size-4 title has-text-centered"
          >
            Ingresar
          </h1>
          <div
          >
            <Input
              error={errorUser}
              autoComplete="username"
              placeholder="Usuario"
              icon="user"
              value={user}
              name="user"
              onChange={this.onChange}
            />
            <Input
              name="pass"
              autoComplete="current-password"
              type="password"
              error={errorPass}
              value={pass}
              placeholder="Contraseña"
              icon="lock"
              onChange={this.onChange}
            />
            <Button
              onClick={this.onClick}
              text={"Aceptar"}
              className={"is-primary"}
              isFluid
            />
          </div>
          <a style={{ display: 'flex', alignSelf: 'flex-end' }}>Registrarse</a>
        </form>

      </div>
    )
  }
}


export default connect(() => ({}), {
  logInUser
})(Login)
