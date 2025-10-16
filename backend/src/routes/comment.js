// Comment 라우트

const express = require('express');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createComment,
  getComments,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

// 댓글 작성
router.post(
  '/',
  [
    body('songId').isString().notEmpty(),
    body('userName').isString().trim().notEmpty(),
    body('content')
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('댓글은 1~500자 사이여야 합니다'),
    validate,
  ],
  createComment
);

// 댓글 목록 조회
router.get(
  '/',
  [
    query('songId').isString().notEmpty(),
    validate,
  ],
  getComments
);

// 댓글 삭제
router.delete(
  '/:commentId',
  [
    query('userName').isString().notEmpty(),
    validate,
  ],
  deleteComment
);

module.exports = router;

