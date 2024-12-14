import { Login } from './components/Login.jsx'
import { Protected } from './components/protected.jsx'
import { useState } from "react"
import './index.css'

export function App () {

const [user, setUser] = useState(() => {
  const dataUser = JSON.parse(localStorage.getItem('access_token'))
  if(dataUser) return dataUser
  return null
})

  return (
    <>  
      <Login user={user} setUser={setUser}></Login>       
      <Protected user={user} setUser={setUser}></Protected>
    </>
  )
}