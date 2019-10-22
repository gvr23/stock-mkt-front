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
            modalState: false,
           /* errorGroupName: undefined,
            errorGroupPassword: undefined,
            newGroupName: '',
            newGroupPassword: ''*/
        }
        /*this.toggleModal = this.toggleModal.bind(this);*/
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        /*this.onRegister = this.onRegister.bind(this);*/
    }

    /*toggleModal() {
        this.setState((prev, props) => {
            const newState = !prev.modalState;

            return {modalState: newState};
        });
    }*/

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

   /* onRegister = async () => {
        const {newGroupName, newGroupPassword} = this.state;
        const that = this;
        this.setState({errorGroupName: undefined, errorGroupPassword: undefined});

        if (newGroupName.length <= 0) {
            return this.setState({
                errorGroupName: 'Debes registrar un nombre',
            })
        }
        if (newGroupPassword.length <= 0) {
            return this.setState({
                errorGroupPassword: 'Debes registrar una contraseña'
            })
        }
        await axios.post(API_URL, {
            query: `mutation{
                        createUser(username: "${newGroupName}" password: "${newGroupPassword}") {
                            username
                            uuid
                        }
                    }`
        })
            .then(rep => {
                if(rep.status === 200){
                    if (rep.data.errors) {
                        const key = 'errorGroupName';
                        const err = 'El nombre ingresado ya existe';
                        return this.setState({
                            [key]: err
                        })
                    } else {
                        this.toggleModal();
                        that.setState({ newGroupName: '', newGroupPassword: '' });
                    }
                }
            })
            .catch(er => console.log('this is the err, ', er));
    }*/

    render() {
        const {
            errorUser,
            errorPass,
            user,
            pass
/*            errorGroupName,
            errorGroupPassword,
            newGroupName,
            newGroupPassword*/
        } = this.state;
        return (
            <div
                className="_login_container"
            >
                <form
                    className="_login_form"
                >
                    <h1
                        className="is-size-4 title has-text-centered"
                        style={{ color: 'white' }}
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
                            style={{ backgroundColor: '#371E9E' }}
                            isFluid
                        />
                    </div>
                  {/*  <a
                        onClick={this.toggleModal}
                        style={{display: 'flex', alignSelf: 'flex-end' }}
                    >Registrarse</a>*/}
                </form>

                {/*<Modal
                    closeModal={this.toggleModal}
                    modalState={this.state.modalState}
                    onPress={this.onRegister}
                    title="Activar cuenta"
                >
                    <div className="field">
                        <label className="label" style={{color: '#5D4E75'}}>Nombre</label>
                        <Input
                            style={{borderWidth: 1, borderColor: '#371E9E'}}
                            error={errorGroupName}
                            autoComplete="group name"
                            placeholder="Nombre de grupo"
                            value={newGroupName}
                            name="newGroupName"
                            onChange={this.onChange}
                        />
                    </div>
                    <div className="field">
                        <label className="label" style={{color: '#5D4E75'}}>Contraseña</label>
                        <Input
                            style={{borderWidth: 1, borderColor: '#371E9E'}}
                            error={errorGroupPassword}
                            autoComplete="password"
                            placeholder="Contraseña"
                            value={newGroupPassword}
                            name="newGroupPassword"
                            onChange={this.onChange}
                        />
                    </div>
                </Modal>*/}
            </div>
        )
    }
}

/*const Modal = ({children, closeModal, modalState, title, onPress}) => {
    if (!modalState) {
        return null;
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={closeModal}/>
            <div className="modal-card">
                <header className="modal-card-head" style={{backgroundColor: '#371E9E'}}>
                    <p className="modal-card-title" style={{color: 'white'}}>{title}</p>
                    <button className="delete" onClick={closeModal}/>
                </header>
                <section className="modal-card-body">
                    <div className="content">
                        {children}
                    </div>
                </section>
                <footer className="modal-card-foot" style={{backgroundColor: '#371E9E'}}>
                    <div className="control" style={{marginRight: '2%'}}>
                        <button onClick={closeModal} className="button is-danger">Cancelar</button>
                    </div>
                    <div className="control">
                        <button onClick={onPress} className="button is-link">Enviar</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}*/


export default connect(() => ({}), {
    logInUser
})(Login)
