// ID 생성 유틸리티

const { v4: uuidv4 } = require('uuid');

/**
 * 6자리 랜덤 방 ID 생성 (영문 소문자 + 숫자)
 */
function generateJamId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * 고유한 방 ID 생성 (DB 중복 체크)
 */
async function createUniqueJamId(JamModel) {
  let jamId;
  let exists = true;
  
  while (exists) {
    jamId = generateJamId();
    exists = await JamModel.findOne({ jamId });
  }
  
  return jamId;
}

/**
 * UUID 생성 (songId, voteId, commentId, feedbackId 등)
 */
function generateUUID() {
  return uuidv4();
}

module.exports = {
  generateJamId,
  createUniqueJamId,
  generateUUID,
};

