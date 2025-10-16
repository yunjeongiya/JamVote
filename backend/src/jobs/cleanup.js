// 크론 잡: 만료된 방 자동 삭제

const cron = require('node-cron');
const Jam = require('../models/Jam');
const User = require('../models/User');
const Song = require('../models/Song');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

/**
 * 만료된 방과 관련 데이터 삭제
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
    
    let deletedCount = 0;
    
    // 각 만료된 방의 데이터 삭제
    for (const jam of expiredJams) {
      try {
        const { jamId, name } = jam;
        
        // Cascade 삭제
        const [userCount, songCount, voteCount, commentCount] = await Promise.all([
          User.deleteMany({ jamId }).then(r => r.deletedCount),
          Song.deleteMany({ jamId }).then(r => r.deletedCount),
          Vote.deleteMany({ songId: { $in: await Song.find({ jamId }).distinct('songId') } }).then(r => r.deletedCount),
          Comment.deleteMany({ songId: { $in: await Song.find({ jamId }).distinct('songId') } }).then(r => r.deletedCount),
        ]);
        
        // 방 삭제
        await Jam.deleteOne({ jamId });
        
        console.log(`[Cleanup] 방 삭제 완료: ${jamId} (${name})`);
        console.log(`  - 사용자: ${userCount}명`);
        console.log(`  - 곡: ${songCount}개`);
        console.log(`  - 투표: ${voteCount}개`);
        console.log(`  - 댓글: ${commentCount}개`);
        
        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup] 방 삭제 실패 (${jam.jamId}):`, error.message);
      }
    }
    
    console.log(`[Cleanup] 청소 작업 완료: ${deletedCount}/${expiredJams.length}개 방 삭제됨`);
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

