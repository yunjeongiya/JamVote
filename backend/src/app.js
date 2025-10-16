// Express 앱 설정

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  
  // 미들웨어
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // 헬스 체크
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });
  
  // API 라우트
  app.use('/api/jams', require('./routes/jam'));
  app.use('/api/users', require('./routes/user'));
  app.use('/api/songs', require('./routes/song'));
  app.use('/api/votes', require('./routes/vote'));
  app.use('/api/youtube', require('./routes/youtube'));
  // app.use('/api/comments', require('./routes/comment'));
  // app.use('/api/feedback', require('./routes/feedback'));
  
  // 404 핸들러
  app.use((req, res) => {
    res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다' });
  });
  
  // 에러 핸들러 (마지막에 위치)
  app.use(errorHandler);
  
  return app;
}

module.exports = createApp;

