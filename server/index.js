import express from 'express'
import cors from 'cors'
import { validateUser, validatePartialUser } from './schemas/users.js'
import { userModel } from './models/mysql.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from './const.js'
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
    const { name,lastname,identityCard,charge,password } = req.body

    const user = await userModel.register({ name,lastname,identityCard,charge,password })
    if(!user) return res.status(409).send('EL usuario ya existe')
})

app.post('/login', async (req,res) => {
    const result = validatePartialUser(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)
    
    const { identityCard,password } = req.body
    
    const user = await userModel.login({ identityCard,password })
    if(!user) return res.status(401).send('Usuario o contrasena incorrecta')

    const token = jwt.sign({id: user.id, username: user.username}, SECRET_JWT_KEY,{ expiresIn: '1h'})
    res.cookie('access_token', token, {
        httpOnly: true, // la cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV == 'production', // la cookie solo se puede acceder en https
        sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
    }).send({user,token})
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto http://localhost:${PORT}`)
})