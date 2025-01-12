import axios  from "axios"
import Swal from "sweetalert2"

export const login = ({ identityCard, password, charge, setUser }) => {
    axios.post('http://localhost:3001/login', {
        identityCard: parseInt(identityCard),
        password: password,
        charge: charge
    }).then((res) => {
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

export const register = ({ name,lastname,idCard,newCharge,newPassword,section,idSection,matter,idMatter,setUser }) => {
    const partialUser = {
        name: name,
        lastname: lastname,
        identityCard: parseInt(idCard),
        charge: newCharge,
        password: newPassword
    }

    let user = {}

    if (newCharge == "Students") {
        user = {
            ...partialUser, 
            section: section,
            idSection: parseInt(idSection)
        }
    } else {
        user = {
            ...partialUser, 
            matter: matter,
            idMatter: parseInt(idMatter)
        }
    }
    
    axios.post('http://localhost:3001/register', user).then((res) => {
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

export const getAllMatters = ({ setListMatters }) => {
    axios.get('http://localhost:3001/all-matters').then((res) => {
        setListMatters(res.data)
    }).catch((error) => {

    })
}

export const getSections = ({ setListSections }) => {
    axios.get('http://localhost:3001/semesters').then((res) => {
        setListSections(res.data)
    }).catch((error) => {

    })
}

export const errors = (error) => {
    const e = JSON.parse(JSON.stringify(error)).message
    if(e == 'Request failed with status code 400') return error.response.data.map((data,key) => { return '<br>' + data.message } )       
    if (e == 'Request failed with status code 401') return error.response.data
    if( e == 'Request failed with status code 409') return error.response.data

    return 'Error!! Intente mas tarde'
}