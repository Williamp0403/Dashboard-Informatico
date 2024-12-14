import { useState } from "react"
import { ButtonRadio } from "./ButtonRadio.jsx"
import axios from 'axios'
import Swal from 'sweetalert2'
import '../App.css'

export function Login ({user, setUser}) {

    if (user != null) return null

    const [identityCard, setIdentityCard] = useState(Number)
    const [password,setPassword] = useState('')
    const [charge, setCharge] = useState('')

    const [name,setName] = useState('')
    const [lastname,setLastname] = useState('')
    const [idCard,setIdCard] = useState(Number)
    const [newCharge,setNewCharge] = useState('')
    const [matter,setMatter] = useState(Number)
    const [newPassword, setNewPassword] = useState('')

    const [listMatters, setListMatters] = useState([])

    const [modal,setModal] = useState(false)
    const state = modal ? 'modal' : ''
    
    const login = () => {
        axios.post('http://localhost:3001/login', {
            identityCard: parseInt(identityCard),
            password: password,
            charge: charge
        }).then((res) => {
            console.log('login: ', res)
            Swal.fire({
                html: "Bienvenido " + res.data.name,
                icon: "success"
            }).then(() => {
                localStorage.setItem('access_token', JSON.stringify(res.data))
                setUser(res.data)
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
            charge: newCharge,
            matter: matter,
            password: newPassword
        }).then((res) => {
            console.log(res)
            Swal.fire({
                text: "Registrado correctamente",
                html: "Bienvenido " + res.data.name,
                icon: "success"
            }).then(() => {
                localStorage.setItem('access_token', JSON.stringify(res.data))
                setUser(res.data)
            })
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    const getMatters = () => {
        axios.get('http://localhost:3001/matters').then((res) => {
            setListMatters(res.data)
        }).catch((error) => {

        })
    }

    const cleanInputs = () => {
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
            <div className="mydict">
                <div>
                <ButtonRadio setCharge={setCharge} value={"Students"} name={"Estudiante"}></ButtonRadio>
                <ButtonRadio setCharge={setCharge} value={"Teachers"} name={"Profesor"}></ButtonRadio>
                </div>
            </div>
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
                        <input className="modal-input" placeholder="Contraseña" value={newPassword}type="password"
                    onChange={(event)=>setNewPassword(event.target.value)}/>
                    {
                        newCharge == "Teachers" ? 
                        <div className="container-matters"> 
                        <label className="container-matters-label" htmlFor="materia">Selecciona una materia:</label>
                        <select onChange={(event) => {
                            setMatter(event.target.selectedOptions[0].getAttribute("matter-id"))}
                            } 
                        className="container-matters-select" id="materia" name="materia"> 
                        {
                            listMatters.map((data,key) => {
                                return <option key={data.id_matter} matter-id={data.id_matter} value={data.matter_name}>{data.matter_name}</option>
                            })
                        }
                        </select>
                        </div>
                        : null
                    }
                    <div className="mydict">
                        <div>
                            <ButtonRadio setCharge={setNewCharge} value={"Students"} name={"Estudiante"}></ButtonRadio>
                            <ButtonRadio getMatters={getMatters} setCharge={setNewCharge} value={"Teachers"} name={"Profesor"} id="register_teacher"></ButtonRadio>
                        </div>
                    </div>
                </div>
                <button className="modal-button" onClick={register}>Enviar</button>
            </dialog>
            <button className="login-button" onClick={login}>Entrar</button>
        </article>
        </main>
    )
}