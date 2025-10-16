// Vote 라우터

const express = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const voteController = require('../controllers/voteController');

const router = express.Router();

// 투표 생성/변경
router.post(
  '/',
  [
    body('songId').isString().trim(),
    body('userName').isString().trim().isLength({ min: 1, max: 20 }),
    body('type').isIn(['like', 'impossible']),
    body('reason').optional().isString().trim().isLength({ max: 500 }),
  ],
  validate,
  voteController.createVote
);

// 투표 취소
router.delete('/:voteId', voteController.deleteVote);

// 특정 곡의 투표 목록 조회
router.get(
  '/',
  [query('songId').isString().trim()],
  validate,
  voteController.getVotes
);

module.exports = router;

