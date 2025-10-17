// Feedback 컨트롤러

const Feedback = require('../models/Feedback');
const { generateUUID } = require('../utils/generateId');

/**
 * 피드백 작성
 * POST /api/feedback
 */
async function createFeedback(req, res, next) {
  try {
    const { jamId, userName, rating, content, contactInfo } = req.body;
    
    // 피드백 생성
    const feedback = await Feedback.create({
      feedbackId: generateUUID(),
      jamId: jamId || null,
      userName: userName || '익명',
      rating,
      content: content ? content.trim() : '',
      contactInfo: contactInfo ? contactInfo.trim() : '',
    });
    
    res.status(201).json({
      feedbackId: feedback.feedbackId,
      message: '피드백이 전송되었습니다. 소중한 의견 감사합니다!',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 피드백 목록 조회 (관리자용 - 추후 구현)
 * GET /api/feedback
 */
async function getFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(100);
    
    res.json({ feedbacks });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFeedback,
  getFeedbacks,
};

