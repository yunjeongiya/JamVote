// User (사용자) 모델

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  jamId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  normalizedName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  sessions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 방 내 중복 방지 (jamId + normalizedName 조합 유니크)
userSchema.index({ jamId: 1, normalizedName: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);

