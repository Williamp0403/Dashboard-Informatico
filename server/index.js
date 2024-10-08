import express from 'express'
import cors from 'cors'
import { validateUser, validatePartialUser } from './schemas/users.js'
import { userModel } from './models/turso.js'

const app = express()

const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.get('/', async (req,res) => {
    res.send('<h1>Servidor</h1>')
})

app.post('/register', async (req,res) => {
    const result = validateUser(req.body)
    if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    
    const { name,lastname,identityCard,charge,password } = req.body

    const user = await userModel.register({ name,lastname,identityCard,charge,password })
    if(!user) return res.status(400).send('EL usuario ya existe')

    res.json({ user: user })
})

app.post('/login', async (req,res) => {
    const result = validatePartialUser(req.body)
    if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    
    const { identityCard,password } = req.body
    
    const user = await userModel.login({ identityCard,password })
    if(!user) return res.status(401).send('Usuario o contrasena incorrecta')

    res.send(user)
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto http://localhost:${PORT}`)
})