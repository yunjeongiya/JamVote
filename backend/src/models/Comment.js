// Comment (댓글) 모델

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: true,
    unique: true,
  },
  songId: {
    type: String,
    required: true,
    index: true,
  },
  writerName: {
    type: String,
    required: true,
  },
  sessionInfo: {
    type: [String],
    default: [],
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 댓글 리스트 정렬
commentSchema.index({ songId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);

