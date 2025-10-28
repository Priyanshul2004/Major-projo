const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: true
  },
  remarks: {
    type: String,
    default: ''
  }
});

const examResultSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    unique: true
  },
  examName: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final', 'quiz', 'assignment'],
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  results: [resultSchema],
  statistics: {
    totalStudents: {
      type: Number,
      default: 0
    },
    passedStudents: {
      type: Number,
      default: 0
    },
    failedStudents: {
      type: Number,
      default: 0
    },
    passPercentage: {
      type: Number,
      default: 0
    },
    averageMarks: {
      type: Number,
      default: 0
    },
    highestMarks: {
      type: Number,
      default: 0
    },
    lowestMarks: {
      type: Number,
      default: 0
    }
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Indexes
examResultSchema.index({ examId: 1 });
examResultSchema.index({ subjectId: 1, examDate: 1 });
examResultSchema.index({ academicYear: 1, semester: 1 });
examResultSchema.index({ publishedBy: 1 });
examResultSchema.index({ status: 1 });

module.exports = mongoose.model('ExamResult', examResultSchema);
