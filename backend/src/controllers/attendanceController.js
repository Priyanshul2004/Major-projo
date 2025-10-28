const { User, Professor, Student, Attendance, Subject } = require('../models');
const mongoose = require('mongoose');

// Get Student Attendance Overview
const getStudentAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', year = '', subject = '' } = req.query;
    
    // Build query for students
    const studentQuery = { status: 'active' };
    
    if (year) {
      studentQuery['academicInfo.currentYear'] = parseInt(year);
    }

    if (subject) {
      studentQuery['subjects.subjectName'] = { $regex: subject, $options: 'i' };
    }

    // Get students with attendance data
    const students = await Student.find(studentQuery)
      .populate('userId', 'profile.fullName')
      .select('rollNumber academicInfo.currentYear academicInfo.specialization attendance subjects')
      .sort({ rollNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Student.countDocuments(studentQuery);

    // Format response
    const studentAttendanceData = students.map(student => ({
      id: student._id,
      name: student.userId.profile.fullName,
      rollNo: student.rollNumber,
      totalClasses: student.attendance.totalClasses,
      attended: student.attendance.attendedClasses,
      percentage: student.attendance.percentage
    }));

    res.json({
      success: true,
      data: studentAttendanceData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student attendance',
        details: error.message
      }
    });
  }
};

// Get Professor Attendance Overview
const getProfessorAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', subject = '' } = req.query;
    
    // Build query for professors
    const professorQuery = { status: 'active' };
    
    if (subject) {
      professorQuery['subjects.subjectName'] = { $regex: subject, $options: 'i' };
    }

    // Get professors with attendance data
    const professors = await Professor.find(professorQuery)
      .populate('userId', 'profile.fullName')
      .select('employeeId subjects performance')
      .sort({ employeeId: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Professor.countDocuments(professorQuery);

    // Format response
    const professorAttendanceData = professors.map(professor => {
      const totalDays = 100; // Fixed value as requested
      const present = professor.performance.totalClasses || 0; // Use totalClasses as present days
      const percentage = totalDays > 0 ? (present / totalDays * 100) : 0;
      
      return {
        id: professor._id,
        name: professor.userId.profile.fullName,
        subject: professor.subjects.length > 0 ? professor.subjects[0].subjectName : 'Not Assigned',
        totalDays: totalDays,
        present: present,
        percentage: percentage
      };
    });

    res.json({
      success: true,
      data: professorAttendanceData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch professor attendance',
        details: error.message
      }
    });
  }
};

// Get Professors List for Marking Attendance
const getProfessorsForAttendance = async (req, res) => {
  try {
    // Get all active professors with their primary subjects
    const professors = await Professor.find({ status: 'active' })
      .populate('userId', 'profile.fullName')
      .select('employeeId subjects')
      .sort({ employeeId: 1 });

    // Format response for attendance marking
    const professorsData = professors.map(professor => ({
      id: professor._id,
      name: professor.userId.profile.fullName,
      subject: professor.subjects.length > 0 ? professor.subjects[0].subjectName : 'Not Assigned'
    }));

    res.json({
      success: true,
      data: professorsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch professors for attendance',
        details: error.message
      }
    });
  }
};

// Save Professor Attendance
const saveProfessorAttendance = async (req, res) => {
  try {
    console.log('=== saveProfessorAttendance CALLED ===');
    console.log('Request body:', req.body);
    
    const { date, attendance } = req.body;

    // Validate input
    if (!date || !attendance || !Array.isArray(attendance)) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        error: {
          message: 'Date and attendance data are required'
        }
      });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      date: new Date(date),
      type: 'professor'
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Attendance already marked for this date'
        }
      });
    }

    // Prepare attendance records
    const attendanceRecords = [];
    let totalPresent = 0;
    let totalAbsent = 0;

    for (const record of attendance) {
      const { professorId, status } = record;
      console.log('Processing professor:', professorId, 'status:', status);
      
      // Get professor details
      const professor = await Professor.findById(professorId).populate('userId');
      if (!professor) {
        console.log('Professor not found:', professorId);
        continue;
      }
      console.log('Professor found:', professor.userId?.profile?.fullName);

      attendanceRecords.push({
        userId: professor.userId._id,
        userType: 'professor',
        status: status ? 'present' : 'absent',
        markedBy: req.user?.userId || new mongoose.Types.ObjectId(), // Use HOD's user ID from token
        markedAt: new Date(),
        remarks: ''
      });

      if (status) {
        totalPresent++;
      } else {
        totalAbsent++;
      }
    }

    // Create attendance record
    const attendanceDoc = new Attendance({
      date: new Date(date),
      type: 'professor',
      records: attendanceRecords,
      totalExpected: attendance.length,
      totalPresent,
      totalAbsent,
      attendancePercentage: attendance.length > 0 ? (totalPresent / attendance.length * 100) : 0
    });

    await attendanceDoc.save();

    // Update professor performance statistics
    for (const record of attendance) {
      const { professorId, status } = record;
      
      if (status) {
        console.log('Updating professor performance for:', professorId);
        // Increment totalClasses (which represents present days)
        // Use upsert to ensure performance field exists
        await Professor.findByIdAndUpdate(professorId, {
          $inc: { 'performance.totalClasses': 1 }
        }, {
          upsert: false,
          setDefaultsOnInsert: true
        });
        console.log('Professor performance updated successfully');
      }
    }

    res.json({
      success: true,
      data: {
        attendanceId: attendanceDoc._id,
        date: attendanceDoc.date,
        totalExpected: attendanceDoc.totalExpected,
        totalPresent: attendanceDoc.totalPresent,
        totalAbsent: attendanceDoc.totalAbsent,
        attendancePercentage: attendanceDoc.attendancePercentage
      },
      message: 'Professor attendance saved successfully'
    });
  } catch (error) {
    console.error('Error in saveProfessorAttendance:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to save professor attendance',
        details: error.message
      }
    });
  }
};

// Get Attendance Reports
const getAttendanceReports = async (req, res) => {
  try {
    const { startDate, endDate, type = 'all' } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build type filter
    const typeFilter = {};
    if (type !== 'all') {
      typeFilter.type = type;
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find({
      ...dateFilter,
      ...typeFilter
    })
    .populate('records.userId', 'profile.fullName')
    .sort({ date: -1 });

    // Format response
    const reports = attendanceRecords.map(record => ({
      id: record._id,
      date: record.date,
      type: record.type,
      totalExpected: record.totalExpected,
      totalPresent: record.totalPresent,
      totalAbsent: record.totalAbsent,
      attendancePercentage: record.attendancePercentage,
      records: record.records.map(rec => ({
        userId: rec.userId._id,
        name: rec.userId.profile.fullName,
        status: rec.status,
        markedAt: rec.markedAt
      }))
    }));

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance reports',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentAttendance,
  getProfessorAttendance,
  getProfessorsForAttendance,
  saveProfessorAttendance,
  getAttendanceReports
};
