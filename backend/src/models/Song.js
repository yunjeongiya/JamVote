// Song (곡) 모델

const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songId: {
    type: String,
    required: true,
    unique: true,
  },
  jamId: {
    type: String,
    required: true,
    index: true,
  },
  proposerName: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
  },
  youtubeVideoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: '',
  },
  requiredSessions: {
    type: [String],
    default: [],
  },
  sessionDifficulties: {
    type: Map,
    of: Number, // 1~5
    default: {},
  },
  allowEditByOthers: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 곡 리스트 정렬 최적화
songSchema.index({ jamId: 1, createdAt: -1 });

module.exports = mongoose.model('Song', songSchema);

