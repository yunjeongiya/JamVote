// 상수 정의

const SHARE_LINK_BASE = process.env.SHARE_LINK_BASE || 'https://jamvote.app';

const EXPIRE_DAYS_OPTIONS = [7, 15, 30, 60, 90];

module.exports = {
  SHARE_LINK_BASE,
  EXPIRE_DAYS_OPTIONS,
};

