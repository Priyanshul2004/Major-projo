const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  askedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  reply: {
    content: {
      type: String
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedDate: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes
communicationSchema.index({ studentId: 1, askedDate: -1 });
communicationSchema.index({ status: 1, priority: 1 });
communicationSchema.index({ subject: 1 });
communicationSchema.index({ 'reply.repliedBy': 1 });

module.exports = mongoose.model('Communication', communicationSchema);
