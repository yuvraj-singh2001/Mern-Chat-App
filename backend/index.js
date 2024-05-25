const express = require('express')
const cors = require('cors')
const connectDB = require('../backend/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { notFound, errorHandler } = require('../backend/middleware/errorMiddleware')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())
require("dotenv").config({ path: 'backend/config.env' })
connectDB()

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

const __dirname1 = path.resolve()
if (process.env.Node_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
    })
}
else {
    app.get('/', (req, res) => {
        res.send('api running')
    })
}

app.use(notFound)
app.use(errorHandler)

const server = app.listen(process.env.PORT||5000, console.log("running", process.env.PORT))


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        // credentials: true,
    },
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log(room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if (!chat.users) {
            return console.log("user is not defined")
        }

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) {
                return;
            }
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });

    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})