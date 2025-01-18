import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import { validatePartialUser, validateActivitie, validateNotes } from './schemas/users.js'
import { userModel } from './models/mysql.js'

const app = express()
const server = createServer(app)
const io = new Server(server, { 
    cors: { origin: "*", 
    methods: ["GET", "POST"] } 
})

const PORT = process.env.PORT || 3001

app.use(cors());
app.use(express.json())
dotenv.config()

app.get('/', async (req,res) => {
    res.send('<h1>Servidor</h1>')
})

app.get('/api/news', async (req, res) => { 
    try { 
        const apiKey = process.env.NEWS_API_KEY; 
        const response = await axios.get(`https://newsdata.io/api/1/latest?apikey=${apiKey}`) 
        res.json(response.data.results) 
    } catch (error) { 
        console.error('Error fetching news:', error)
        res.status(500).json({ error: 'Error fetching news' })
    } 
})

app.get('/activitie-day', async (req,res) => {
    const { id_section, id_matter } = req.query
    console.log(id_matter)
    const activities = await userModel.getActivitieForActivities({ id_section, id_matter })
    res.send(activities)
})

app.post('/register', async (req,res) => {
    const result = validatePartialUser(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)

    const { name,lastname,identityCard,section,idSection,matter,idMatter,charge,password } = req.body

    const user = await userModel.register({ name,lastname,identityCard,section,idSection,matter,idMatter,charge,password })
    if(!user) return res.status(409).send('EL usuario ya existe')
    
    // rooms = await userModel.joinRooms({ idSection,idMatter })
        
    res.send(user)
})

app.post('/login', async (req,res) => {
    const result = validatePartialUser(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)
    
    const { identityCard,password,charge } = req.body

    const user = await userModel.login({ identityCard,password,charge })
    if(!user) return res.status(401).send('Usuario o contrasena incorrecta')

    // const { id_section, id_matter } = user   
    // rooms = await userModel.joinRooms({ id_section,id_matter })

    res.send(user)
})

app.get('/rooms', async (req,res) => {
    const { id_matter, id_section } = req.query
    const rooms = await userModel.joinRooms({ id_matter,id_section })
    res.send(rooms)
})

app.get('/all-matters', async (req,res) => {
    const matters = await userModel.getAllMatters() 
    res.send(matters)
})

app.get('/semesters', async (req,res) => {
    const semesters = await userModel.getSemesters()
    res.send(semesters)
})

app.post('/create-activitie', async (req,res) => {
    const result = validateActivitie(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)

    const { title,description,court,id_matter,date,value } = req.body
    const addActivitie = await userModel.addActivitie({ title,description,court,id_matter,date,value })

    res.send(addActivitie)
})

app.get('/activitie/', async (req,res) => {
    const { id_matter, id_section } = req.query
    
    const activitie = await userModel.getActivitie({ id_matter, id_section })

    if(!activitie) return res.send('No hay actividades')
    res.send(activitie)
})

app.get('/notes', async (req,res) => {
    const { id_matter, id_activitie } = req.query
    const notes = await userModel.getNotes({ id_matter, id_activitie })
    res.send(notes)
})

app.post('/create-notes', async (req,res) => {
    const result = validateNotes(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)

    const { listNotes,activitie } = req.body
    const notes = await userModel.createNotes({ listNotes,activitie })
    res.send(notes)
})

app.put('/update-notes', async (req,res) => {
    const result = validateNotes(req.body)
    if(!result.success) return res.status(400).send(result.error.errors)
    
    const { listNotes,activitie } = req.body
    const updateNotes = await userModel.updateNotes({ listNotes,activitie })
    res.send(updateNotes)
})

app.get('/matters', async (req,res) => {
    const { id_section } = req.query
    const matters = await userModel.getMatters({ id_section })

    res.send(matters)
})

app.get('/notes-student', async (req,res) => {
    const { id_matter, id_student } = req.query
    const notes = await userModel.getNotesStudent({ id_matter, id_student })
    res.send(notes)
})

app.get('/messages', async (req,res) => {
    const { room } = req.query
    console.log(room)
    const messages = await userModel.getMessages({ room })
    res.send(messages)
})

io.on('connection', async (socket) => {
    console.log('Usuario conectado')

    const { id_section, id_matter } = socket.handshake.query
    const rooms = await userModel.joinRooms({ id_section, id_matter })

    rooms.forEach(room => {
        socket.join(room.id_matter)
    })

    socket.on('join room', async (room) => {
        socket.join(room)
    })

    socket.on('set message', async (msg) => {
        console.log(msg)
        await userModel.insertMessages({ msg })
        io.to(msg.group).emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
})

server.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto http://localhost:${PORT}`)
})