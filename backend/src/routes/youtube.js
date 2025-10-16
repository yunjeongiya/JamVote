// YouTube 라우터

const express = require('express');
const { query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { youtubeSearchLimiter } = require('../middleware/rateLimiter');
const youtubeController = require('../controllers/youtubeController');

const router = express.Router();

// YouTube 검색
router.get(
  '/search',
  youtubeSearchLimiter,
  [query('q').isString().trim().isLength({ min: 1, max: 100 })],
  validate,
  youtubeController.searchYouTube
);

module.exports = router;

