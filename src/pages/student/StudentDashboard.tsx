import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardCard from "@/components/DashboardCard";
import { BookOpen, FileText, CheckCircle, Clock, TrendingUp, MessageSquare } from "lucide-react";

const studentNavItems = [
  { title: "Dashboard", url: "/student", icon: TrendingUp },
  { title: "Subjects", url: "/student/subjects", icon: BookOpen },
  { title: "Assignments", url: "/student/assignments", icon: FileText },
  { title: "Attendance", url: "/student/attendance", icon: CheckCircle },
  { title: "Results", url: "/student/results", icon: TrendingUp },
  { title: "Communication", url: "/student/communication", icon: MessageSquare },
];

const StudentDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="student" items={studentNavItems} />
        
        <main className="flex-1">
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">Your Academic Journey</p>
            </div>
          </header>

          <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Subjects"
                value="6"
                icon={BookOpen}
                description="Enrolled courses"
                color="blue"
              />
              <DashboardCard
                title="Assignments"
                value="12"
                icon={FileText}
                description="Total assignments"
                color="green"
              />
              <DashboardCard
                title="Completed"
                value="8"
                icon={CheckCircle}
                description="Finished tasks"
                color="purple"
              />
              <DashboardCard
                title="Attendance"
                value="87%"
                icon={TrendingUp}
                description="Overall attendance"
                color="orange"
              />
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Upcoming Assignments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Mathematics Homework</span>
                      <p className="text-xs text-muted-foreground">Chapter 5 - Calculus</p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">Due: 2 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Physics Lab Report</span>
                      <p className="text-xs text-muted-foreground">Experiment 3</p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">Due: 5 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Chemistry Project</span>
                      <p className="text-xs text-muted-foreground">Organic compounds</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Due: 1 week</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Subject Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematics</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-blue h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Physics</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-green h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Chemistry</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-purple h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice Board & Announcements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Notice Board</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border-l-4 border-educational-blue rounded">
                    <p className="text-sm font-medium">Exam Schedule Released</p>
                    <p className="text-xs text-muted-foreground mt-1">Final exams start from next month</p>
                  </div>
                  <div className="p-3 bg-green-50 border-l-4 border-educational-green rounded">
                    <p className="text-sm font-medium">Holiday Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">College closed on Friday</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Announcements</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 border-l-4 border-educational-purple rounded">
                    <p className="text-sm font-medium">Prof. Smith - Mathematics</p>
                    <p className="text-xs text-muted-foreground mt-1">Extra class scheduled for tomorrow</p>
                  </div>
                  <div className="p-3 bg-orange-50 border-l-4 border-educational-orange rounded">
                    <p className="text-sm font-medium">Prof. Johnson - Physics</p>
                    <p className="text-xs text-muted-foreground mt-1">Lab equipment demonstration next week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;