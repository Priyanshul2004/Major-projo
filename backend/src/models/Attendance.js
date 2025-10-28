const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['professor', 'student'],
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    default: ''
  }
});

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['professor', 'student'],
    required: true
  },
  records: [attendanceRecordSchema],
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  classType: {
    type: String,
    enum: ['regular', 'lab', 'tutorial'],
    default: 'regular'
  },
  totalExpected: {
    type: Number,
    required: true
  },
  totalPresent: {
    type: Number,
    default: 0
  },
  totalAbsent: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
attendanceSchema.index({ date: 1, type: 1 });
attendanceSchema.index({ subjectId: 1, date: 1 });
attendanceSchema.index({ 'records.userId': 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
