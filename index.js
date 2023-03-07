//all thing is installed and require  for making sever
const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")
//now making server
const app = express();
const port = process.env.PORT 


const users = [{}]

// cors is used for intercommunication between url
app.use(cors)


// response on web page
app.get('/', (req, res) => {
    res.send("this is response of server")
    console.log('server ka console')
});
const server = http.createServer(app)//expresss is called here as a app
const io = socketIO(server)

//when io's connection  curcuit is on 
//here io is a whole circuit and socket is individual user
io.on("connection", (socket) => {
    console.log("new connection");
    //receiving user (1)
    socket.on('joined', ({ user }) => {
        //user will save on socket.id, every socket have different socket id
        users[socket.id] = user
        console.log(`${user} has joined the chat`)

        //sending the message through admin to frontend (2)
        socket.emit('welcome', { user: "Admin", message: `welcome to the chat ${user}` })



        //broadcast means it will send message to all accept the person who joined (broadcasting message to everyone that user  has joined)(3)
        socket.broadcast.emit('usejoined', { user: "Admin", message: `${users[socket.id]} has joined` })
    })



    //for disconnect (4)
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` })
        console.log("user left")
    })
    //now for message(1)
    socket.on('message', ({ message, id }) => {
        io.emit('sendmessage', { user: users[id], message, id })
    })

})


// listing
server.listen(port, () => {
    console.log(`server is working on  http://localhost:${port}`)
})