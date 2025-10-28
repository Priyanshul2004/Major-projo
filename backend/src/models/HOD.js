const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
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
  qualification: {
    type: String,
    required: false
  },
  experience: {
    type: Number,
    required: false
  },
  department: {
    type: String,
    required: false
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
hodSchema.index({ userId: 1 });
hodSchema.index({ employeeId: 1 });
hodSchema.index({ department: 1 });
hodSchema.index({ status: 1 });

module.exports = mongoose.model('HOD', hodSchema);
