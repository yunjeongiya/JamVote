// Rate Limiting 미들웨어

const rateLimit = require('express-rate-limit');

/**
 * 일반 API용 Rate Limiter (분당 60회)
 */
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 60,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 투표 API용 Rate Limiter (분당 30회)
 */
const voteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 30,
  message: { error: '투표 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 댓글 API용 Rate Limiter (분당 10회)
 */
const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 10,
  message: { error: '댓글 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 곡 추가 API용 Rate Limiter (분당 5회)
 */
const songCreateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 5,
  message: { error: '곡 추가 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 로그인/회원가입 API용 Rate Limiter (분당 10회)
 */
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 10,
  message: { error: '로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * YouTube 검색 API용 Rate Limiter (분당 20회)
 */
const youtubeSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 20,
  message: { error: '검색 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  voteLimiter,
  commentLimiter,
  songCreateLimiter,
  authLimiter,
  youtubeSearchLimiter,
};

