const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessge = require('./utils/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "Chat Assistant";

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
      const user = userJoin(socket.id, username, room);
      
      socket.join(user.room);
      
  
      // Welcome current user
    socket.emit('message', formatMessge(botName, `${user.username}, welcome to Space Chat`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessge(botName, `${user.username}, just joined your Chat`));


    // Users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
  })
    

    });


  //Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessge( user.username, msg));
  });
  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);
    if (user){
      io.to(user.room).emit(
        'message', formatMessge(botName, `${user.username}, has left the chat`)); 

      // Users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
  })
    }
    
  });
});


const PORT =  process.env.PORT || 3000 ;
server.listen(PORT, () => console.log(`Server is Runing on port: ${PORT}`));