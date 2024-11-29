import { Login } from './components/Login.jsx'
import { Protected } from './components/protected.jsx'
import { useState } from "react"
import cookie from 'js-cookie'
import './index.css'

export function App () {

const [user, setUser] = useState(null)


 console.log('main ' + user)

  return (
    <>  
      <Login user={user} setUser={setUser}></Login>       
      <Protected user={user} setUser={setUser}></Protected>
    </>
  )
}