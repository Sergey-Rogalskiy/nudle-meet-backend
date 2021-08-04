const express = require('express')
const userRoute = require('./routes/rooms')

const app = express()
const port = 3001

app.use(express.json())
app.use('/api/rooms/', userRoute)

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})