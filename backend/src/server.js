// 서버 시작

require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // MongoDB 연결
    await connectDB();
    
    // Express 앱 생성
    const app = createApp();
    
    // HTTP 서버 생성
    const server = http.createServer(app);
    
    // Socket.io 설정 (추후 추가)
    // const io = require('./config/socket')(server);
    
    // 서버 시작
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

