import { BookOpen, Users, GraduationCap, TrendingUp, CheckCircle, MessageSquare, FileText, Calendar } from "lucide-react";

export const ROLE_OPTIONS = [
  { value: "student", label: "Student", icon: BookOpen, path: "/student" },
  { value: "professor", label: "Professor", icon: Users, path: "/professor" },
  { value: "hod", label: "HOD/Director", icon: GraduationCap, path: "/hod" }
];

export const STUDENT_NAV_ITEMS = [
  { title: "Dashboard", url: "/student", icon: TrendingUp },
  { title: "Study Materials", url: "/student/materials", icon: BookOpen },
  { title: "Attendance", url: "/student/attendance", icon: CheckCircle },
  { title: "Results", url: "/student/results", icon: TrendingUp },
  { title: "Communication", url: "/student/communication", icon: MessageSquare },
  { title: "Notices", url: "/student/notices", icon: Calendar },
];

export const PROFESSOR_NAV_ITEMS = [
  { title: "Dashboard", url: "/professor", icon: TrendingUp },
  { title: "Attendance", url: "/professor/attendance", icon: CheckCircle },
  { title: "Students", url: "/professor/students", icon: Users },
  { title: "Materials", url: "/professor/materials", icon: FileText },
  { title: "Results", url: "/professor/results", icon: TrendingUp },
  { title: "Communication", url: "/professor/communication", icon: MessageSquare },
  { title: "Notices", url: "/professor/notices", icon: Calendar },
];

export const HOD_NAV_ITEMS = [
  { title: "Dashboard", url: "/hod", icon: TrendingUp },
  { title: "Professors", url: "/hod/professors", icon: Users },
  { title: "Attendance", url: "/hod/attendance", icon: Calendar },
  { title: "Exam Results", url: "/hod/results", icon: BookOpen },
  { title: "Notices", url: "/hod/notices", icon: MessageSquare },
];

export const ROLE_LABELS = {
  hod: "HOD Panel",
  professor: "Professor Panel", 
  student: "Student Panel"
};

export const ROLE_ICONS = {
  hod: "👨‍💼",
  professor: "👨‍🏫", 
  student: "🎓"
};
