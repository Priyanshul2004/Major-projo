const { Attendance, Student, Professor, Subject } = require('../models');
const mongoose = require('mongoose');

// Get student's attendance records
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId = '', startDate = '', endDate = '', page = 1, limit = 50 } = req.query;

    // Get student and their subjects
    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'employeeId')
      .populate('subjects.professorId.userId', 'profile.fullName');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Build query
    const query = {
      type: 'student',
      'records.studentId': new mongoose.Types.ObjectId(studentId)
    };

    if (subjectId) {
      query.subjectId = new mongoose.Types.ObjectId(subjectId);
    } else {
      query.subjectId = { $in: studentSubjects };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get attendance records with pagination
    const attendanceRecords = await Attendance.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('date subjectId professorId records type')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Attendance.countDocuments(query);

    // Format response
    const attendanceData = attendanceRecords.map(record => {
      const studentRecord = record.records.find(
        rec => rec.studentId.toString() === studentId
      );

      return {
        id: record._id,
        date: record.date,
        subject: {
          id: record.subjectId._id,
          name: record.subjectId.subjectName,
          code: record.subjectId.subjectCode,
          department: record.subjectId.department
        },
        professor: {
          id: record.professorId._id,
          employeeId: record.professorId.employeeId,
          name: record.professorId.userId.profile.fullName
        },
        status: studentRecord?.status || 'absent',
        remarks: studentRecord?.remarks || '',
        markedAt: studentRecord?.markedAt || record.date
      };
    });

    res.json({
      success: true,
      data: attendanceData,
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
        message: 'Failed to fetch attendance records',
        details: error.message
      }
    });
  }
};

// Get student's attendance summary
const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'employeeId')
      .populate('subjects.professorId.userId', 'profile.fullName');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Get attendance summary by subject
    const attendanceSummary = await Attendance.aggregate([
      {
        $match: {
          type: 'student',
          subjectId: { $in: studentSubjects },
          'records.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $unwind: '$records'
      },
      {
        $match: {
          'records.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: '$subjectId',
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0]
            }
          },
          absentClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'absent'] }, 1, 0]
            }
          },
          lateClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'late'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $lookup: {
          from: 'professors',
          localField: 'subject.professorId',
          foreignField: '_id',
          as: 'professor'
        }
      },
      {
        $unwind: '$professor'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'professor.userId',
          foreignField: '_id',
          as: 'professorUser'
        }
      },
      {
        $unwind: '$professorUser'
      },
      {
        $project: {
          subject: {
            id: '$subject._id',
            name: '$subject.subjectName',
            code: '$subject.subjectCode',
            department: '$subject.department'
          },
          professor: {
            id: '$professor._id',
            employeeId: '$professor.employeeId',
            name: '$professorUser.profile.fullName'
          },
          totalClasses: 1,
          presentClasses: 1,
          absentClasses: 1,
          lateClasses: 1,
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$presentClasses', '$totalClasses'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: { 'subject.name': 1 }
      }
    ]);

    // Calculate overall attendance
    const overallStats = await Attendance.aggregate([
      {
        $match: {
          type: 'student',
          subjectId: { $in: studentSubjects },
          'records.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $unwind: '$records'
      },
      {
        $match: {
          'records.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0]
            }
          },
          absentClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'absent'] }, 1, 0]
            }
          },
          lateClasses: {
            $sum: {
              $cond: [{ $eq: ['$records.status', 'late'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const overallAttendance = overallStats[0] ? {
      totalClasses: overallStats[0].totalClasses,
      presentClasses: overallStats[0].presentClasses,
      absentClasses: overallStats[0].absentClasses,
      lateClasses: overallStats[0].lateClasses,
      attendancePercentage: overallStats[0].totalClasses > 0 ? 
        Math.round((overallStats[0].presentClasses / overallStats[0].totalClasses) * 100 * 100) / 100 : 0
    } : {
      totalClasses: 0,
      presentClasses: 0,
      absentClasses: 0,
      lateClasses: 0,
      attendancePercentage: 0
    };

    res.json({
      success: true,
      data: {
        overall: overallAttendance,
        bySubject: attendanceSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance summary',
        details: error.message
      }
    });
  }
};

// Get recent attendance history
const getRecentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 20 } = req.query;

    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Get recent attendance records
    const recentAttendance = await Attendance.find({
      type: 'student',
      subjectId: { $in: studentSubjects },
      'records.studentId': new mongoose.Types.ObjectId(studentId)
    })
      .populate('subjectId', 'subjectName subjectCode')
      .select('date subjectId records')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Format response
    const recentAttendanceData = recentAttendance.map(record => {
      const studentRecord = record.records.find(
        rec => rec.studentId.toString() === studentId
      );

      return {
        id: record._id,
        date: record.date,
        subject: {
          id: record.subjectId._id,
          name: record.subjectId.subjectName,
          code: record.subjectId.subjectCode
        },
        status: studentRecord?.status || 'absent',
        remarks: studentRecord?.remarks || ''
      };
    });

    res.json({
      success: true,
      data: recentAttendanceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch recent attendance history',
        details: error.message
      }
    });
  }
};

