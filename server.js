const express = require('express')
const http = require('http')
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

const options = {
  cors: {
    origin: '*',
  },
}
const io = socketIO(server, options)


const date = new Date(Date.now())
let rooms = []


app.get('/api/rooms/',(req,res) => {
    res.send({
        'success': 'OK',
        'rooms': rooms
    })
})

app.post('/api/rooms/',(req,res) => {
    const check = rooms.find(room => room.owner === req.query.name)
    if (check) {
        const response = {result: null, reason:"User exists"}
        return res.send(response)
    }
    else {
        const new_room = {
            'owner': req.query.name,
            'users': [
                {
                    'name': req.query.name
                },
            ],
            'messages': [
            ]
        }
        rooms.push(new_room)
        const response = {success: 'Ok', room: new_room}
        res.send(response)
    }
})

app.delete('/api/rooms/:name',(req,res) => {
    const check = rooms.find(room => room.owner === req.params.name)
    if (!check) {
        const response = {success: false, reason:"User does not exists"}
        return res.send(response)
    } else {
        const index = rooms.map(e => e.owner).indexOf(req.params.name);
        rooms.splice(index, 1)
        const response = {success: true, reason:"User has been deleted"}
        res.send(response)
    }
})


app.get('/api/rooms/:owner',(req,res) => {
    const check = rooms.find(room => room.owner === req.params.owner)
    if (check) {
        return res.send({success: "OK", data:check})
    } else {
        res.send({success: null, reason:"Rooms doe not exist"})
    }
})


io.on('connection', (socket) => {
  socket.emit('connection')
  console.log(`IO Connection, ${socket.id}`)

  socket.onAny((event) => {
    console.log('Socket event:', event);
  })

  socket.on('message_new', (data) => {
    const exact_room = rooms.find((room) => room.owner === data.room)
    const data_push = {
        'user': data.user,
        'text': data.messageText,
        'date': date.toISOString().split('T')[0]
    }
    exact_room.messages.push(data_push)
    socket.emit('message_new_to_client', exact_room)
    socket.broadcast.emit('message_new_to_client', exact_room)
  })


  socket.on('join', function (data) {
      socket.join(data.roomId);
      socket.room = data.roomId;
      const sockets = io.of('/').in().adapter.rooms[data.roomId];
      console.log(io.of('/').in().adapter.rooms);
      if(sockets.length===1){
          socket.emit('init')
      }else{
          if (sockets.length===2){
              io.to(data.roomId).emit('ready')
          }else{
              socket.room = null
              socket.leave(data.roomId)
              socket.emit('full')
          }
          
      }
  });
  socket.on('signal', (data) => {
      io.to(data.room).emit('desc', data.desc)        
  })
  socket.on('disconnect', () => {
      const roomId = Object.keys(socket.adapter.rooms)[0]
      if (socket.room){
          io.to(socket.room).emit('disconnected')
      }
      
  })
})


const port = 3001
server.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})