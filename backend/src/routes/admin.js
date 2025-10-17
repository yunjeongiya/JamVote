// 관리자 라우트 (테스트/개발용)

const express = require('express');
const { runCleanupNow } = require('../jobs/cleanup');

const router = express.Router();

/**
 * 관리자 인증 미들웨어
 * 환경 변수 ADMIN_SECRET_KEY로 설정된 비밀 키를 헤더로 검증
 */
function adminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_SECRET_KEY;
  
  // 개발 환경에서 ADMIN_SECRET_KEY가 설정되지 않은 경우 경고 후 통과
  if (!adminKey) {
    console.warn('[Admin] ⚠️  ADMIN_SECRET_KEY가 설정되지 않았습니다. 프로덕션에서는 반드시 설정하세요!');
    return next();
  }
  
  // 헤더 또는 쿼리 파라미터에서 키 확인
  const providedKey = req.headers['x-admin-key'] || req.query.adminKey;
  
  if (providedKey !== adminKey) {
    console.warn('[Admin] 인증 실패 - 잘못된 관리자 키');
    return res.status(403).json({ error: '접근 권한이 없습니다' });
  }
  
  next();
}

/**
 * 즉시 청소 작업 실행
 * GET /api/admin/cleanup
 * 헤더: X-Admin-Key: <비밀키> 또는 쿼리: ?adminKey=<비밀키>
 */
router.get('/cleanup', adminAuth, async (req, res) => {
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
 * 헤더: X-Admin-Key: <비밀키> 또는 쿼리: ?adminKey=<비밀키>
 */
router.get('/status', adminAuth, (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date(),
  });
});

module.exports = router;

