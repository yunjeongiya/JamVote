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
    
    await Vote.deleteOne({ voteId });
    
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
    
    // 투표 목록 조회
    const votes = await Vote.find({ songId }).sort({ createdAt: 1 });
    
    // 사용자 정보와 함께 반환
    const votesWithUsers = await Promise.all(
      votes.map(async (vote) => {
        const user = await User.findOne({ jamId: song.jamId, name: vote.userName });
        return {
          userName: vote.userName,
          sessions: user ? user.sessions : [],
          type: vote.type,
          reason: vote.reason,
          createdAt: vote.createdAt,
        };
      })
    );
    
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

