const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: false,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['hod', 'professor', 'student'],
    required: false
  },
  profile: {
    firstName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    fullName: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  college: {
    code: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'college.code': 1 });

module.exports = mongoose.model('User', userSchema);