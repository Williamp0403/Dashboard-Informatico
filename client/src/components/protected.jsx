import '../protected.css'
import cookie from 'js-cookie'

export function Protected ({user, setUser}) {
    console.log('protected ' + user)
    if (user == null) return null 

    // const closeSession = () => {
    //     cookie.remove('access_token')
    //     setUser(null)
    // }

    return (
        <main className='main-user'>
            <header className="header">
                <nav className="nav">
                    <p>Siceu</p>
                    <p>Reglamento</p>
                    <p>WEB UNEFA</p>
                    <p>Bienvenido {user.name}</p>
                </nav>
            </header>
            <section className="nav-second">
                <p>Dasboard Informatico</p>
                <p>Inicio</p>
                <p>Cronograma</p> 
                <p>Actividades</p>  
                <p >Cerrar sesión</p>         
            </section>

        </main>
    )
}