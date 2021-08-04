const express = require('express')
const http = require('http')
const userRoute = require('./routes/rooms')
const socketIO = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const server = http.createServer(app)

app.use(
  cors({
      origin: '*',
  }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/rooms/', userRoute)

const options = {
  cors: {
    origin: '*',
  },
}
const io = socketIO(server, options)

io.on('connection', (socket) => {
  console.log(`IO Connection, ${socket.id}`)
})


const port = 3001
server.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})