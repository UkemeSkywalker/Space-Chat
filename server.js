const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessge = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "Chat Assistant";

// Run when client connects
io.on('connection', socket => {
  
  // Welcome current user
  socket.emit('message', formatMessge(botName, 'welcome to You Chat'));

  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessge(botName, 'A new user just joined your class'));

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessge(botName, 'A user has left the chat'));
  });

  //Listen for chatMessage
  socket.on('chatMessage', msg => {
    io.emit('message', formatMessge( 'User', msg));
  })
});


const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server is Runing on port: ${PORT}`));