// Get attendance by subject
const getAttendanceBySubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const { startDate = '', endDate = '', page = 1, limit = 50 } = req.query;

    // Verify student is enrolled in this subject
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const isEnrolled = student.subjects.some(
      sub => sub.subjectId.toString() === subjectId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not enrolled in this subject'
        }
      });
    }

    // Build query
    const query = {
      type: 'student',
      subjectId: new mongoose.Types.ObjectId(subjectId),
      'records.studentId': new mongoose.Types.ObjectId(studentId)
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('date subjectId professorId records')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Attendance.countDocuments(query);

    // Format response
    const attendanceData = attendanceRecords.map(record => {
      const studentRecord = record.records.find(
        rec => rec.studentId.toString() === studentId
      );

      return {
        id: record._id,
        date: record.date,
        subject: {
          id: record.subjectId._id,
          name: record.subjectId.subjectName,
          code: record.subjectId.subjectCode,
          department: record.subjectId.department
        },
        professor: {
          id: record.professorId._id,
          employeeId: record.professorId.employeeId,
          name: record.professorId.userId.profile.fullName
        },
        status: studentRecord?.status || 'absent',
        remarks: studentRecord?.remarks || '',
        markedAt: studentRecord?.markedAt || record.date
      };
    });

    res.json({
      success: true,
      data: attendanceData,
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
        message: 'Failed to fetch attendance by subject',
        details: error.message
      }
    });
  }
};

// Get attendance calendar view
const getAttendanceCalendar = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year, month } = req.query;

    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Build date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get attendance records for the month
    const attendanceRecords = await Attendance.find({
      type: 'student',
      subjectId: { $in: studentSubjects },
      'records.studentId': new mongoose.Types.ObjectId(studentId),
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .populate('subjectId', 'subjectName subjectCode')
      .select('date subjectId records')
      .sort({ date: 1 });

    // Format response for calendar view
    const calendarData = attendanceRecords.map(record => {
      const studentRecord = record.records.find(
        rec => rec.studentId.toString() === studentId
      );

      return {
        date: record.date,
        subject: {
          id: record.subjectId._id,
          name: record.subjectId.subjectName,
          code: record.subjectId.subjectCode
        },
        status: studentRecord?.status || 'absent',
        remarks: studentRecord?.remarks || ''
      };
    });

    res.json({
      success: true,
      data: calendarData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance calendar',
        details: error.message
      }
    });
  }
};

