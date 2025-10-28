const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data for signup
const testStudent = {
  rollNumber: 'STU001',
  email: 'student@test.com',
  password: 'Test123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  dateOfBirth: '2000-01-01',
  address: '123 Test Street, Test City, Test State',
  academicYear: '2nd Year',
  semester: 3,
  specialization: 'Computer Science'
};

const testProfessor = {
  employeeId: 'PROF001',
  email: 'professor@test.com',
  password: 'Test123!',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '1234567891',
  dateOfBirth: '1985-05-15',
  address: '456 Professor Lane, Test City, Test State',
  qualification: 'PhD in Computer Science',
  experience: 10,
  department: 'Computer Science'
};

const testHOD = {
  employeeId: 'HOD001',
  email: 'hod@test.com',
  password: 'Test123!',
  firstName: 'Dr. Robert',
  lastName: 'Johnson',
  phone: '1234567892',
  dateOfBirth: '1975-03-20',
  address: '789 HOD Avenue, Test City, Test State',
  qualification: 'PhD in Computer Science',
  experience: 15,
  department: 'Computer Science'
};

// Test login data
const loginData = {
  email: 'student@test.com',
  password: 'Test123!'
};

async function testAPIs() {
  console.log('🚀 Testing Smart Class Axis APIs...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Student Signup
    console.log('2. Testing Student Signup...');
    try {
      const studentSignupResponse = await axios.post(`${BASE_URL}/auth/student/signup`, testStudent);
      console.log('✅ Student Signup Success:', {
        message: studentSignupResponse.data.message,
        userId: studentSignupResponse.data.data.user.id,
        studentId: studentSignupResponse.data.data.student.id,
        token: studentSignupResponse.data.data.token ? 'Generated' : 'Not generated'
      });
    } catch (error) {
      console.log('❌ Student Signup Error:', error.response?.data?.error?.message || error.message);
    }
    console.log('');

    // Test 3: Professor Signup
    console.log('3. Testing Professor Signup...');
    try {
      const professorSignupResponse = await axios.post(`${BASE_URL}/auth/professor/signup`, testProfessor);
      console.log('✅ Professor Signup Success:', {
        message: professorSignupResponse.data.message,
        userId: professorSignupResponse.data.data.user.id,
        professorId: professorSignupResponse.data.data.professor.id,
        token: professorSignupResponse.data.data.token ? 'Generated' : 'Not generated'
      });
    } catch (error) {
      console.log('❌ Professor Signup Error:', error.response?.data?.error?.message || error.message);
    }
    console.log('');

    // Test 4: HOD Signup
    console.log('4. Testing HOD Signup...');
    try {
      const hodSignupResponse = await axios.post(`${BASE_URL}/auth/hod/signup`, testHOD);
      console.log('✅ HOD Signup Success:', {
        message: hodSignupResponse.data.message,
        userId: hodSignupResponse.data.data.user.id,
        hodId: hodSignupResponse.data.data.hod.id,
        token: hodSignupResponse.data.data.token ? 'Generated' : 'Not generated'
      });
    } catch (error) {
      console.log('❌ HOD Signup Error:', error.response?.data?.error?.message || error.message);
    }
    console.log('');

    // Test 5: Login
    console.log('5. Testing Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log('✅ Login Success:', {
        message: loginResponse.data.message,
        userRole: loginResponse.data.data.user.role,
        userId: loginResponse.data.data.user.id,
        token: loginResponse.data.data.token ? 'Generated' : 'Not generated'
      });
      
      // Store token for protected route test
      const token = loginResponse.data.data.token;
      
      // Test 6: Get Current User (Protected Route)
      console.log('6. Testing Get Current User (Protected Route)...');
      try {
        const currentUserResponse = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Get Current User Success:', {
          userRole: currentUserResponse.data.data.user.role,
          userName: currentUserResponse.data.data.user.profile.firstName + ' ' + currentUserResponse.data.data.user.profile.lastName
        });
      } catch (error) {
        console.log('❌ Get Current User Error:', error.response?.data?.error?.message || error.message);
      }
      
    } catch (error) {
      console.log('❌ Login Error:', error.response?.data?.error?.message || error.message);
    }
    console.log('');

    console.log('🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    console.log('Make sure the server is running on http://localhost:5000');
  }
}

// Run the tests
testAPIs();
