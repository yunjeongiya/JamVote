// Comment 컨트롤러

const Comment = require('../models/Comment');
const Song = require('../models/Song');
const User = require('../models/User');
const { generateUUID } = require('../utils/generateId');

/**
 * 댓글 작성
 * POST /api/comments
 */
async function createComment(req, res, next) {
  try {
    const { songId, userName, content } = req.body;
    
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
    
    // 댓글 생성
    const comment = await Comment.create({
      commentId: generateUUID(),
      songId,
      userName,
      content: content.trim(),
    });
    
    const responseData = {
      commentId: comment.commentId,
      songId: comment.songId,
      userName: comment.userName,
      content: comment.content,
      createdAt: comment.createdAt,
    };
    
    // Socket.io 이벤트 발송
    if (req.io) {
      req.io.to(song.jamId).emit('commentCreated', responseData);
    }
    
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
}

/**
 * 특정 곡의 댓글 목록 조회
 * GET /api/comments?songId=xxx
 */
async function getComments(req, res, next) {
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
    
    // 댓글 목록 조회 (작성일 오름차순)
    const comments = await Comment.find({ songId }).sort({ createdAt: 1 });
    
    // 사용자 세션 정보와 함께 반환
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ jamId: song.jamId, name: comment.userName });
        return {
          commentId: comment.commentId,
          songId: comment.songId,
          userName: comment.userName,
          sessions: user ? user.sessions : [],
          content: comment.content,
          createdAt: comment.createdAt,
        };
      })
    );
    
    res.json({ comments: commentsWithUsers });
  } catch (error) {
    next(error);
  }
}

/**
 * 댓글 삭제
 * DELETE /api/comments/:commentId
 */
async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { userName } = req.query;
    
    if (!userName) {
      return res.status(400).json({ error: 'userName이 필요합니다' });
    }
    
    const comment = await Comment.findOne({ commentId });
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다' });
    }
    
    // 삭제 권한 체크 (작성자만)
    if (comment.userName !== userName) {
      return res.status(403).json({ error: '삭제 권한이 없습니다' });
    }
    
    // 곡 정보 가져오기 (Socket.io에 jamId 필요)
    const song = await Song.findOne({ songId: comment.songId });
    
    await Comment.deleteOne({ commentId });
    
    // Socket.io 이벤트 발송
    if (req.io && song) {
      req.io.to(song.jamId).emit('commentDeleted', {
        commentId,
        songId: comment.songId,
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComment,
  getComments,
  deleteComment,
};


