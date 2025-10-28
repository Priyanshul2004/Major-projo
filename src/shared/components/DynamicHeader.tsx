import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DynamicHeaderProps {
  role: "hod" | "professor" | "student";
}

const DynamicHeader = ({ role }: DynamicHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data/session here if needed
    // For now, just redirect to home page
    navigate("/");
  };

  const handleProfile = () => {
    // Add profile logic here
    console.log("Profile clicked");
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    // HOD routes
    if (role === "hod") {
      switch (path) {
        case "/hod":
          return "HOD Dashboard";
        case "/hod/professors":
          return "Professor Management";
        case "/hod/attendance":
          return "Attendance Management";
        case "/hod/results":
          return "Exam Result Reports";
        case "/hod/notices":
          return "Notice Management";
        default:
          return "HOD Dashboard";
      }
    }
    
    // Professor routes
    if (role === "professor") {
      switch (path) {
        case "/professor":
          return "Professor Dashboard";
        case "/professor/attendance":
          return "Attendance Management";
        case "/professor/classes":
        case "/professor/students":
          return "Student Management";
        case "/professor/materials":
          return "Study Materials";
        case "/professor/results":
          return "Exam Results";
        case "/professor/communication":
          return "Communication";
        case "/professor/notices":
          return "Notices";
        default:
          return "Professor Dashboard";
      }
    }
    
    // Student routes
    if (role === "student") {
      switch (path) {
        case "/student":
          return "Student Dashboard";
        case "/student/subjects":
        case "/student/materials":
          return "Study Materials";
        case "/student/assignments":
          return "Assignments";
        case "/student/attendance":
          return "Attendance";
        case "/student/results":
          return "Exam Results";
        case "/student/communication":
          return "Communication";
        case "/student/notices":
          return "Notices";
        default:
          return "Student Dashboard";
      }
    }
    
    return "Dashboard";
  };

  // Get page description based on current route
  const getPageDescription = () => {
    const path = location.pathname;
    
    if (role === "hod") {
      switch (path) {
        case "/hod":
          return "Institutional Overview & Management";
        case "/hod/professors":
          return "Manage Faculty & Staff";
        case "/hod/attendance":
          return "Track Student & Professor Attendance";
        case "/hod/results":
          return "View & Analyze Exam Results";
        case "/hod/notices":
          return "Create & Manage Notices";
        default:
          return "Institutional Overview & Management";
      }
    }
    
    if (role === "professor") {
      switch (path) {
        case "/professor":
          return "Teaching & Class Management";
        case "/professor/attendance":
          return "Track Student Attendance";
        case "/professor/classes":
        case "/professor/students":
          return "Manage Your Students";
        case "/professor/materials":
          return "Upload & Manage Study Materials";
        case "/professor/results":
          return "View & Manage Exam Results";
        case "/professor/communication":
          return "Communicate with Students";
        case "/professor/notices":
          return "View & Create Notices";
        default:
          return "Teaching & Class Management";
      }
    }
    
    if (role === "student") {
      switch (path) {
        case "/student":
          return "Academic Progress & Information";
        case "/student/subjects":
        case "/student/materials":
          return "Access Study Materials";
        case "/student/assignments":
          return "View & Submit Assignments";
        case "/student/attendance":
          return "Check Your Attendance";
        case "/student/results":
          return "View Your Exam Results";
        case "/student/communication":
          return "Communicate with Faculty";
        case "/student/notices":
          return "View Important Notices";
        default:
          return "Academic Progress & Information";
      }
    }
    
    return "Dashboard";
  };

  return (
    <header className="h-16 border-b border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/40 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4 hover:bg-accent/50 transition-colors duration-200" />
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-muted-foreground">{getPageDescription()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleProfile}
          className="hover:bg-accent/50 transition-colors duration-200"
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback>
                  {role === "hod" ? "HOD" : role === "professor" ? "PROF" : "STU"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {role === "hod" ? "HOD" : role === "professor" ? "Professor" : "Student"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {role === "hod" ? "hod@college.edu" : role === "professor" ? "prof@college.edu" : "student@college.edu"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DynamicHeader;
