// 크론 잡: 만료된 방 자동 삭제

const cron = require('node-cron');
const Jam = require('../models/Jam');
const User = require('../models/User');
const Song = require('../models/Song');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

/**
 * 만료된 방과 관련 데이터 삭제 (Bulk Operation으로 최적화)
 */
async function cleanupExpiredJams() {
  try {
    console.log('[Cleanup] 만료된 방 청소 작업 시작...');
    
    const now = new Date();
    
    // 만료된 방 찾기
    const expiredJams = await Jam.find({
      expireAt: { $lt: now },
    });
    
    if (expiredJams.length === 0) {
      console.log('[Cleanup] 만료된 방이 없습니다.');
      return;
    }
    
    console.log(`[Cleanup] ${expiredJams.length}개의 만료된 방 발견`);
    
    // 모든 만료된 방의 jamId 수집
    const jamIds = expiredJams.map(jam => jam.jamId);
    
    // 관련 곡들의 songId 수집 (투표/댓글 삭제용)
    const songsToDelete = await Song.find({ jamId: { $in: jamIds } });
    const songIdsToDelete = songsToDelete.map(song => song.songId);
    
    // Bulk operation으로 한 번에 삭제 (역순으로 삭제: 자식 → 부모)
    const [voteResult, commentResult, songResult, userResult, jamResult] = await Promise.all([
      Vote.deleteMany({ songId: { $in: songIdsToDelete } }),
      Comment.deleteMany({ songId: { $in: songIdsToDelete } }),
      Song.deleteMany({ jamId: { $in: jamIds } }),
      User.deleteMany({ jamId: { $in: jamIds } }),
      Jam.deleteMany({ jamId: { $in: jamIds } }),
    ]);
    
    // 삭제 결과 로깅
    console.log('[Cleanup] 청소 작업 완료:');
    console.log(`  - 방: ${jamResult.deletedCount}개`);
    console.log(`  - 사용자: ${userResult.deletedCount}명`);
    console.log(`  - 곡: ${songResult.deletedCount}개`);
    console.log(`  - 투표: ${voteResult.deletedCount}개`);
    console.log(`  - 댓글: ${commentResult.deletedCount}개`);
    
    // 상세 로그 (삭제된 방 목록)
    if (expiredJams.length <= 10) {
      console.log('[Cleanup] 삭제된 방 목록:');
      expiredJams.forEach(jam => {
        console.log(`  - ${jam.jamId} (${jam.name})`);
      });
    }
  } catch (error) {
    console.error('[Cleanup] 청소 작업 중 오류 발생:', error);
  }
}

/**
 * 크론 잡 시작
 * 매일 새벽 1시에 실행
 */
function startCleanupJob() {
  // 크론 스케줄: '초 분 시 일 월 요일'
  // '0 1 * * *' = 매일 새벽 1시 0분 0초
  cron.schedule('0 1 * * *', () => {
    cleanupExpiredJams();
  });
  
  console.log('[Cleanup] 크론 잡 시작됨: 매일 새벽 1시에 만료된 방 청소');
}

/**
 * 즉시 청소 실행 (테스트/수동 실행용)
 */
async function runCleanupNow() {
  console.log('[Cleanup] 수동 청소 작업 실행');
  await cleanupExpiredJams();
}

module.exports = {
  startCleanupJob,
  runCleanupNow,
  cleanupExpiredJams,
};

