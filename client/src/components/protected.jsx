import '../protected.css'
import Swal from 'sweetalert2'

export function Protected ({user, setUser}) {

    if (user == null) return null 

    const getHours = () => {
        const hours = new Date().getHours()
        if(hours < 12) return 'Buenos dias'
        if(hours < 18) return 'Buenas tardes'
        return 'Buenas noches'
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

    return (
        <main className='main-user'>
            <div className="top-bar"> 
                <a target='_blank' href="http://aplicaciones.unefa.edu.ve/SC3_unefa/modulo/Ms34mun3Pr4Pr/">Siceu</a>
                <a target='_blank' href='http://www.unefa.edu.ve/CMS/administrador/vistas/archivos/REGLAMENTO%20ADMISION%20PERMANENCIA%20Y%20EGRESO.pdf'>Reglamento</a>
                <a target='_blank' href='http://unefa.edu.ve/portal/'>Unefa</a>
                <p>{getHours() + ' ' + user.name}</p>
            </div> 
            <div className="container"> 
                <div className="left-bar"> 
                    <ul> 
                        <li onClick={closeSession}><a href='#'>Cerrar Sesion</a></li>
                    </ul> 
                </div> 
            <div className="content"> 
            </div> 
            </div>
        </main>
    )
}