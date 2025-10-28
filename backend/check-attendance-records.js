const mongoose = require('mongoose');
const { Attendance, Student, Professor } = require('./src/models');

// Check attendance records in database
async function checkAttendanceRecords() {
  try {
    console.log('=== CHECKING ATTENDANCE RECORDS ===\n');

    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/smart-class-axis', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find the student
    const studentId = '68ca716f8f5175cf5330325f'; // Student ID
    const student = await Student.findById(studentId);

    if (!student) {
      console.log('Student not found');
      return;
    }

    console.log('Student ID:', student._id);
    console.log('User ID:', student.userId);
    console.log('Roll Number:', student.rollNumber);
    console.log('Subjects:', student.subjects.length);
    
    // Show subject details
    student.subjects.forEach((sub, index) => {
      console.log(`\nSubject ${index + 1}:`);
      console.log('  - Subject ID:', sub.subjectId);
      console.log('  - Subject Name:', sub.subjectName);
      console.log('  - Subject Code:', sub.subjectCode);
      console.log('  - Professor ID:', sub.professorId);
    });

    // Check all attendance records
    const allAttendance = await Attendance.find({ type: 'student' })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .limit(10);

    console.log(`\nTotal attendance records in database: ${allAttendance.length}`);

    allAttendance.forEach((record, index) => {
      console.log(`\n${index + 1}. Attendance Record:`);
      console.log('  - Date:', record.date);
      console.log('  - Subject:', record.subjectId?.subjectName || 'N/A');
      console.log('  - Professor:', record.professorId?.userId?.profile?.fullName || 'N/A');
      console.log('  - Students in record:', record.records?.length || 0);
      
      // Check if this student is in this record
      const studentRecord = record.records?.find(
        rec => rec.studentId.toString() === studentId
      );
      if (studentRecord) {
        console.log('  - This student status:', studentRecord.status);
      }
    });

    // Check attendance records for this specific student
    const studentAttendance = await Attendance.find({
      type: 'student',
      'records.studentId': studentId
    })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName');

    console.log(`\nAttendance records for this student: ${studentAttendance.length}`);

    studentAttendance.forEach((record, index) => {
      const studentRecord = record.records.find(
        rec => rec.studentId.toString() === studentId
      );
      console.log(`\n${index + 1}. Student Attendance:`);
      console.log('  - Date:', record.date);
      console.log('  - Subject:', record.subjectId?.subjectName || 'N/A');
      console.log('  - Professor:', record.professorId?.userId?.profile?.fullName || 'N/A');
      console.log('  - Status:', studentRecord?.status || 'N/A');
    });

    // Check professor data
    console.log('\n=== PROFESSOR DATA ===');
    const professors = await Professor.find({})
      .populate('userId', 'profile.fullName')
      .limit(5);

    professors.forEach((prof, index) => {
      console.log(`${index + 1}. Professor:`);
      console.log('  - ID:', prof._id);
      console.log('  - Name:', prof.userId?.profile?.fullName || 'N/A');
      console.log('  - Employee ID:', prof.employeeId || 'N/A');
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkAttendanceRecords();
