import { useState } from "react"
import { ButtonRadio } from "./ButtonRadio.jsx"
import { Options } from "./Options.jsx"
import { login, register, getAllMatters, getSections} from '../logic/login.js'
import '../App.css'

export function Login ({user, setUser}) {
    // Si hay usuario con sesion activa, retorna null, si no, sigue el codigo
    if (user != null) return null

    // Constantes que guardan los valores al iniciar sesion
    const [identityCard, setIdentityCard] = useState(Number)
    const [password,setPassword] = useState('')
    const [charge, setCharge] = useState('')

    // Constantes que guardan los valores al registrarse
    const [name,setName] = useState('')
    const [lastname,setLastname] = useState('')
    const [idCard,setIdCard] = useState(Number)
    const [newCharge,setNewCharge] = useState('')
    const [section,setSection] = useState('')
    const [idSection, setIdSection] = useState('')
    const [idMatter, setIdMatter] = useState('')
    const [matter,setMatter] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [listMatters, setListMatters] = useState([])
    const [listSections, setListSections] = useState([]) 

    const [modalIsOpen,setModalIsOpen] = useState(false)
    
    const buttonLogin = () => {
        login({ identityCard, password, charge, setUser })
    }

    const buttonRegister = () => {
        register({ name,lastname,idCard,newCharge,newPassword,section,idSection,matter,idMatter,setUser })
    }

    const buttonMatters = () => {
        getAllMatters({ setListMatters })
    }

    const buttonSections = () => {
        getSections({ setListSections })
    }

    const cleanInputs = () => {
        setName('')
        setLastname('')
        setIdCard('')
        setCharge('')
        setNewPassword('')
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
            <p className="register">No tienes cuenta? haz <a href='#' onClick={()=>{setModalIsOpen(true)}}>Click aqui</a> para registrarte</p>
            {
                modalIsOpen == false ? null
                :
                <section className="modalContainer">
                    <div className="modalContent">
                        <button className="closeModal" 
                            onClick={()=>{
                                    setModalIsOpen(false)
                                    cleanInputs()
                            }}>X
                        </button>
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
                                <Options title="Selecciona una materia" getData={setMatter} getID={setIdMatter} showData={listMatters}></Options>
                            : newCharge == "Students" ?  
                                <Options title="Selecciona un semestre" getData={setSection} getID={setIdSection} showData={listSections}></Options>
                            : null
                        }
                        <div className="mydict">
                            <div>
                                <ButtonRadio getData={buttonSections} setCharge={setNewCharge} value={"Students"} name={"Estudiante"} type="show-data"></ButtonRadio>
                                <ButtonRadio getData={buttonMatters} setCharge={setNewCharge} value={"Teachers"} name={"Profesor"} type="show-data"></ButtonRadio>
                            </div>
                        </div>
                        <button className="modal-button" onClick={buttonRegister}>Enviar</button>
                    </div>
                </section>
            }
            <button className="login-button" onClick={buttonLogin}>Entrar</button>
        </article>
        </main>
    )
}