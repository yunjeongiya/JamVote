// Jam (방) 모델

const mongoose = require('mongoose');

const jamSchema = new mongoose.Schema({
  jamId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    required: true,
    index: true, // 크론 잡 쿼리 최적화
  },
});

module.exports = mongoose.model('Jam', jamSchema);

