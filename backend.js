// Real-time Chat Backend Code
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 5000;

// Serve static files for frontend
app.use(express.static('public'));

let users = {}; // Store connected users

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining with a username
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userList', Object.values(users)); // Update user list for all clients
    console.log(`${username} joined.`);
  });

  // Handle sending messages
  socket.on('message', ({ room, message }) => {
    io.to(room).emit('message', { user: users[socket.id], message });
  });

  // Handle joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${users[socket.id]} joined room: ${room}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', users[socket.id]);
    delete users[socket.id];
    io.emit('userList', Object.values(users));
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
