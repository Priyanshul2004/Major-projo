const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  rollNumber: {
    type: String,
    required: false,
    unique: false
  },
  enrollmentNumber: {
    type: String,
    required: false,
    unique: false
  },
  academicInfo: {
    currentYear: {
      type: Number,
      required: false
    },
    semester: {
      type: Number,
      required: true
    },
    program: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    admissionDate: {
      type: Date,
      required: true
    },
    expectedGraduation: {
      type: Date,
      required: true
    }
  },
  subjects: [{
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    subjectName: {
      type: String,
      required: true
    },
    subjectCode: {
      type: String,
      required: true
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professor',
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'dropped'],
      default: 'enrolled'
    }
  }],
  attendance: {
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  academicPerformance: {
    cgpa: {
      type: Number,
      default: 0
    },
    currentSemesterGPA: {
      type: Number,
      default: 0
    },
    totalCredits: {
      type: Number,
      default: 0
    },
    completedCredits: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: false
  },
  dailyAttendance: {
    attendedDays: {
      type: Number,
      default: 0
    },
    totalDays: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ userId: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ enrollmentNumber: 1 });
studentSchema.index({ 'subjects.subjectId': 1 });
studentSchema.index({ 'academicInfo.currentYear': 1, 'academicInfo.semester': 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model('Student', studentSchema);