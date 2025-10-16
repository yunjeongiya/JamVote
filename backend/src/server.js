// 서버 시작

require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const connectDB = require('./config/db');
const { setupSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // MongoDB 연결
    await connectDB();
    
    // HTTP 서버 생성
    const server = http.createServer();
    
    // Socket.io 설정
    const io = setupSocket(server);
    console.log('Socket.io initialized');
    
    // Express 앱 생성 (io를 전달)
    const app = createApp(io);
    
    // Express를 HTTP 서버에 연결
    server.on('request', app);
    
    // 서버 시작
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      io.close(() => {
        server.close(() => {
          console.log('HTTP server closed');
          process.exit(0);
        });
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

