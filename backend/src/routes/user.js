// User 라우터

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const userController = require('../controllers/userController');

const router = express.Router();

// 프로필 생성
router.post(
  '/',
  authLimiter,
  [
    body('jamId').isString().trim().isLength({ min: 6, max: 6 }),
    body('name')
      .isString()
      .trim()
      .isLength({ min: 1, max: 20 })
      .matches(/^\S+$/)
      .withMessage('이름에 공백을 포함할 수 없습니다'),
    body('password').optional().isString().isLength({ min: 4, max: 50 }),
    body('sessions').optional().isArray(),
  ],
  validate,
  userController.createUser
);

// 로그인
router.post(
  '/login',
  authLimiter,
  [
    body('jamId').isString().trim().isLength({ min: 6, max: 6 }),
    body('name')
      .isString()
      .trim()
      .isLength({ min: 1, max: 20 })
      .matches(/^\S+$/)
      .withMessage('이름에 공백을 포함할 수 없습니다'),
    body('password').optional().isString(),
  ],
  validate,
  userController.loginUser
);

// 프로필 수정
router.patch(
  '/:jamId/:userName',
  [
    body('newName')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 20 })
      .matches(/^\S+$/)
      .withMessage('이름에 공백을 포함할 수 없습니다'),
    body('sessions').optional().isArray(),
  ],
  validate,
  userController.updateUser
);

module.exports = router;

