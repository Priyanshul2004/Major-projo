const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  role: 'student' | 'professor' | 'hod';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
}

export interface Student {
  id: string;
  rollNumber: string;
  academicInfo: {
    currentYear: string;
    semester: number;
    specialization: string;
  };
  subjects: Array<{
    subjectId: {
      _id: string;
      subjectName: string;
      subjectCode: string;
    };
  }>;
}

export interface Professor {
  id: string;
  employeeId: string;
  qualification: string;
  experience: number;
  department: string;
  subjects: Array<{
    subjectId: {
      _id: string;
      subjectName: string;
      subjectCode: string;
    };
  }>;
}

export interface HOD {
  id: string;
  employeeId: string;
  qualification: string;
  experience: number;
  department: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
    student?: Student;
    professor?: Professor;
    hod?: HOD;
  };
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface StudentSignupRequest {
  rollNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  academicYear: string;
  semester: number;
  specialization: string;
}

export interface ProfessorSignupRequest {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  qualification: string;
  experience: number;
  department: string;
}

export interface HODSignupRequest {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  qualification?: string;
  experience?: number;
  department?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('role', data.data.user.role);
      
      // Store role-specific data
      if (data.data.student) {
        localStorage.setItem('student', JSON.stringify(data.data.student));
      }
      if (data.data.professor) {
        localStorage.setItem('professor', JSON.stringify(data.data.professor));
      }
      if (data.data.hod) {
        localStorage.setItem('hod', JSON.stringify(data.data.hod));
      }
    }

    return data;
  }

  async studentSignup(userData: StudentSignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/student/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Student signup failed');
    }

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('role', data.data.user.role);
      localStorage.setItem('student', JSON.stringify(data.data.student));
    }

    return data;
  }

  async professorSignup(userData: ProfessorSignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/professor/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Professor signup failed');
    }

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('role', data.data.user.role);
      localStorage.setItem('professor', JSON.stringify(data.data.professor));
    }

    return data;
  }

  async hodSignup(userData: HODSignupRequest): Promise<AuthResponse> {
    console.log('authService.hodSignup - Sending data:', userData);
    console.log('authService.hodSignup - JSON stringified:', JSON.stringify(userData));
    
    const response = await fetch(`${API_BASE_URL}/auth/hod/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'HOD signup failed');
    }

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('role', data.data.user.role);
      localStorage.setItem('hod', JSON.stringify(data.data.hod));
    }

    return data;
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get user data');
    }

    return data;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to change password');
    }

    return data;
  }

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
      // Even if API call fails, we should still clear local storage
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getStudent(): Student | null {
    const studentStr = localStorage.getItem('student');
    return studentStr ? JSON.parse(studentStr) : null;
  }

  getProfessor(): Professor | null {
    const professorStr = localStorage.getItem('professor');
    return professorStr ? JSON.parse(professorStr) : null;
  }

  getHOD(): HOD | null {
    const hodStr = localStorage.getItem('hod');
    return hodStr ? JSON.parse(hodStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDashboardPath(): string {
    const role = this.getRole();
    switch (role) {
      case 'student':
        return '/student';
      case 'professor':
        return '/professor';
      case 'hod':
        return '/hod';
      default:
        return '/';
    }
  }
}

export const authService = new AuthService();
