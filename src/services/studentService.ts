const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const studentService = {
  // Get current user data
  async getCurrentUser() {
    console.log('=== STUDENT SERVICE - getCurrentUser ===');
    console.log('Request URL:', `${API_BASE_URL}/auth/me`);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch current user data');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching current user data:', error);
      throw error;
    }
  },

  // Dashboard APIs - Simplified following HOD pattern
  async getDashboardStats() {
    console.log('=== STUDENT DASHBOARD STATS API CALLED ===');
    console.log('Request URL:', `${API_BASE_URL}/student/dashboard/stats`);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/student/dashboard/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch dashboard stats');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },



  // Attendance APIs - Simplified following HOD pattern
  async getMyAttendance(page = 1, limit = 20, search = '', subject = '') {
    console.log('=== STUDENT ATTENDANCE API CALLED ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subject })
    });
    
    const url = `${API_BASE_URL}/student/attendance?${params}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch attendance');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Get student attendance data in card format (same data as professor section)
  async getStudentAttendanceCard(studentId: string) {
    console.log('=== STUDENT SERVICE - getStudentAttendanceCard ===');
    console.log('Student ID:', studentId);
    
    const url = `${API_BASE_URL}/student/${studentId}/attendance/card`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch student attendance card data');
      }
      
      // Return the first student data from the array
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log('Found student data:', data.data[0]);
        return {
          success: true,
          data: data.data[0], // Return single student object
          pagination: data.pagination
        };
      } else {
        console.log('No student data found');
        return {
          success: true,
          data: null,
          pagination: data.pagination
        };
      }
    } catch (error) {
      console.error('Error fetching student attendance card data:', error);
      throw error;
    }
  },

  async getAttendanceSummary() {
    console.log('=== STUDENT ATTENDANCE SUMMARY API CALLED ===');
    
    const url = `${API_BASE_URL}/student/attendance/summary`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch attendance summary');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      throw error;
    }
  },

  async getAttendanceBySubject(subjectId: string) {
    console.log('=== STUDENT ATTENDANCE BY SUBJECT API CALLED ===');
    console.log('Subject ID:', subjectId);
    
    const url = `${API_BASE_URL}/student/attendance/subject/${subjectId}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch attendance by subject');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching attendance by subject:', error);
      throw error;
    }
  },

  // Materials APIs - Simplified following HOD pattern
  async getMyMaterials(page = 1, limit = 20, search = '', subject = '', type = '') {
    console.log('=== STUDENT MATERIALS API CALLED ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject, 'Type:', type);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subject }),
      ...(type && { type })
    });
    
    const url = `${API_BASE_URL}/student/materials?${params}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch materials');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  async getMaterialById(materialId: string) {
    console.log('=== STUDENT MATERIAL BY ID API CALLED ===');
    console.log('Material ID:', materialId);
    
    const url = `${API_BASE_URL}/student/materials/${materialId}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch material');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching material:', error);
      throw error;
    }
  },

  async downloadMaterial(materialId: string) {
    console.log('=== STUDENT DOWNLOAD MATERIAL API CALLED ===');
    console.log('Material ID:', materialId);
    
    const url = `${API_BASE_URL}/student/materials/${materialId}/download`;
    console.log('Request URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to download material');
      }
      
      // Handle file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `material-${materialId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true, message: 'Material downloaded successfully' };
    } catch (error) {
      console.error('Error downloading material:', error);
      throw error;
    }
  },

  // Results APIs - Simplified following HOD pattern
  async getMyResults(page = 1, limit = 20, search = '', subject = '', examType = '') {
    console.log('=== STUDENT RESULTS API CALLED ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject, 'Exam Type:', examType);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subject }),
      ...(examType && { examType })
    });
    
    const url = `${API_BASE_URL}/student/results?${params}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch results');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },

  async getResultById(resultId: string) {
    console.log('=== STUDENT RESULT BY ID API CALLED ===');
    console.log('Result ID:', resultId);
    
    const url = `${API_BASE_URL}/student/results/${resultId}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch result');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  },

  async getPerformanceSummary() {
    console.log('=== STUDENT PERFORMANCE SUMMARY API CALLED ===');
    
    const url = `${API_BASE_URL}/student/results/performance/summary`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch performance summary');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching performance summary:', error);
      throw error;
    }
  },

  // Get student results data in card format (same data as professor section)
  async getStudentResultsCard(studentId: string) {
    console.log('=== STUDENT SERVICE - getStudentResultsCard ===');
    console.log('Student ID:', studentId);
    
    const url = `${API_BASE_URL}/student/${studentId}/results/card`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch student results card data');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching student results card data:', error);
      throw error;
    }
  },

  // Communication APIs - Simplified following HOD pattern
  async getMyCommunications(page = 1, limit = 20, search = '', subject = '', status = '') {
    console.log('=== STUDENT COMMUNICATIONS API CALLED ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject, 'Status:', status);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subject }),
      ...(status && { status })
    });
    
    const url = `${API_BASE_URL}/student/communications?${params}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch communications');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching communications:', error);
      throw error;
    }
  },

  // Unified Communication API - Get ALL student doubts/questions (same as professor)
  async getAllStudentDoubts(page = 1, limit = 20, search = '', status = '', priority = '', subject = '') {
    console.log('=== STUDENT SERVICE - getAllStudentDoubts ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Status:', status, 'Priority:', priority, 'Subject:', subject);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(subject && { subject })
    });

    const url = `${API_BASE_URL}/communications/all?${params}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch student doubts');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching student doubts:', error);
      throw error;
    }
  },

  async askDoubt(doubtData: any) {
    console.log('=== STUDENT ASK DOUBT API CALLED ===');
    console.log('Doubt data:', doubtData);
    
    const url = `${API_BASE_URL}/student/communications`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(doubtData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to ask doubt');
      }
      
      return data;
    } catch (error) {
      console.error('Error asking doubt:', error);
      throw error;
    }
  },

  async getCommunicationById(communicationId: string) {
    console.log('=== STUDENT COMMUNICATION BY ID API CALLED ===');
    console.log('Communication ID:', communicationId);
    
    const url = `${API_BASE_URL}/student/communications/${communicationId}`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch communication');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching communication:', error);
      throw error;
    }
  },

  async getCommunicationStats() {
    console.log('=== STUDENT COMMUNICATION STATS API CALLED ===');
    
    const url = `${API_BASE_URL}/student/communications/stats`;
    console.log('Request URL:', url);
    console.log('Headers:', getAuthHeaders());
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch communication stats');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching communication stats:', error);
      throw error;
    }
  },

  // Notice APIs
  async getAllNotices(page = 1, limit = 20, priority = '', category = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(priority && { priority }),
      ...(category && { category }),
      ...(search && { search })
    });

    const response = await fetch(`${API_BASE_URL}/notices?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch notices');
    }

    return data;
  }
};