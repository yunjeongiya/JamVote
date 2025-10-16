// Jam 컨트롤러

const Jam = require('../models/Jam');
const { createUniqueJamId } = require('../utils/generateId');
const { SHARE_LINK_BASE } = require('../config/constants');

/**
 * 방 생성
 * POST /api/jams
 */
async function createJam(req, res, next) {
  try {
    const { name, description, expireDays } = req.body;
    
    // 방 ID 생성
    const jamId = await createUniqueJamId(Jam);
    
    // 방 이름이 없으면 jamId 사용
    const jamName = name && name.trim() ? name.trim() : jamId;
    
    // 만료일 계산
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + expireDays);
    
    // 방 생성
    const jam = await Jam.create({
      jamId,
      name: jamName,
      description: description || '',
      expireAt,
    });
    
    // 공유 링크 생성
    const shareLink = `${SHARE_LINK_BASE}/${jamId}`;
    
    res.status(201).json({
      jamId: jam.jamId,
      name: jam.name,
      description: jam.description,
      expireAt: jam.expireAt,
      shareLink,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 방 정보 조회
 * GET /api/jams/:jamId
 */
async function getJam(req, res, next) {
  try {
    const { jamId } = req.params;
    
    const jam = await Jam.findOne({ jamId });
    
    if (!jam) {
      return res.status(404).json({ error: '존재하지 않는 방입니다' });
    }
    
    // 만료 여부 확인
    if (jam.expireAt < new Date()) {
      return res.status(410).json({ error: '유효기한이 지난 방입니다' });
    }
    
    // 남은 일수 계산
    const daysRemaining = Math.ceil(
      (jam.expireAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    res.json({
      jamId: jam.jamId,
      name: jam.name,
      description: jam.description,
      createdAt: jam.createdAt,
      expireAt: jam.expireAt,
      daysRemaining,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 방 유효기한 수정
 * PATCH /api/jams/:jamId/expiry
 */
async function updateJamExpiry(req, res, next) {
  try {
    const { jamId } = req.params;
    const { expireDays } = req.body;
    
    const jam = await Jam.findOne({ jamId });
    
    if (!jam) {
      return res.status(404).json({ error: '존재하지 않는 방입니다' });
    }
    
    // 새 만료일 계산 (현재 시간 기준)
    const newExpireAt = new Date();
    newExpireAt.setDate(newExpireAt.getDate() + expireDays);
    
    jam.expireAt = newExpireAt;
    await jam.save();
    
    const daysRemaining = Math.ceil(
      (jam.expireAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    res.json({
      expireAt: jam.expireAt,
      daysRemaining,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJam,
  getJam,
  updateJamExpiry,
};

