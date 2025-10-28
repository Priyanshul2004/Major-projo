// Export all models from a single file for easy importing
const User = require('./User');
const Professor = require('./Professor');
const Student = require('./Student');
const HOD = require('./HOD');
const Subject = require('./Subject');
const Attendance = require('./Attendance');
const ExamResult = require('./ExamResult');
const Notice = require('./Notice');
const Material = require('./Material');
const Communication = require('./Communication');
const College = require('./College');

module.exports = {
  User,
  Professor,
  Student,
  HOD,
  Subject,
  Attendance,
  ExamResult,
  Notice,
  Material,
  Communication,
  College
};
