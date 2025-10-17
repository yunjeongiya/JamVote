// Song 라우터

const express = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { songCreateLimiter, generalLimiter } = require('../middleware/rateLimiter');
const songController = require('../controllers/songController');

const router = express.Router();

// 곡 추가
router.post(
  '/',
  songCreateLimiter,
  [
    body('jamId').isString().trim().isLength({ min: 6, max: 6 }),
    body('proposerName').isString().trim().isLength({ min: 1, max: 20 }),
    body('youtubeUrl').isString().trim().isURL(),
    body('title').isString().trim().isLength({ min: 1, max: 200 }),
    body('artist').isString().trim().isLength({ min: 1, max: 100 }),
    body('duration').isString().trim(),
    body('thumbnailUrl').isString().trim().isURL(),
    body('genre').optional().isString().trim().isLength({ max: 50 }),
    body('requiredSessions').optional().isArray(),
    body('sessionDifficulties').optional().isObject(),
    body('allowEditByOthers').optional().isBoolean(),
  ],
  validate,
  songController.createSong
);

// 곡 목록 조회
router.get(
  '/',
  [query('jamId').isString().trim().isLength({ min: 6, max: 6 })],
  validate,
  songController.getSongs
);

// 곡 상세 조회
router.get('/:songId', songController.getSong);

// 곡 수정
router.patch(
  '/:songId',
  generalLimiter,
  [
    body('userName').isString().trim().isLength({ min: 1, max: 20 }),
    body('title').optional().isString().trim().isLength({ min: 1, max: 200 }),
    body('artist').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('genre').optional().isString().trim().isLength({ max: 50 }),
    body('requiredSessions').optional().isArray(),
    body('sessionDifficulties').optional().isObject(),
  ],
  validate,
  songController.updateSong
);

// 곡 삭제
router.delete('/:songId', songController.deleteSong);

module.exports = router;

