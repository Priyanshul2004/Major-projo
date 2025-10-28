const API_BASE_URL = 'http://localhost:5000/api';

class ProfessorService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get current user data
  async getCurrentUser() {
    console.log('=== PROFESSOR SERVICE - getCurrentUser ===');
    console.log('Request URL:', `${API_BASE_URL}/auth/me`);
    console.log('Headers:', this.getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
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
  }

  // Dashboard APIs - Simplified following HOD pattern
  async getDashboardStats() {
    console.log('Professor Service - getDashboardStats called');
    const response = await fetch(`${API_BASE_URL}/professor/dashboard/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch dashboard stats');
    }

    return data;
  }

  async getRecentActivity() {
    const response = await fetch(`${API_BASE_URL}/professor/dashboard/activity`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch recent activity');
    }

    return data;
  }

  async getProfileSummary(professorId: string) {
    const response = await fetch(`${API_BASE_URL}/professor-dashboard/${professorId}/dashboard/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch profile summary');
    }

    return data;
  }

  // Attendance APIs
  async getStudentAttendance(params?: {
    page?: number;
    limit?: number;
    subjectId?: string;
    search?: string;
    professorId?: string;
  }) {
    console.log('=== PROFESSOR SERVICE - getStudentAttendance ===');
    console.log('Params:', params);
    
    // Get professor ID from params or use 'current' as fallback
    const professorId = params?.professorId || 'current';
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.subjectId) queryParams.append('subjectId', params.subjectId);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/professor/${professorId}/attendance/students?${queryParams}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', response.headers);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch student attendance');
    }

    return data;
  }

  async getAttendanceSummary(subjectId?: string, professorId?: string) {
    console.log('=== PROFESSOR SERVICE - getAttendanceSummary ===');
    console.log('Subject ID:', subjectId);
    console.log('Professor ID:', professorId);
    
    const queryParams = new URLSearchParams();
    if (subjectId) queryParams.append('subjectId', subjectId);

    const url = `${API_BASE_URL}/professor/${professorId || 'current'}/attendance/summary?${queryParams}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch attendance summary');
    }

    return data;
  }

  async getProfessorSubjects(professorId?: string) {
    console.log('=== PROFESSOR SERVICE - getProfessorSubjects ===');
    console.log('Professor ID:', professorId);
    
    const url = `${API_BASE_URL}/professor/${professorId || 'current'}/attendance/subjects`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch professor subjects');
    }

    return data;
  }

  // Students Management APIs
  async getMyStudents(professorId: string, page = 1, limit = 20, search = '', subject = '') {
    console.log('=== PROFESSOR SERVICE - getMyStudents ===');
    console.log('Professor ID:', professorId);
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      subject
    });

    const url = `${API_BASE_URL}/professor/${professorId}/class/students?${params}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch students');
    }

    return data;
  }

  async getStudentDetails(professorId: string, studentId: string) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/students/${studentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch student details');
    }

    return data;
  }


  // Attendance APIs
  async getMyAttendance(professorId: string, page = 1, limit = 20, date = '', subject = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      date,
      subject
    });

    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/attendance?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch attendance');
    }

    return data;
  }

  async markAttendance(professorId: string, attendanceData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/attendance`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(attendanceData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to mark attendance');
    }

    return data;
  }

  async getStudentAttendanceById(professorId: string, studentId: string, subject = '') {
    const params = new URLSearchParams({
      subject
    });

    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/students/${studentId}/attendance?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch student attendance');
    }

    return data;
  }

  // Materials APIs
  async getMyMaterials(professorId: string, page = 1, limit = 20, search = '', type = '', subject = '', status = '') {
    console.log('=== PROFESSOR SERVICE - getMyMaterials ===');
    console.log('Professor ID:', professorId);
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Type:', type, 'Subject:', subject, 'Status:', status);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(type && { type }),
      ...(subject && { subjectId: subject }),
      ...(status && { status })
    });

    const url = `${API_BASE_URL}/professor/${professorId}/materials?${params}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch materials');
    }

    return data;
  }

  async getMaterialStatistics(professorId: string) {
    console.log('=== PROFESSOR SERVICE - getMaterialStatistics ===');
    console.log('Professor ID:', professorId);
    
    const url = `${API_BASE_URL}/professor/${professorId}/materials/statistics`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch material statistics');
    }

    return data;
  }

  async uploadMaterial(professorId: string, materialData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/materials`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(materialData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload material');
    }

    return data;
  }

  async updateMaterial(professorId: string, materialId: string, materialData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/materials/${materialId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(materialData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update material');
    }

    return data;
  }

  async deleteMaterial(professorId: string, materialId: string) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/materials/${materialId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete material');
    }

    return data;
  }

  // Results APIs
  async getMyResults(professorId: string, page = 1, limit = 20, examType = '', subject = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      examType,
      subject
    });

    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/results?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch results');
    }

    return data;
  }

  async uploadResults(professorId: string, resultsData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/results`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(resultsData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload results');
    }

    return data;
  }

  async updateResults(professorId: string, resultId: string, resultsData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/results/${resultId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(resultsData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update results');
    }

    return data;
  }

  // Communication APIs
  async getMyCommunications(professorId: string, page = 1, limit = 20, type = '', status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type,
      status
    });

    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/communications?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch communications');
    }

    return data;
  }

  async sendCommunication(professorId: string, communicationData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/communications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(communicationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send communication');
    }

    return data;
  }

  async replyToCommunication(professorId: string, communicationId: string, replyData: any) {
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/communications/${communicationId}/reply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(replyData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to reply to communication');
    }

    return data;
  }

  // Profile APIs
  async getMyProfile(professorId: string) {
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch profile');
    }

    return data;
  }

  async updateMyProfile(professorId: string, profileData: any) {
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update profile');
    }

    return data;
  }

  async getMySubjects(professorId: string) {
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}/subjects`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch subjects');
    }

    return data;
  }

  async getMyPerformance(professorId: string) {
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}/performance`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch performance');
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

  // Unified reply method using the unified communication API
  async replyToStudentDoubt(communicationId: string, replyContent: string, professorId: string) {
    console.log('=== PROFESSOR SERVICE - replyToStudentDoubt ===');
    console.log('Communication ID:', communicationId);
    console.log('Reply content:', replyContent);
    console.log('Professor ID:', professorId);
    
    const url = `${API_BASE_URL}/communications/${communicationId}/reply`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        content: replyContent,
        professorId: professorId
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to reply to student doubt');
    }

    return data;
  }

  // Exam Results APIs
  async getExamResults(professorId: string, page = 1, limit = 20, search = '', subject = '', examType = '') {
    console.log('=== PROFESSOR SERVICE - getExamResults ===');
    console.log('Professor ID:', professorId);
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Subject:', subject, 'Exam Type:', examType);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(subject && { subjectId: subject }),
      ...(examType && { examType })
    });

    const url = `${API_BASE_URL}/professor/${professorId}/results?${params}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch exam results');
    }

    return data;
  }

  async createStudentResult(professorId: string, studentResultData: any) {
    console.log('=== PROFESSOR SERVICE - createStudentResult ===');
    console.log('Professor ID:', professorId);
    console.log('Student result data:', studentResultData);
    
    const url = `${API_BASE_URL}/professor/${professorId}/results/student`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(studentResultData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to create student result');
    }

    return data;
  }

  async createExamResult(professorId: string, examResultData: any) {
    console.log('=== PROFESSOR SERVICE - createExamResult ===');
    console.log('Professor ID:', professorId);
    console.log('Exam result data:', examResultData);
    
    const url = `${API_BASE_URL}/professor/${professorId}/results`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(examResultData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to create exam result');
    }

    return data;
  }

  // Communication APIs
  async getCommunications(professorId: string, page = 1, limit = 20, search = '', status = '', priority = '') {
    console.log('=== PROFESSOR SERVICE - getCommunications ===');
    console.log('Professor ID:', professorId);
    console.log('Page:', page, 'Limit:', limit, 'Search:', search, 'Status:', status, 'Priority:', priority);
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority })
    });

    const url = `${API_BASE_URL}/professor/${professorId}/communications?${params}`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch communications');
    }

    return data;
  }

  // Unified Communication API - Get ALL student doubts/questions
  async getAllStudentDoubts(page = 1, limit = 20, search = '', status = '', priority = '', subject = '') {
    console.log('=== PROFESSOR SERVICE - getAllStudentDoubts ===');
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
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch student doubts');
    }

    return data;
  }

  // Get communication statistics
  async getCommunicationStatistics() {
    console.log('=== PROFESSOR SERVICE - getCommunicationStatistics ===');
    
    const url = `${API_BASE_URL}/communications/statistics`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch communication statistics');
    }

    return data;
  }

  async replyToCommunication(communicationId: string, replyData: any) {
    console.log('=== PROFESSOR SERVICE - replyToCommunication ===');
    console.log('Communication ID:', communicationId);
    console.log('Reply data:', replyData);
    
    const url = `${API_BASE_URL}/professor/communications/${communicationId}/reply`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(replyData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to send reply');
    }

    return data;
  }

  // Student Management APIs - Simplified like HOD
  async addStudent(studentData: any) {
    console.log('=== PROFESSOR SERVICE - addStudent ===');
    console.log('Student data:', studentData);
    
    const response = await fetch(`${API_BASE_URL}/professor/students`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to add student');
    }

    return data;
  }

  async getMyStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    subjectId?: string;
  }) {
    console.log('=== PROFESSOR SERVICE - getMyStudents ===');
    console.log('Params:', params);
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.subjectId) queryParams.append('subjectId', params.subjectId);

    const url = `${API_BASE_URL}/professor/students?${queryParams}`;
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch students');
    }

    return data;
  }

  async getProfessorSubjectsForClass(professorId: string) {
    console.log('=== PROFESSOR SERVICE - getProfessorSubjectsForClass ===');
    console.log('Professor ID:', professorId);
    
    const response = await fetch(`${API_BASE_URL}/professor/${professorId}/class/subjects`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch professor subjects');
    }

    return data;
  }

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
      headers: this.getAuthHeaders()
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

  // Student Attendance Taking APIs
  async getStudentsForAttendance(professorId: string) {
    console.log('=== PROFESSOR SERVICE - getStudentsForAttendance ===');
    console.log('Professor ID:', professorId);
    
    const url = `${API_BASE_URL}/professor/${professorId}/attendance/students/list`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch students for attendance');
    }

    return data;
  }

  async saveStudentAttendance(professorId: string, attendanceData: {
    date: string;
    attendance: Array<{ studentId: string; status: boolean }>;
    subjectId?: string; // Optional for daily attendance
  }) {
    console.log('=== PROFESSOR SERVICE - saveStudentAttendance ===');
    console.log('Professor ID:', professorId);
    console.log('Attendance data:', attendanceData);
    
    const url = `${API_BASE_URL}/professor/${professorId}/attendance/students/mark`;
    console.log('Request URL:', url);
    console.log('Request headers:', this.getAuthHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(attendanceData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to save student attendance');
    }

    return data;
  }
}

export const professorService = new ProfessorService();
