import React from 'react'
import {connect} from 'react-redux'
import Input from '../../components/Input'
import Axios from 'axios'
import Button from '../../components/Button'

import {setSelected} from '../../actions';
import {store} from 'react-notifications-component';
import {play, pause, stop} from '../../assets/images';

class AdminManageGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comission: this.props.comission,
            exchangeRate: this.props.exchangeRate,
            users: [],
            errorGroupName: undefined,
            errorGroupPassword: undefined,
            newGroupName: '',
            newGroupPassword: '',
            eliminated: false,
            deleteModal: false,
            resetModal: false,
            resetError: '',
            loadingData: false,
            userToDelete: null
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onEliminate = this.onEliminate.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    async componentDidMount() {
        const {data} = await Axios.post(API_URL, {
            query: `{
                        users {
                          uuid
                          username 
                        }
                    }`
        })
        this.setState({users: data.data.users})
    }

    toggleModal() {
        this.setState((prev, props) => {
            const newState = !prev.modalState;

            return {modalState: newState};
        });
    }

    onRegister = async () => {
        const {newGroupName, newGroupPassword} = this.state;
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
        const {data} = await Axios.post(API_URL, {
            query: `mutation{
                        createUser(username: "${newGroupName}" password: "${newGroupPassword}") {
                            username
                            uuid
                        }
                    }`
        });
        if (data.errors) {
            const key = 'errorGroupName';
            const err = 'El nombre ingresado ya existe';
            return this.setState({
                [key]: err
            })
        } else {
            const {data} = await Axios.post(API_URL, {
                query: `{
                        users {
                          uuid
                          username 
                        }
                    }`
            });
            this.setState({users: data.data.users, newGroupName: '', newGroupPassword: ''}, () => {
                this.toggleModal();
                return store.addNotification({
                    title: "Éxito",
                    message: `El grupo se creó correctamente`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
            });
        }
    }
    onEliminate = async () => {
        const {data} = await Axios.post(API_URL, {
            query: `mutation{
                      deleteUser(uuid: "${this.state.userToDelete.uuid}"){
                        success
                      }
                    }`
        });
        if (data.errors) {
            this.setState({deleteModal: false, userToDelete: null});
            return store.addNotification({
                title: "Error",
                message: `El grupo no se eliminó correctamente`,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        } else {
            this.setState({eliminated: true, deleteModal: false, userToDelete: null});
            const {data} = await Axios.post(API_URL, {
                query: `{
                        users {
                          uuid
                          username 
                        }
                    }`
            });
            this.setState({users: data.data.users, eliminated: false}, () => {
                return store.addNotification({
                    title: "Éxito",
                    message: `El grupo se eliminó correctamente`,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
            });
        }
    };
    onAskEliminate = () => {
        /*let prompt = confirm(`Deseas eliminar a ${String(user.username)}`);
        if (prompt) {
            this.onEliminate(user.uuid);
        }*/
        if (this.state.userToDelete) {
            return (
                <div className="columns" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="column is-8">
                        <div className="message is-warning">
                            <div className="message-header"
                                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <p>{`¿Deseas eliminar a ${String(this.state.userToDelete.username)}?`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return '';

    };

    onChange = (e) => this.setState({[e.target.name]: e.target.value});
    onAskReset = () => {
        if (this.state.resetModal) {
            return (
                <div className="columns" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="column is-8">
                        <label className="label" style={{color: '#5D4E75'}}>Contraseña</label>
                        <Input
                            style={{borderWidth: 1, borderColor: '#371E9E'}}
                            error={this.state.resetError}
                            placeholder="ingrese contraseña"
                            name="adminPassword"
                            onChange={this.onChange}
                        />
                    </div>
                </div>
            )
        }
    }
    onReset = async () => {
        const {data} = await Axios.post(API_URL, {
            query: `{
        login(username: "${this.props.username}", password: "${this.state.adminPassword}") {
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
        });
        if (data.errors) {
            return this.setState({ resetError: 'La contraseña ingresada es incorrecta' });
        } else {
            const { data } = await Axios.post(API_URL, {
                query: `mutation{
                      resetValues{
                        success
                      }
                    }`
            });
            this.setState({ resetModal: false, adminPassword: '' }, () => {
                if (data.errors){
                    return store.addNotification({
                        title: "Oops",
                        message: `El juego no se reinició correctamente`,
                        type: "danger",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                } else {
                    this.props.setSelected(0);
                    return store.addNotification({
                        title: "Éxito",
                        message: `El juego se reinició correctamente`,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
            })
        }
    }

    render() {
        const {
            errorGroupName,
            errorGroupPassword,
            newGroupName,
            newGroupPassword
        } = this.state;
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
                        <li>
                            <button className="button is-info is-fullwidth"
                                    onClick={() => this.setState({resetModal: true})}>Reiniciar
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="menu-footer">
                    <div
                        className="btn"
                        style={{backgroundColor: (this.props.selected === 1) ? '#25146b' : null}}
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "PAUSED"){
                                                              success
                                                }
                                      }`
                            })
                            this.props.setSelected(1);
                        }}>
                        <img style={{width: '54%', height: '40%'}} src={pause}/>
                    </div>
                    <div
                        className="btn"
                        style={{backgroundColor: (this.props.selected === 2) ? '#25146b' : null}}
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "STARTED"){
                                                  success
                                                }
                                        }`
                            })
                            this.props.setSelected(2);
                        }}
                    >
                        <img style={{width: '54%', height: '40%'}} src={play}/>
                    </div>
                    <div
                        className="btn"
                        style={{backgroundColor: (this.props.selected === 3) ? '#25146b' : null}}
                        onClick={() => {
                            Axios.post(API_URL, {
                                query: `mutation{
                                                changeStatus(status: "ENDED"){
                                                  success
                                                }
                                        }`
                            })
                            this.props.setSelected(3);
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
                        height: '70vh',
                        margin: '2rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridTemplateRows: '1fr 1fr 1fr',
                        overFlowX: 'hidden',
                        overflowY: 'auto',
                    }}
                >
                    {this.state.users.map((user) => {
                        return <div id="row" style={{marginBottom: '2%'}}>
                            <Input
                                value={String(user.username)}
                                editable="false"
                                onChange={e => this.setState({})}
                                extra={<Button
                                    isLoading={this.state.eliminated}
                                    disabled={this.state.eliminated}
                                    text="Eliminar"
                                    className="is-danger  is-input-addon"
                                    onClick={() => {
                                        this.setState({userToDelete: user, deleteModal: true});
                                    }}
                                />}
                            />
                        </div>
                    })}
                </div>

                <div id="add">
                    <Button
                        className="is-success"
                        style={{width: '100%'}}
                        text="Agregar participante"
                        onClick={this.toggleModal}
                    />
                </div>
            </section>

            <Modal
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
                        value={String(newGroupName)}
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
                        value={String(newGroupPassword)}
                        name="newGroupPassword"
                        onChange={this.onChange}
                    />
                </div>
            </Modal>

            <Modal
                closeModal={() => this.setState({deleteModal: false, userToDelete: null})}
                modalState={this.state.deleteModal}
                onPress={this.onEliminate}
                title="Eliminar Usuario"
            >
                {this.onAskEliminate()}
            </Modal>
            <Modal
                closeModal={() => this.setState({resetModal: false})}
                modalState={this.state.resetModal}
                onPress={this.onReset}
                title="Reinciar Juego"
            >
                {this.onAskReset()}
            </Modal>
        </div>
    }
}

const Modal = ({children, closeModal, modalState, title, onPress}) => {
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
}

const mapStateToProps = state => {

    return {
        comission: state.app.comission,
        exchangeRate: state.app.exchangeRate,
        status: state.app.status,
        selected: state.app.selected,
        username: state.app.username
    }
}

export default connect(mapStateToProps, {setSelected})(AdminManageGame)
