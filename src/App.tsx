import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import HODDashboard from "./pages/hod/HODDashboard";
import HODAttendance from "./pages/hod/HODAttendance";
import HODProfessors from "./pages/hod/HODProfessors";
import HODResults from "./pages/hod/HODResults";
import HODNotices from "./pages/hod/HODNotices";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import ProfessorAttendance from "./pages/professor/ProfessorAttendance";
import ProfessorStudents from "./pages/professor/ProfessorStudents";
import ProfessorMaterials from "./pages/professor/ProfessorMaterials";
import ProfessorAssignments from "./pages/professor/ProfessorAssignments";
import ProfessorResults from "./pages/professor/ProfessorResults";
import ProfessorCommunication from "./pages/professor/ProfessorCommunication";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentCommunication from "./pages/student/StudentCommunication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/hod" element={<HODDashboard />} />
          <Route path="/hod/attendance" element={<HODAttendance />} />
          <Route path="/hod/professors" element={<HODProfessors />} />
          <Route path="/hod/results" element={<HODResults />} />
          <Route path="/hod/notices" element={<HODNotices />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/professor/attendance" element={<ProfessorAttendance />} />
          <Route path="/professor/students" element={<ProfessorStudents />} />
          <Route path="/professor/materials" element={<ProfessorMaterials />} />
          <Route path="/professor/assignments" element={<ProfessorAssignments />} />
          <Route path="/professor/results" element={<ProfessorResults />} />
          <Route path="/professor/communication" element={<ProfessorCommunication />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/communication" element={<StudentCommunication />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
