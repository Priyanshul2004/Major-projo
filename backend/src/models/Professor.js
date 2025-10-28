const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  employeeId: {
    type: String,
    required: false,
    unique: false
  },
  subjects: [{
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: false
    },
    subjectName: {
      type: String,
      required: false
    },
    subjectCode: {
      type: String,
      required: false
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  experience: {
    totalYears: {
      type: Number,
      required: false
    },
    previousInstitutions: [{
      name: String,
      position: String,
      duration: String
    }]
  },
  qualifications: [{
    degree: String,
    field: String,
    institution: String,
    year: Number
  }],
  schedule: {
    workingDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    workingHours: {
      start: String,
      end: String
    }
  },
  performance: {
    rating: {
      type: Number,
      default: 0
    },
    totalClasses: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      default: 0
    },
    studentFeedback: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
professorSchema.index({ userId: 1 });
professorSchema.index({ employeeId: 1 });
professorSchema.index({ 'subjects.subjectId': 1 });
professorSchema.index({ status: 1 });

module.exports = mongoose.model('Professor', professorSchema);