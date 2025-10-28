// Quick API Test Script
// Run this after starting the server with: node server.js

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPIs() {
  console.log('🚀 Testing Smart Class Axis APIs...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await makeRequest('GET', '/health');
    if (healthResponse.status === 200) {
      console.log('✅ Health Check:', healthResponse.data.message);
    } else {
      console.log('❌ Health Check Failed:', healthResponse.data);
    }
    console.log('');

    // Test 2: Student Signup
    console.log('2. Testing Student Signup...');
    const studentData = {
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

    const studentResponse = await makeRequest('POST', '/auth/student/signup', studentData);
    if (studentResponse.status === 201) {
      console.log('✅ Student Signup Success:', studentResponse.data.message);
      console.log('   User ID:', studentResponse.data.data.user.id);
      console.log('   Student ID:', studentResponse.data.data.student.id);
      console.log('   Token:', studentResponse.data.data.token ? 'Generated' : 'Not generated');
    } else {
      console.log('❌ Student Signup Error:', studentResponse.data.error?.message || 'Unknown error');
    }
    console.log('');

    // Test 3: Professor Signup
    console.log('3. Testing Professor Signup...');
    const professorData = {
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

    const professorResponse = await makeRequest('POST', '/auth/professor/signup', professorData);
    if (professorResponse.status === 201) {
      console.log('✅ Professor Signup Success:', professorResponse.data.message);
      console.log('   User ID:', professorResponse.data.data.user.id);
      console.log('   Professor ID:', professorResponse.data.data.professor.id);
      console.log('   Token:', professorResponse.data.data.token ? 'Generated' : 'Not generated');
    } else {
      console.log('❌ Professor Signup Error:', professorResponse.data.error?.message || 'Unknown error');
    }
    console.log('');

    // Test 4: HOD Signup
    console.log('4. Testing HOD Signup...');
    const hodData = {
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

    const hodResponse = await makeRequest('POST', '/auth/hod/signup', hodData);
    if (hodResponse.status === 201) {
      console.log('✅ HOD Signup Success:', hodResponse.data.message);
      console.log('   User ID:', hodResponse.data.data.user.id);
      console.log('   HOD ID:', hodResponse.data.data.hod.id);
      console.log('   Token:', hodResponse.data.data.token ? 'Generated' : 'Not generated');
    } else {
      console.log('❌ HOD Signup Error:', hodResponse.data.error?.message || 'Unknown error');
    }
    console.log('');

    // Test 5: Login
    console.log('5. Testing Login...');
    const loginData = {
      email: 'student@test.com',
      password: 'Test123!'
    };

    const loginResponse = await makeRequest('POST', '/auth/login', loginData);
    if (loginResponse.status === 200) {
      console.log('✅ Login Success:', loginResponse.data.message);
      console.log('   User Role:', loginResponse.data.data.user.role);
      console.log('   User ID:', loginResponse.data.data.user.id);
      console.log('   Token:', loginResponse.data.data.token ? 'Generated' : 'Not generated');
      
      const token = loginResponse.data.data.token;
      
      // Test 6: Get Current User (Protected Route)
      console.log('6. Testing Get Current User (Protected Route)...');
      const currentUserResponse = await makeRequest('GET', '/auth/me', null, token);
      if (currentUserResponse.status === 200) {
        console.log('✅ Get Current User Success');
        console.log('   User Role:', currentUserResponse.data.data.user.role);
        console.log('   User Name:', currentUserResponse.data.data.user.profile.firstName, currentUserResponse.data.data.user.profile.lastName);
      } else {
        console.log('❌ Get Current User Error:', currentUserResponse.data.error?.message || 'Unknown error');
      }
      
    } else {
      console.log('❌ Login Error:', loginResponse.data.error?.message || 'Unknown error');
    }
    console.log('');

    console.log('🎉 API Testing Complete!');
    console.log('');
    console.log('📋 Available API Endpoints:');
    console.log('   POST /api/auth/student/signup - Student Registration');
    console.log('   POST /api/auth/professor/signup - Professor Registration');
    console.log('   POST /api/auth/hod/signup - HOD Registration');
    console.log('   POST /api/auth/login - User Login');
    console.log('   GET /api/auth/me - Get Current User (Protected)');
    console.log('   GET /api/health - Health Check');

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    console.log('Make sure the server is running on http://localhost:5000');
    console.log('Start the server with: node server.js');
  }
}

// Run the tests
testAPIs();
