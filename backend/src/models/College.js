const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  establishedYear: {
    type: Number,
    required: true
  }
});

const collegeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['university', 'college', 'institute'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    zipCode: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  departments: [departmentSchema],
  academicYear: {
    current: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  settings: {
    attendanceThreshold: {
      type: Number,
      default: 75
    },
    maxStudentsPerClass: {
      type: Number,
      default: 60
    },
    workingDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '17:00'
      }
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
collegeSchema.index({ code: 1 });
collegeSchema.index({ status: 1 });
collegeSchema.index({ 'departments.code': 1 });

module.exports = mongoose.model('College', collegeSchema);