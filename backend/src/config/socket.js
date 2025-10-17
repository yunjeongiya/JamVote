// Socket.io 설정

const { Server } = require('socket.io');

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // 방 입장
    socket.on('joinJam', (jamId) => {
      socket.join(jamId);
      console.log(`Socket ${socket.id} joined jam ${jamId}`);
    });
    
    // 방 퇴장
    socket.on('leaveJam', (jamId) => {
      socket.leave(jamId);
      console.log(`Socket ${socket.id} left jam ${jamId}`);
    });
    
    // 연결 해제
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  return io;
}

/**
 * 특정 방에 이벤트 발송
 */
function emitToJam(io, jamId, event, data) {
  io.to(jamId).emit(event, data);
}

module.exports = {
  setupSocket,
  emitToJam,
};


