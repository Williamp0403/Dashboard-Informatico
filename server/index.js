import express from 'express'
import cors from 'cors'
import { validateUser, validatePartialUser } from './schemas/users.js'
import { userModel } from './models/mysql.js'
import cookieParser from 'cookie-parser'

const app = express()

const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/', async (req,res) => {
    res.send('<h1>Servidor</h1>')
})

app.post('/register', async (req,res) => {
    const result = validateUser(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)
    const { name,lastname,identityCard,charge,matter,password } = req.body

    const user = await userModel.register({ name,lastname,identityCard,matter,charge,password })
    if(!user) return res.status(409).send('EL usuario ya existe')
    
    res.send(user)
})

app.post('/login', async (req,res) => {
    const result = validatePartialUser(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)
    
    const { identityCard,password,charge } = req.body

    const user = await userModel.login({ identityCard,password,charge })
    if(!user) return res.status(401).send('Usuario o contrasena incorrecta')

    res.send(user)
})

app.get('/matters', async (req,res) => {
    const matters = await userModel.getMatters() 
    res.send(matters)
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto http://localhost:${PORT}`)
})