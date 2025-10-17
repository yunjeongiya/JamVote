// 상수 정의

// 개발 환경에서는 localhost, 프로덕션에서는 실제 도메인 사용
const SHARE_LINK_BASE = process.env.SHARE_LINK_BASE || 'http://localhost:5173';

const EXPIRE_DAYS_OPTIONS = [7, 15, 30, 60, 90];

module.exports = {
  SHARE_LINK_BASE,
  EXPIRE_DAYS_OPTIONS,
};

