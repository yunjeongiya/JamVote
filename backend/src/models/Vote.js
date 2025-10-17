// Vote (투표) 모델

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voteId: {
    type: String,
    required: true,
    unique: true,
  },
  songId: {
    type: String,
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'impossible'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 한 곡에 한 사람이 한 번만 투표 가능
voteSchema.index({ songId: 1, userName: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

