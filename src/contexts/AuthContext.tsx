import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, Student, Professor, HOD } from '../services/authService';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  professor: Professor | null;
  hod: HOD | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  studentSignup: (userData: any) => Promise<void>;
  professorSignup: (userData: any) => Promise<void>;
  hodSignup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [hod, setHod] = useState<HOD | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getUser();
          const currentStudent = authService.getStudent();
          const currentProfessor = authService.getProfessor();
          const currentHOD = authService.getHOD();

          setUser(currentUser);
          setStudent(currentStudent);
          setProfessor(currentProfessor);
          setHod(currentHOD);
          setIsAuthenticated(true);

          // Verify token with server
          try {
            await authService.getCurrentUser();
          } catch (error) {
            // Token is invalid, clear auth state
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      setUser(response.data.user);
      setStudent(response.data.student || null);
      setProfessor(response.data.professor || null);
      setHod(response.data.hod || null);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const studentSignup = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authService.studentSignup(userData);
      
      setUser(response.data.user);
      setStudent(response.data.student || null);
      setProfessor(null);
      setHod(null);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const professorSignup = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authService.professorSignup(userData);
      
      setUser(response.data.user);
      setStudent(null);
      setProfessor(response.data.professor || null);
      setHod(null);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hodSignup = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authService.hodSignup(userData);
      
      setUser(response.data.user);
      setStudent(null);
      setProfessor(null);
      setHod(response.data.hod || null);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        console.log('Logout successful:', result.message);
      } else {
        console.warn('Logout warning:', result.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear the auth state regardless of API response
      setUser(null);
      setStudent(null);
      setProfessor(null);
      setHod(null);
      setIsAuthenticated(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
      setStudent(response.data.student || null);
      setProfessor(response.data.professor || null);
      setHod(response.data.hod || null);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    student,
    professor,
    hod,
    isAuthenticated,
    isLoading,
    login,
    studentSignup,
    professorSignup,
    hodSignup,
    logout,
    changePassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
