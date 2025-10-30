require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { initDatabase } = require('./database');

// Initialize database
initDatabase();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/files', require('./routes/files'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/canvas', require('./routes/canvas'));

// WebSocket for voice calls
const voiceCalls = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Voice call events
  socket.on('voice:start', ({ userId }) => {
    voiceCalls.set(userId, socket.id);
    socket.emit('voice:started');
  });

  socket.on('voice:audio', ({ audio }) => {
    // Broadcast audio to other participants if needed
    socket.broadcast.emit('voice:audio', { audio });
  });

  socket.on('voice:stop', ({ userId }) => {
    voiceCalls.delete(userId);
    socket.emit('voice:stopped');
  });

  // WebRTC signaling for voice calls
  socket.on('voice:offer', ({ offer, to }) => {
    const targetSocket = voiceCalls.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit('voice:offer', { offer, from: socket.id });
    }
  });

  socket.on('voice:answer', ({ answer, to }) => {
    io.to(to).emit('voice:answer', { answer, from: socket.id });
  });

  socket.on('voice:ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('voice:ice-candidate', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up voice calls
    for (const [userId, socketId] of voiceCalls.entries()) {
      if (socketId === socket.id) {
        voiceCalls.delete(userId);
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
