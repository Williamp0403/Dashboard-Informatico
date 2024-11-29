import { useState } from "react"
import axios from 'axios'
import Swal from 'sweetalert2'
import cookie from 'js-cookie'
import '../App.css'

export function Login ({user,setUser}) {
    console.log('login ' + user)
    if (user != null) return

    const [identityCard, setIdentityCard] = useState(Number)
    const [password,setPassword] = useState('')

    const [name,setName] = useState('')
    const [lastname,setLastname] = useState('')
    const [idCard,setIdCard] = useState(Number)
    const [charge,setCharge] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [modal,setModal] = useState(false)
    const state = modal ? 'modal' : ''
    
    const login = () => {
        axios.post('http://localhost:3001/login', {
            identityCard: parseInt(identityCard),
            password: password
        }).then((res) => {
            Swal.fire({
                html: "Bienvenido " + res.data.user.name,
                icon: "success"
            }).then(() => {
                cookie.set('access_token', res.data.token)
                setUser(res.data.user)
            })
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    const register = () => {
        axios.post('http://localhost:3001/register', {
            name: name,
            lastname: lastname,
            identityCard: parseInt(idCard),
            charge: charge,
            password: newPassword
        }).then((res) => {
            Swal.fire({
                text: "Registrado correctamente",
                html: "Bienvenido " + res.data.name,
                icon: "success"
            })
        }).catch((error) => {
            console.log(error)
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    const cleanInputs = () => {
        console.log('clean')
        setName('')
        setLastname('')
        setIdCard('')
        setCharge('')
        setNewPassword('')
    }

    const errors = (error) => {
        const e = JSON.parse(JSON.stringify(error)).message
        if(e == 'Request failed with status code 400') return error.response.data.map((data,key) => { return '<br>' + data.message } )       
        if (e == 'Request failed with status code 401') return error.response.data
        if( e == 'Request failed with status code 409') return error.response.data

        return 'Error!! Intente mas tarde'
    }

    return (
        <main className="main-login">
        <article className="login">
            <h1 className="login-text">Iniciar sesión</h1>
            <input className="login-input" type="number" placeholder="Cédula" 
                onChange={(event)=>setIdentityCard(event.target.value)}/>
            <input className="login-input" type="password" placeholder="Contraseña" 
                onChange={(event)=>setPassword(event.target.value)}/>
            <p className="register">No tienes cuenta? haz <a href='#' onClick={()=>{setModal(true)}}>Click aqui</a> para registrarte</p>
            <dialog className={state}>
                    <button className="closeModal" 
                        onClick={()=>{
                                setModal(false)
                                cleanInputs()
                            }}>X
                    </button>
                <div className="modal-container">
                        <input className="modal-input" placeholder="Nombre" value={name} type="text" 
                            onChange={(event)=>setName(event.target.value)}/>
                        <input className="modal-input" placeholder="Apellido" value={lastname} type="text"
                            onChange={(event)=>setLastname(event.target.value)}/>
                        <input className="modal-input" placeholder="Cédula" value={idCard} type="number"
                            onChange={(event)=>setIdCard(event.target.value)}/>
                        <input className="modal-input" placeholder="Contraseña" value={newPassword} type="password"
                            onChange={(event)=>setNewPassword(event.target.value)}/>
                        <div className="radio-input">
                            <label>
                                <input onClick={(event)=>{setCharge(event.target.value)}} value="Estudiante" id="value-1" name="value-radio" type="radio" />
                                <span>Estudiante</span>
                            </label>
                            <label>
                                <input onClick={(event)=>{setCharge(event.target.value)}} value="Profesor" name="value-radio" id="value-2" type="radio" />
                                <span>Profesor</span>
                            </label>
                            <span className="selection"></span>
                        </div>
                    </div>
                    <button className="modal-button" onClick={register}>Enviar</button>
            </dialog>
            <button className="login-button" onClick={login}>Entrar</button>
        </article>
        </main>
    )
}