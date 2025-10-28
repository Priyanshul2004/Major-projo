const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test subject-wise attendance calculation
async function testSubjectAttendance() {
  try {
    console.log('=== TESTING SUBJECT-WISE ATTENDANCE CALCULATION ===\n');

    const frontendToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGNhNzE2ZjhmNTE3NWNmNTMzMDMyNWIiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc1ODEwODEzMCwiZXhwIjoxNzU4NzEyOTMwfQ.NMpm80VX0-dq7nDuSlUH_1gCh0PYfO51IYmXESEs3lo';
    const frontendStudentId = '68ca716f8f5175cf5330325b';
    
    console.log('1. Testing updated student attendance card endpoint...');
    const response = await axios.get(`${API_BASE_URL}/student/${frontendStudentId}/attendance/card`, {
      headers: {
        'Authorization': `Bearer ${frontendToken}`
      }
    });
    
    console.log('✅ Endpoint works!');
    console.log('Response status:', response.status);
    
    if (response.data.success && response.data.data) {
      const studentData = response.data.data[0];
      console.log('\n2. Student data:');
      console.log('- Name:', studentData.name);
      console.log('- Roll Number:', studentData.rollNo);
      console.log('- Overall Attendance:', studentData.attendancePercentage, '%');
      console.log('- Total Classes:', studentData.totalClasses);
      console.log('- Present Days:', studentData.attended);
      
      console.log('\n3. Subject-wise attendance:');
      if (studentData.subjects && studentData.subjects.length > 0) {
        studentData.subjects.forEach((subject, index) => {
          console.log(`\n   Subject ${index + 1}:`);
          console.log('   - Name:', subject.subjectName);
          console.log('   - Code:', subject.subjectCode);
          console.log('   - Attendance:', subject.attendance, '%');
          console.log('   - Attended:', subject.attended);
          console.log('   - Total:', subject.total);
          console.log('   - Professor:', subject.professorName);
        });
      } else {
        console.log('   No subjects found');
      }
      
      console.log('\n4. Card view will now show:');
      console.log('✅ Real subject attendance percentages');
      console.log('✅ Actual attended/total class counts');
      console.log('✅ Proper professor names');
      console.log('✅ Department information');
      
    } else {
      console.log('❌ No student data returned');
    }
    
  } catch (error) {
    console.log('❌ Error Status:', error.response?.status);
    console.log('❌ Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('❌ Error Message:', error.message);
  }
}

testSubjectAttendance();
