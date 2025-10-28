const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['notes', 'homework', 'reference', 'assignment'],
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
materialSchema.index({ subjectId: 1, type: 1 });
materialSchema.index({ professorId: 1 });
materialSchema.index({ status: 1 });
materialSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Material', materialSchema);