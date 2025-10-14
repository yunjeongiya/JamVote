// 에러 핸들링 미들웨어

function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Mongoose 중복 키 에러 (Duplicate Key)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      error: '이미 존재하는 데이터입니다',
      field: field,
    });
  }
  
  // Mongoose 유효성 검증 에러
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: '입력값이 유효하지 않습니다',
      details: messages,
    });
  }
  
  // Mongoose CastError (잘못된 ObjectId 등)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: '잘못된 요청 형식입니다',
    });
  }
  
  // 기본 에러
  const status = err.status || err.statusCode || 500;
  const message = err.message || '서버 오류가 발생했습니다';
  
  res.status(status).json({
    error: message,
  });
}

module.exports = errorHandler;

