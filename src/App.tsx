import { TooltipProvider, NotFound } from "@/shared/components";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Auth from "./features/auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { Landing } from "./features/landing";
import {
  HODDashboard,
  HODAttendance,
  HODStudents,
  HODProfessors,
  HODResults,
  HODNotices,
  ProfessorDashboard,
  ProfessorAttendance,
  ProfessorStudents,
  ProfessorMaterials,
  ProfessorResults,
  ProfessorCommunication,
  ProfessorNotices,
  StudentDashboard,
  StudentMaterials,
  StudentAttendance,
  StudentCommunication,
  StudentResults,
  StudentNotices,
} from "./features/dashboard";
import HODDashboardSimple from "./features/dashboard/hod/HODDashboardSimple";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* HOD Routes */}
            <Route 
              path="/hod" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/attendance" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODAttendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/students" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/professors" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODProfessors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/results" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/notices" 
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODNotices />
                </ProtectedRoute>
              } 
            />
            
            {/* Professor Routes */}
            <Route 
              path="/professor" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/attendance" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorAttendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/classes" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/students" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/materials" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorMaterials />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/results" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/communication" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorCommunication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professor/notices" 
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorNotices />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/subjects" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentMaterials />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/materials" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentMaterials />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/attendance" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAttendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/results" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/communication" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentCommunication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/notices" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentNotices />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
