import express from 'express'

const app = express()

const PORT = process.env.PORT ?? 3001

app.get('/', (req,res) => {
    res.send('<h1>Servidor</h1>')
})

app.post('/register', (req,res) => {
    const result = req.body
})

app.post('/login', (req,res) => {
    
})

app.use((req,res) => {
    res.send('<h1>404</h1>')
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto http://localhost:${PORT}`)
})