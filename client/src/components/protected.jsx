import '../protected.css'
import Swal from 'sweetalert2'
import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Sections } from './Sections.jsx'
import { AddActivity } from './AddActivity.jsx'
import { ContainerActivitie } from './ContainerActivitie.jsx'
import { Chat } from './Chat.jsx'
import { Modal } from './Modal.jsx'
import { errors } from '../logic/login.js'
import { getHours } from '../logic/protected.js'
import axios from 'axios'


export function Protected ({user, setUser}) {

    if (user == null) return null 

    const { id_section, id_matter } = user

    const socket = io('http://localhost:3001', {
        query: {
            id_section,
            id_matter 
        }
    })

    const [activateOption,setActivateOption] = useState(0)
    const [modalIsOpen,setModalIsOpen] = useState(false)

    const [listActivities, setListActivities] = useState([])
    const [listNotes, setListNotes] = useState([])
    const [listMatters, setListMatters] = useState([])
    const [listNotesStudent, setListNotesStudent] = useState([])

    const [activitie, setActivitie] = useState(null)
    const [matter, setMatter] = useState(null)

    const [ifNote, setIfNote] = useState(null)

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const [listGroups, setListGroups] = useState([])
    const [group, setGroup] = useState('')
    const [nameGroup, setNameGroup] = useState('')
    const messageBoxRef = useRef(null);

    const showInit = () => {
        console.log('inicio')
    }

    const showActivities = () => {
        console.log('activitie')
        getActivities()
    }

    const getRooms = () => {
        axios.get(`http://localhost:3001/rooms?id_matter=${user.id_matter}&id_section=${user.id_section}`).then((res) => {
            setListGroups(res.data)
            console.log(res)
        })
    }

    const getActivities = () => {
        axios.get(`http://localhost:3001/activitie?id_matter=${user.id_matter}&id_section=${user.id_section}`).then((res)=> {
            setListActivities(res.data)
        }).catch((error) => {
            setListActivities('Intente mas tarde')
        })
    }

    const getMatters = () => {
        axios.get(`http://localhost:3001/matters?id_section=${user.id_section}`).then((res) => {
            setListMatters(res.data)
        }).catch((error) => {

        })
    }

    const showNotes = () => {
        getActivities()
        getMatters()
    }

    const handleSelect = (event) => {
        const selectActivitie = event.target.value
        setActivitie(selectActivitie)
        getNotes(selectActivitie)
    }

    const getNotes = (selectActivitie) => {
        axios.get(`http://localhost:3001/notes?id_matter=${user.id_matter}&id_activitie=${selectActivitie}`).then((res) => {
            setIfNote(res.data[0].rating)
            setListNotes(res.data)
        }) 
    }

    const getMattersByID = (selectMatter) => {
        axios.get(`http://localhost:3001/notes-student?id_matter=${selectMatter}&id_student=${user.id_student}`).then((res)=> {
            setListNotesStudent(res.data)
        }).catch((error) => {

        })
    }

    const handleChangeNotes = (event, key) => {
        const newListNotes = [...listNotes]
        newListNotes[key].rating = parseInt(event.target.value)
        setListNotes(newListNotes)
    }

    const handleChangeMatters = (event) => {
        const selectMatter = event.target.value
        setMatter(selectMatter)
        getMattersByID(selectMatter)
    }

    const sendNotes = () => {
        axios.post('http://localhost:3001/create-notes', {
            listNotes,
            activitie
        }).then((res) => {
            Swal.fire({
            text: res.data,
            icon: "success"
        })
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    const editNotes = () => {
        axios.put('http://localhost:3001/update-notes', {
            listNotes,
            activitie
        }).then((res) => {
            Swal.fire({
                text: res.data,
                icon: "success"
            })
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    const showChat = () => {
        getMatters()
        getRooms()
        console.log('chat')
    }

    const joinRoom = (data) => {
        if(group !=  data.id_matter) setMessages([])
        setGroup(data.id_matter)
        setNameGroup(data.matter_name)
        socket.emit('join room', data.id_matter)
    }

    const getMessages = () => {
        console.log('messa')
        axios.get(`http://localhost:3001/messages?room=${group}`).then((res) => {
            setMessages(res.data)
        }).catch((error) => {

        })
    }

    useEffect(() => {
        scrollToBottom() 
    }, [group])

    const scrollToBottom = () => { 
        if (messageBoxRef.current) { 
            console.log('scroll')
            console.log(messageBoxRef.current)
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight
        }
    }

    useEffect(() => {
        getMessages()
        socket.on('chat message', (msg) => {
            if(msg.group == group) {
                setMessages((prevMessages) => [...prevMessages, { content: msg.content , hour: msg.hour, username: msg.username}])
                scrollToBottom()
            }
        })

        return() => {
            socket.off('chat message')
        }
    }, [group])

    const sendMessage = (event) => {
        event.preventDefault()
        if (message.trim()) {
            const now = new Date(), hours = now.getHours(), minutes = now.getMinutes() 
            const ampm = hours >= 12 ? 'pm' : 'am'
            const formattedHours = hours % 12 || 12 // Convierte 0 en 12 
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
            const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`

            socket.emit('set message', { content: message, hour: timeString, username: user.name, group: group })
            setMessage('')
        }
    }

    const closeSession = () => {
        Swal.fire({
            title: "¿Desea cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: 'Cancelar'
        }).then((result) => { 
            if (result.isConfirmed) {
                localStorage.removeItem('access_token')
                setUser(null)
            }
        });
    }

    const options = [
        {
            click: showInit,
            title: 'Inicio',
            d: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        },
        {
            click: showActivities,
            title: 'Actividades',
            d: 'M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'
        },
        {
            click: showNotes,
            title: 'Notas',
            d: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z'
        },
        {
            click: showChat,
            title: 'Chat',
            d: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
        },
        {
            click: closeSession,
            title: 'Cerrar Sesión',
            d: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75'
        }
    ]

    return (
        <main className='main-user'>
            <div className="top-bar"> 
                <a target='_blank' href="http://aplicaciones.unefa.edu.ve/SC3_unefa/modulo/Ms34mun3Pr4Pr/">Siceu</a>
                <a target='_blank' href='http://www.unefa.edu.ve/CMS/administrador/vistas/archivos/REGLAMENTO%20ADMISION%20PERMANENCIA%20Y%20EGRESO.pdf'>Reglamento</a>
                <a target='_blank' href='http://unefa.edu.ve/portal/'>WEB UNEFA</a>
                <p>{getHours() + ' ' + user.name}</p>
            </div> 
            <div className="container"> 
                <div className="left-bar"> 
                  {
                    options.map((option,index) => {
                        const {click, title, d} = option
                        return (
                            <Sections
                                key={index}
                                index={index}
                                click={click}
                                title={title}
                                d={d}
                                activateOption={activateOption == index}
                                setActivateOption={setActivateOption}
                            >
                            </Sections>
                        )
                    })
                  }
                </div> 
            <div className="content">               
                {
                    activateOption == 0 ?
                        <h1>Inicio</h1> 

                    : activateOption == 1 ?
                    <>  
                    {
                        user.charge == "Teachers" ? 
                        <AddActivity setModalIsOpen={setModalIsOpen}></AddActivity>
                        : null
                    }
                        <Modal 
                            modalIsOpen={modalIsOpen} 
                            setModalIsOpen={setModalIsOpen}
                            id_matter={user.id_matter}
                            getActivities={getActivities}
                        >
                        </Modal>
                        <section className='container-activities'>
                        {
                            (typeof listActivities != "string") ? 
                                listActivities.map((activitie,key) => {
                                const { title, description, court, date, value } = activitie
                                return <ContainerActivitie 
                                        key={key}
                                        title={activitie.title}
                                        description={activitie.description}
                                        court={activitie.court}
                                        date={activitie.date}
                                        value={activitie.value}
                                    >
                                    </ContainerActivitie>
                                })
                                : <h1>{listActivities}</h1>
                        }
                        </section>
                    </>
                    : activateOption == 2 ?
                    <section className='container-notes'>
                    {
                        (user.charge == "Teachers") ? 
                            (typeof listActivities != "string") ?
                            <>
                            <label htmlFor="">Seleccione la actividad: <select onClick={() => handleSelect(event)} className='select'> 
                                { 
                                    listActivities.map((activitie,key) => {
                                        return <option value={activitie.id_activitie} key={key}>{activitie.title + ' / ' + activitie.court}</option>
                                    })
                                }
                            </select>  
                            </label>
                            <table className='table-notes'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Cédula</th>
                                        <th>Nota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    listNotes.map((data,key) => {
                                        return <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{data.name}</td>
                                                    <td>{data.lastname}</td>
                                                    <td>{data.identityCard}</td>
                                                    <td><input onChange={() => handleChangeNotes(event, key)} type="number" value={data.rating || ''}/></td>
                                                </tr>
                                    })
                                }
                                </tbody>
                            </table>
                            {
                                (ifNote) ?
                                <button onClick={editNotes} className='button-notes update'>
                                    Actualizar notas
                                    <svg className="svg" viewBox="0 0 512 512">
                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                </button>
                                : <button onClick={sendNotes} className='button-notes send'>
                                    Enviar notas
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                </button>
                            }                           
                            </>
                            : <h1>{listActivities}</h1>
                        : user.charge == "Students" ?
                            <>
                            <label> Selecciona una materia: <select onClick={() => handleChangeMatters(event)} className='select'>
                                    {
                                        listMatters.map((data,key) => {
                                            return <option key={key} value={data.id_matter} >{data.matter_name}</option>
                                        })
                                    }
                                </select>
                            </label>
                            <table className='table-notes'>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Corte</th>
                                        <th>Porcentaje</th>
                                        <th>Puntos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listNotesStudent.map((data,key) => {
                                            return <tr key={key}>
                                                        <td>{data.title}</td>
                                                        <td>{data.court}</td>
                                                        <td>{data.value}%</td>
                                                        <td>{data.rating}</td>
                                                    </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            </>
                        : null
                        }
                        
                    </section>
                    : activateOption == 3 ? 
                    <section className='container-chat'>
                            <div className='content-group' >
                                <h1>Chats</h1>
                                <ul className="dropdown-menu"> 
                                    {
                                    listGroups.map((data,key) => {                                            
                                        return <div className={`room ${group == data.id_matter ? 'active': ''}`} onClick={() => joinRoom(data)} key={data.id_matter}>{data.matter_name}</div>
                                    })
                                    }
                                </ul> 
                            </div>
                            { (!nameGroup) ? 
                                <div className='box-info'>
                                    <h1>CHAT UNEFA</h1>
                                    <img src="https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_1280.png" alt=""/>
                                    <p>Seleccione un chat para continuar</p>
                                </div>
                                : <Chat message={message} mesagges={messages} setMessage={setMessage} sendMessage={sendMessage} nameGroup={nameGroup} messageBoxRef={messageBoxRef}></Chat>
                            }
                        
                    </section>
                    : null
                }
            </div> 
            </div>
        </main>
    )
}