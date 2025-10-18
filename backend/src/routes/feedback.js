// Feedback 라우트

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { createFeedback, getFeedbacks } = require('../controllers/feedbackController');

const router = express.Router();

// 피드백 작성
router.post(
  '/',
  [
    body('jamId').optional().isString(),
    body('userName').optional().isString().trim().isLength({ max: 20 }),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('별점은 1~5 사이여야 합니다'),
    body('content').optional().isString().trim().isLength({ max: 1000 }),
    body('contactInfo').optional().isString().trim().isLength({ max: 100 }),
    validate,
  ],
  createFeedback
);

// 피드백 목록 조회 (관리자용)
router.get('/', getFeedbacks);

module.exports = router;

