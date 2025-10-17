// Jam 라우터

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const jamController = require('../controllers/jamController');

const router = express.Router();

// 방 생성
router.post(
  '/',
  [
    body('name').optional().isString().trim().isLength({ max: 50 }),
    body('description').optional().isString().trim().isLength({ max: 200 }),
    body('expireDays').isInt({ min: 1, max: 365 }),
  ],
  validate,
  jamController.createJam
);

// 방 정보 조회
router.get('/:jamId', jamController.getJam);

// 방 유효기한 수정
router.patch(
  '/:jamId/expiry',
  [body('expireDays').isInt({ min: 1, max: 365 })],
  validate,
  jamController.updateJamExpiry
);

module.exports = router;

