const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'general', 'event', 'health'],
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['all', 'students', 'professors', 'hod'],
    default: ['all']
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    type: String
  }],
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
noticeSchema.index({ publishDate: -1, status: 1 });
noticeSchema.index({ category: 1, priority: 1 });
noticeSchema.index({ 'author.userId': 1 });
noticeSchema.index({ targetAudience: 1 });
noticeSchema.index({ tags: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