// Get student attendance data in professor format (for card view)
const getStudentAttendanceCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('=== GET STUDENT ATTENDANCE CARD ===');
    console.log('Student ID (could be User ID):', studentId);

    // Try to find student by ID first, then by userId if not found
    let student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode department')
      .populate('subjects.professorId', 'employeeId')
      .populate('subjects.professorId.userId', 'profile.fullName')
      .populate('userId', 'profile.fullName email')
      .select('userId rollNumber subjects dailyAttendance');

    // If not found by Student ID, try to find by User ID
    if (!student) {
      console.log('Student not found by ID, trying to find by User ID...');
      student = await Student.findOne({ userId: studentId })
        .populate('subjects.subjectId', 'subjectName subjectCode department')
        .populate('subjects.professorId', 'employeeId')
        .populate('subjects.professorId.userId', 'profile.fullName')
        .populate('userId', 'profile.fullName email')
        .select('userId rollNumber subjects dailyAttendance');
    }

    if (!student) {
      console.log('Student not found');
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    console.log('Student found:', {
      id: student._id,
      name: student.userId?.profile?.fullName,
      rollNo: student.rollNumber
    });

    // Calculate attendance statistics
    const totalClasses = 100; // Fixed as per requirement
    const attendedDays = student.dailyAttendance?.attendedDays || 0;
    const attendancePercentage = totalClasses > 0 ? (attendedDays / totalClasses) * 100 : 0;

    // Calculate subject-wise attendance statistics
    const subjectsData = await Promise.all(
      student.subjects.map(async (sub) => {
        if (!sub.subjectId) {
          return {
            subjectId: null,
            subjectName: 'Unknown Subject',
            subjectCode: 'N/A',
            department: 'N/A',
            professorId: sub.professorId?._id,
            professorName: sub.professorId?.userId?.profile?.fullName || 'Unknown Professor',
            employeeId: sub.professorId?.employeeId || 'N/A',
            attendance: 0,
            attended: 0,
            total: 0
          };
        }

        // Get attendance records for this subject
        const attendanceRecords = await Attendance.find({
          type: 'student',
          subjectId: sub.subjectId._id,
          'records.studentId': student._id
        });

        // Calculate statistics
        let totalClasses = 0;
        let attendedClasses = 0;

        attendanceRecords.forEach(record => {
          const studentRecord = record.records.find(
            rec => rec.studentId.toString() === student._id.toString()
          );
          if (studentRecord) {
            totalClasses++;
            if (studentRecord.status === 'present') {
              attendedClasses++;
            }
          }
        });

        const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

        return {
          subjectId: sub.subjectId._id,
          subjectName: sub.subjectId.subjectName || 'Unknown Subject',
          subjectCode: sub.subjectId.subjectCode || 'N/A',
          department: sub.subjectId.department || 'N/A',
          professorId: sub.professorId?._id,
          professorName: sub.professorId?.userId?.profile?.fullName || 'Unknown Professor',
          employeeId: sub.professorId?.employeeId || 'N/A',
          attendance: Math.round(attendancePercentage * 100) / 100,
          attended: attendedClasses,
          total: totalClasses
        };
      })
    );

    // Format response to match professor API format
    const studentData = {
      id: student._id,
      studentId: student._id,
      name: student.userId?.profile?.fullName || 'Unknown Student',
      rollNo: student.rollNumber || 'N/A',
      totalClasses: totalClasses,
      attended: attendedDays,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      subjects: subjectsData,
      dailyAttendance: student.dailyAttendance || {
        attendedDays: 0,
        totalDays: totalClasses,
        percentage: 0,
        lastUpdated: new Date()
      }
    };

    console.log('Formatted student data:', {
      name: studentData.name,
      rollNo: studentData.rollNo,
      totalClasses: studentData.totalClasses,
      attended: studentData.attended,
      attendancePercentage: studentData.attendancePercentage
    });

    res.json({
      success: true,
      data: [studentData], // Return as array to match professor API format
      pagination: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1
      }
    });

  } catch (error) {
    console.error('Error in getStudentAttendanceCard:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student attendance card data',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentAttendance,
  getStudentAttendanceSummary,
  getRecentAttendanceHistory,
  getAttendanceBySubject,
  getAttendanceCalendar,
  getStudentAttendanceCard
};
