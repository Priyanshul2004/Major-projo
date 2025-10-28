const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: false,
    unique: false
  },
  subjectName: {
    type: String,
    required: false
  },
  description: {
    type: String,
    default: ''
  },
  credits: {
    type: Number,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  prerequisites: [{
    type: String
  }],
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: false
  },
  coProfessors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  }],
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    time: String,
    room: String,
    building: String
  },
  academicYear: {
    type: String,
    required: false
  },
  semester: {
    type: Number,
    required: false
  },
  maxStudents: {
    type: Number,
    default: 60
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ professorId: 1 });
subjectSchema.index({ department: 1 });
subjectSchema.index({ academicYear: 1, semester: 1 });
subjectSchema.index({ status: 1 });

module.exports = mongoose.model('Subject', subjectSchema);