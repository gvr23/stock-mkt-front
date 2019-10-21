import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
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
            modalState: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    toggleModal() {
        this.setState((prev, props) => {
            const newState = !prev.modalState;

            return {modalState: newState};
        });
    }

    async onClick(e) {
        this.setState({errorPass: undefined, errorUser: undefined})
        e.preventDefault()
        const {user, pass} = this.state
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

        const {data} = await axios.post(API_URL, {
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
                    <a
                        onClick={this.toggleModal}
                        style={{display: 'flex', alignSelf: 'flex-end'}}
                    >Registrarse</a>
                </form>

                <Modal
                    closeModal={this.toggleModal}
                    modalState={this.state.modalState}
                    title="Activar cuenta"
                >
                    <div className="field">
                        <label className="label">Nombre</label>
                        <div className="control">
                            <input className="input" style={{borderWidth: 1, borderColor: '#000'}} type="text"
                                   placeholder="Nombre de grupo"/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input className="input" style={{borderWidth: 1, borderColor: '#000'}} type="email"
                                   placeholder="contraseña"/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input className="input" style={{borderWidth: 1, borderColor: '#000'}} type="email"
                                   placeholder="repita contraseña"/>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const Modal = ({children, closeModal, modalState, title}) => {
    if (!modalState) {
        return null;
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={closeModal}/>
            <div className="modal-card">
                <header className="modal-card-head" style={{ backgroundColor: '#371E9E' }}>
                    <p className="modal-card-title" style={{ color: 'white' }}>{title}</p>
                    <button className="delete" onClick={closeModal}/>
                </header>
                <section className="modal-card-body">
                    <div className="content">
                        {children}
                    </div>
                </section>
                <footer className="modal-card-foot" style={{ backgroundColor: '#371E9E' }}>
                  <div className="control" style={{ marginRight: '2%' }}>
                    <button onClick={closeModal} className="button is-danger">Cancelar</button>
                  </div>
                  <div className="control">
                    <button className="button is-link">Enviar</button>
                  </div>
                </footer>
            </div>
        </div>
    );
}


export default connect(() => ({}), {
    logInUser
})(Login)
