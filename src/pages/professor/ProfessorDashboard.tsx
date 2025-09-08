import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardCard from "@/components/DashboardCard";
import { BookOpen, Users, CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";

const professorNavItems = [
  { title: "Dashboard", url: "/professor", icon: TrendingUp },
  { title: "Attendance", url: "/professor/attendance", icon: CheckCircle },
  { title: "Classes", url: "/professor/classes", icon: Users },
  { title: "Materials", url: "/professor/materials", icon: FileText },
  { title: "Assignments", url: "/professor/assignments", icon: BookOpen },
  { title: "Results", url: "/professor/results", icon: TrendingUp },
];

const ProfessorDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="professor" items={professorNavItems} />
        
        <main className="flex-1">
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Professor Dashboard</h1>
              <p className="text-sm text-muted-foreground">Teaching & Class Management</p>
            </div>
          </header>

          <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <DashboardCard
                title="Total Classes"
                value="6"
                icon={Users}
                description="Active classes"
                color="blue"
              />
              <DashboardCard
                title="Chapters"
                value="45"
                icon={BookOpen}
                description="Total content"
                color="green"
              />
              <DashboardCard
                title="Completed"
                value="32"
                icon={CheckCircle}
                description="Finished chapters"
                color="purple"
              />
              <DashboardCard
                title="Pending"
                value="13"
                icon={Clock}
                description="Remaining work"
                color="orange"
              />
              <DashboardCard
                title="Assignments"
                value="8"
                icon={FileText}
                description="Active assignments"
                color="blue"
              />
            </div>

            {/* Content Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Today's Classes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Mathematics</span>
                      <p className="text-xs text-muted-foreground">Class A - Room 101</p>
                    </div>
                    <span className="text-xs text-muted-foreground">9:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Physics</span>
                      <p className="text-xs text-muted-foreground">Class B - Room 203</p>
                    </div>
                    <span className="text-xs text-muted-foreground">11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                    <div>
                      <span className="text-sm font-medium">Chemistry</span>
                      <p className="text-xs text-muted-foreground">Class C - Lab 1</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-soft">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Exam Results Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematics - Pass Rate</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-green h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Physics - Pass Rate</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-blue h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Chemistry - Pass Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-educational-purple h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card p-6 rounded-lg border shadow-soft">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Study Materials</h4>
                  <p className="text-xs text-muted-foreground">Uploaded 3 new documents for Mathematics</p>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Assignments</h4>
                  <p className="text-xs text-muted-foreground">Created homework assignment for Physics</p>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Communication</h4>
                  <p className="text-xs text-muted-foreground">Replied to 5 student questions</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorDashboard;