import axios from 'axios'
import Swal from 'sweetalert2'
import '../Modal.css'
import { errors } from '../logic/login.js'
import { useState } from 'react'

export function Modal ({modalIsOpen, setModalIsOpen, id_matter, getActivities}) {

    if(modalIsOpen == false) return null

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [court, setCourt] = useState('')
    const [date, setDate] = useState('')
    const [value, setValue] = useState('')
    
    const closeModal = () => {
        setModalIsOpen(false)
    }

    const setActivitie = () => {
        axios.post('http://localhost:3001/create-activitie', {
            title,
            description,
            court,
            id_matter,
            date,
            value: parseInt(value)
        }).then((res) => {
            Swal.fire({
                html: "Actividad registrada",
                icon: "success"
            })
            setModalIsOpen(false)
            getActivities()
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                text: "Error!",
                html: errors(error)
            })
        })
    }

    return (
        <section className='modal-container'>
            <div className='modal-content'>
                <button className='close-modal' onClick={closeModal}>X</button>
                <input onChange={(event) => setTitle(event.target.value)} className='modal-content-title' type='text' placeholder='Añadir Título'></input>
                <textarea onChange={(event) => setDescription(event.target.value)} className='modal-content-description' placeholder='Descripción'></textarea>
                <label htmlFor="">Selcciona un corte      
                    <select onClick={(event) => setCourt(event.target.value)}>
                        <option value="I Corte">I Corte</option>
                        <option value="II Corte">II Corte</option>
                        <option value="III Corte">III Corte</option>
                        <option value="IV Corte">IV Corte</option>
                    </select>
                </label>
                <label>Fecha <input onChange={(event) => setDate(event.target.value)} className='modal-content-date' type='date'></input></label>
                <label>Porcentaje <input onChange={(event) => setValue(event.target.value)} className='modal-content-value' type='number'></input></label>
                <button className='modal-content-set' onClick={setActivitie}>Enviar</button>
            </div>
        </section>
    )
}