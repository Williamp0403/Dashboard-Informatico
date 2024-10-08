import './App.css';
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [name,setName] = useState("")
  const [lastname, setLastname] = useState("")
  const [identityCard,setIdentiyCard] = useState("")
  const [charge,setCharge] = useState("")
  const [password,setPassword] = useState("")
  
  const addUser = () => {
    axios.post('http://localhost:3001/register', {
      name: name,
      lastname: lastname,
      identityCard: parseInt(identityCard),
      charge: charge,
      password: password
    }).then(()=> {
      alert('Registrado')
    })
  }


  return (
    <div className="App">
      <label>Nombre:</label><input type="text" onChange={(event) => {setName(event.target.value)}}></input>
      <label>Apellido</label><input type="text" onChange={(event) => {setLastname(event.target.value)}}></input>
      <label>C.I:</label><input type="number" onChange={(event) => {setIdentiyCard(event.target.value)}}></input>
      <label>Cargo</label><input type="text" onChange={(event) => {setCharge(event.target.value)}}></input>
      <label>Contrasena:</label><input type="password" onChange={(event) => {setPassword(event.target.value);}}></input>
      <button onClick={addUser} className="btn btn-success">Registrar</button>  
    </div>
  );
}

export default App;
