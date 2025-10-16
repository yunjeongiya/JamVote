// 관리자 라우트 (테스트/개발용)

const express = require('express');
const { runCleanupNow } = require('../jobs/cleanup');

const router = express.Router();

/**
 * 즉시 청소 작업 실행
 * GET /api/admin/cleanup
 * 
 * 주의: 프로덕션에서는 인증 미들웨어 추가 필요!
 */
router.get('/cleanup', async (req, res) => {
  try {
    console.log('[Admin] 수동 청소 작업 요청됨');
    
    // 비동기로 실행 (응답은 바로 반환)
    runCleanupNow().catch(error => {
      console.error('[Admin] 청소 작업 실패:', error);
    });
    
    res.json({
      message: '청소 작업이 시작되었습니다. 서버 로그를 확인하세요.',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: '청소 작업 시작 실패' });
  }
});

/**
 * 서버 상태 확인
 * GET /api/admin/status
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date(),
  });
});

module.exports = router;

