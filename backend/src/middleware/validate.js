// 입력값 검증 미들웨어

const { validationResult } = require('express-validator');

/**
 * 검증 결과 확인 미들웨어
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: '입력값이 유효하지 않습니다',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
}

module.exports = {
  validate,
};

