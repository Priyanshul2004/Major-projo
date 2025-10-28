const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

// Test Student Dashboard APIs
async function testStudentAPIs() {
  console.log('=== TESTING STUDENT DASHBOARD APIs ===');
  
  try {
    // Test 1: Dashboard Stats
    console.log('\n1. Testing GET /api/student/dashboard/stats');
    const statsResponse = await fetch(`${API_BASE_URL}/student/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth but should show route exists
      }
    });
    console.log('Status:', statsResponse.status);
    const statsData = await statsResponse.json();
    console.log('Response:', JSON.stringify(statsData, null, 2));
    
    // Test 2: Recent Activity
    console.log('\n2. Testing GET /api/student/dashboard/activity');
    const activityResponse = await fetch(`${API_BASE_URL}/student/dashboard/activity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Status:', activityResponse.status);
    const activityData = await activityResponse.json();
    console.log('Response:', JSON.stringify(activityData, null, 2));
    
    // Test 3: Assignments
    console.log('\n3. Testing GET /api/student/assignments');
    const assignmentsResponse = await fetch(`${API_BASE_URL}/student/assignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Status:', assignmentsResponse.status);
    const assignmentsData = await assignmentsResponse.json();
    console.log('Response:', JSON.stringify(assignmentsData, null, 2));
    
  } catch (error) {
    console.error('Error testing Student APIs:', error.message);
  }
}

// Run the test
testStudentAPIs();
