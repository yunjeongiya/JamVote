// Vote 컨트롤러

const Vote = require('../models/Vote');
const Song = require('../models/Song');
const User = require('../models/User');
const { generateUUID } = require('../utils/generateId');

/**
 * 투표 생성/변경
 * POST /api/votes
 */
async function createVote(req, res, next) {
  try {
    const { songId, userName, type, reason } = req.body;
    
    // 곡 존재 여부 확인
    const song = await Song.findOne({ songId });
    if (!song) {
      return res.status(404).json({ error: '곡을 찾을 수 없습니다' });
    }
    
    // 사용자 존재 여부 확인
    const user = await User.findOne({ jamId: song.jamId, name: userName });
    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다' });
    }
    
    // 기존 투표 확인
    const existingVote = await Vote.findOne({ songId, userName });
    
    if (existingVote) {
      // 같은 타입이면 아무것도 안 함 (중복 방지)
      if (existingVote.type === type) {
        return res.json({
          voteId: existingVote.voteId,
          type: existingVote.type,
        });
      }
      
      // 다른 타입이면 업데이트 (좋아요 ↔ 불가능 전환)
      existingVote.type = type;
      existingVote.reason = type === 'impossible' ? (reason || '') : '';
      await existingVote.save();
      
      // Socket.io 이벤트 발송
      if (req.io) {
        req.io.to(song.jamId).emit('voteChanged', {
          songId,
          userName,
          type,
        });
      }
      
      return res.json({
        voteId: existingVote.voteId,
        type: existingVote.type,
      });
    }
    
    // 새 투표 생성
    const vote = await Vote.create({
      voteId: generateUUID(),
      songId,
      userName,
      type,
      reason: type === 'impossible' ? (reason || '') : '',
    });
    
    // Socket.io 이벤트 발송
    if (req.io) {
      req.io.to(song.jamId).emit('voteCreated', {
        songId,
        userName,
        type,
      });
    }
    
    res.status(201).json({
      voteId: vote.voteId,
      type: vote.type,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 투표 취소
 * DELETE /api/votes/:voteId
 */
async function deleteVote(req, res, next) {
  try {
    const { voteId } = req.params;
    
    const vote = await Vote.findOne({ voteId });
    if (!vote) {
      return res.status(404).json({ error: '투표를 찾을 수 없습니다' });
    }
    
    // 곡 정보 가져오기 (Socket.io에 jamId 필요)
    const song = await Song.findOne({ songId: vote.songId });
    
    await Vote.deleteOne({ voteId });
    
    // Socket.io 이벤트 발송
    if (req.io && song) {
      req.io.to(song.jamId).emit('voteDeleted', {
        songId: vote.songId,
        userName: vote.userName,
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/**
 * 특정 곡의 투표 목록 조회
 * GET /api/votes?songId=xxx
 */
async function getVotes(req, res, next) {
  try {
    const { songId } = req.query;
    
    if (!songId) {
      return res.status(400).json({ error: 'songId가 필요합니다' });
    }
    
    // 곡 확인
    const song = await Song.findOne({ songId });
    if (!song) {
      return res.status(404).json({ error: '곡을 찾을 수 없습니다' });
    }
    
    // MongoDB Aggregation Pipeline을 사용하여 N+1 쿼리 문제 해결
    const pipeline = [
      // 1. songId로 필터링
      { $match: { songId } },
      
      // 2. 작성일 오름차순 정렬
      { $sort: { createdAt: 1 } },
      
      // 3. User 컬렉션과 조인
      {
        $lookup: {
          from: 'users',
          let: { userName: '$userName', jamId: song.jamId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$name', '$$userName'] },
                    { $eq: ['$jamId', '$$jamId'] }
                  ]
                }
              }
            }
          ],
          as: 'userInfo'
        }
      },
      
      // 4. 필요한 필드만 선택
      {
        $project: {
          _id: 0,
          userName: 1,
          sessions: { $ifNull: [{ $arrayElemAt: ['$userInfo.sessions', 0] }, []] },
          type: 1,
          reason: 1,
          createdAt: 1
        }
      }
    ];
    
    const votesWithUsers = await Vote.aggregate(pipeline);
    
    // 좋아요/불가능 분리
    const likes = votesWithUsers.filter(v => v.type === 'like').map(v => ({
      userName: v.userName,
      sessions: v.sessions,
      createdAt: v.createdAt,
    }));
    
    const impossibles = votesWithUsers.filter(v => v.type === 'impossible').map(v => ({
      userName: v.userName,
      sessions: v.sessions,
      reason: v.reason,
      createdAt: v.createdAt,
    }));
    
    res.json({ likes, impossibles });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createVote,
  deleteVote,
  getVotes,
};

