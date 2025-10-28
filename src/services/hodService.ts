const API_BASE_URL = 'http://localhost:5000/api';

class HODService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/hod/dashboard/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch dashboard stats');
    }

    return data;
  }

  // Get student attendance for HOD
  async getStudentAttendanceForHOD(page = 1, limit = 20) {
    console.log('=== HOD SERVICE - getStudentAttendanceForHOD ===');
    console.log('Page:', page, 'Limit:', limit);
    
    try {
      const response = await fetch(`${API_BASE_URL}/hod/attendance/students?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch student attendance for HOD');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching student attendance for HOD:', error);
      throw error;
    }
  }

  // Get exam results for HOD
  async getExamResultsForHOD(page = 1, limit = 20, search = '', subject = '', examType = '') {
    console.log('=== HOD SERVICE - getExamResultsForHOD ===');
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject, 'Exam Type:', examType);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(subject && { subjectId: subject }),
        ...(examType && { examType })
      });

      const url = `${API_BASE_URL}/hod/results?${params}`;
      console.log('Request URL:', url);
      console.log('Request headers:', this.getAuthHeaders());

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch exam results for HOD');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching exam results for HOD:', error);
      throw error;
    }
  }

  async getDashboardOverview() {
    const response = await fetch(`${API_BASE_URL}/hod/dashboard/overview`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch dashboard overview');
    }

    return data;
  }

  async getAllStudents(page = 1, limit = 20, search = '', year = '', status = 'active') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      year,
      status
    });

    const response = await fetch(`${API_BASE_URL}/hod/students?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch students');
    }

    return data;
  }

  async getAllProfessors(page = 1, limit = 20, search = '', status = 'active') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status
    });

    const response = await fetch(`${API_BASE_URL}/hod/professors?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch professors');
    }

    return data;
  }

  async createProfessor(professorData: { 
    name: string; 
    email: string; 
    subject: string; 
    experience: string; 
    password: string; 
    phone?: string; 
    qualifications?: string[] 
  }) {
    const response = await fetch(`${API_BASE_URL}/professors`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(professorData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create professor');
    }

    return data;
  }

  async deleteProfessor(professorId: string) {
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete professor');
    }

    return data;
  }

  async getHODProfile(userId: string) {
    const response = await fetch(`${API_BASE_URL}/hod/profile/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch HOD profile');
    }

    return data;
  }

  async updateHODProfile(userId: string, profileData: any) {
    const response = await fetch(`${API_BASE_URL}/hod/profile/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update HOD profile');
    }

    return data;
  }

  // Attendance Management APIs
  async getStudentAttendance(page = 1, limit = 20, search = '', year = '', subject = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(year && { year }),
      ...(subject && { subject })
    });

    const response = await fetch(`${API_BASE_URL}/attendance/students?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch student attendance');
    }

    return data;
  }

  async getProfessorAttendance(page = 1, limit = 20, search = '', subject = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subject })
    });

    const response = await fetch(`${API_BASE_URL}/attendance/professors?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch professor attendance');
    }

    return data;
  }

  async getProfessorsForAttendance() {
    const response = await fetch(`${API_BASE_URL}/attendance/professors/list`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch professors for attendance');
    }

    return data;
  }

  async saveProfessorAttendance(date: string, attendance: Array<{ professorId: string; status: boolean }>) {
    const response = await fetch(`${API_BASE_URL}/attendance/professors/mark`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ date, attendance }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to save professor attendance');
    }

    return data;
  }

  // Exam Results APIs
  async getExamResultsBySubject(examType = 'all', year = '', semester = '') {
    const params = new URLSearchParams({
      ...(examType !== 'all' && { examType }),
      ...(year && { year }),
      ...(semester && { semester })
    });

    const response = await fetch(`${API_BASE_URL}/exam-results/subjects?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch exam results by subject');
    }

    return data;
  }

  async getExamResultsSummary(examType = 'all', year = '', semester = '') {
    const params = new URLSearchParams({
      ...(examType !== 'all' && { examType }),
      ...(year && { year }),
      ...(semester && { semester })
    });

    const response = await fetch(`${API_BASE_URL}/exam-results/summary?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch exam results summary');
    }

    return data;
  }

  async getTopPerformers(limit = 10, examType = 'all', subject = '') {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(examType !== 'all' && { examType }),
      ...(subject && { subject })
    });

    const response = await fetch(`${API_BASE_URL}/exam-results/top-performers?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch top performers');
    }

    return data;
  }

  async getSubjectWiseStatistics(examType = 'all', year = '') {
    const params = new URLSearchParams({
      ...(examType !== 'all' && { examType }),
      ...(year && { year })
    });

    const response = await fetch(`${API_BASE_URL}/exam-results/subject-statistics?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch subject-wise statistics');
    }

    return data;
  }

  // Notice Management APIs
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
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch notices');
    }

    return data;
  }

  async createNotice(noticeData: { title: string; content: string; priority: string; category: string; authorId?: string }) {
    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create notice');
    }

    return data;
  }

  // Common Logout API - Can be used by all dashboards
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Logout failed');
      }

      return {
        success: true,
        message: data.message || 'Logout successful'
      };
    } catch (error) {
      console.error('Logout API call failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('student');
      localStorage.removeItem('professor');
      localStorage.removeItem('hod');
    }
  }
}

export const hodService = new HODService();
