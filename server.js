const express = require('express')
const http = require('http')
const userRoute = require('./routes/rooms')
const socketIO = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')


const app = express()
app.use(cors())
app.use(morgan())
const server = http.createServer(app)
const port = 3001
const io = socketIO(server)

app.use(express.json())

app.use('/api/rooms/', userRoute)

io.on('connection', () => {
  console.log('IO Connection')
})

server.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})