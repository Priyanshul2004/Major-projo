import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardCard from "@/components/DashboardCard";
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, MessageSquare } from "lucide-react";

const hodNavItems = [
  { title: "Dashboard", url: "/hod", icon: TrendingUp },
  { title: "Professors", url: "/hod/professors", icon: Users },
  { title: "Students", url: "/hod/students", icon: GraduationCap },
  { title: "Attendance", url: "/hod/attendance", icon: Calendar },
  { title: "Exam Results", url: "/hod/results", icon: BookOpen },
  { title: "Notices", url: "/hod/notices", icon: MessageSquare },
];

const HODDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="hod" items={hodNavItems} />
        
        <main className="flex-1">
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">HOD Dashboard</h1>
              <p className="text-sm text-muted-foreground">Institutional Overview & Management</p>
            </div>
          </header>

          <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Professors"
                value="24"
                icon={Users}
                description="Active teaching staff"
                color="blue"
              />
              <DashboardCard
                title="Total Students"
                value="342"
                icon={GraduationCap}
                description="Enrolled students"
                color="green"
              />
              <DashboardCard
                title="Subjects"
                value="18"
                icon={BookOpen}
                description="Active courses"
                color="purple"
              />
              <DashboardCard
                title="Pass Rate"
                value="92%"
                icon={TrendingUp}
                description="Overall performance"
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Professor Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <span className="text-sm">Dr. Smith - Uploaded new material</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <span className="text-sm">Prof. Johnson - Marked attendance</span>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <span className="text-sm">Dr. Wilson - Created assignment</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Attendance Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Student Attendance</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-green h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Professor Attendance</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-blue h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
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

export default HODDashboard;