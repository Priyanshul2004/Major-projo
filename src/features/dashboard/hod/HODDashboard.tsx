import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, AppSidebar, DashboardCard, DynamicHeader, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback, Button } from "@/shared/components";
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, MessageSquare } from "lucide-react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";


interface DashboardStats {
  totalProfessors: number;
  totalStudents: number;
  totalSubjects: number;
}

interface Student {
  id: string;
  name: string;
  course: string;
  year: string;
  status: string;
  avatar: string;
  rollNo: string;
}

interface Professor {
  id: string;
  name: string;
  subject: string;
  status: string;
  avatar: string;
  rating: number;
}

const HODDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProfessors: 0,
    totalStudents: 0,
    totalSubjects: 0
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await hodService.getDashboardStats();
      if (statsResponse && statsResponse.data) {
        setStats({
          totalProfessors: statsResponse.data.totalProfessors || 0,
          totalStudents: statsResponse.data.totalStudents || 0,
          totalSubjects: statsResponse.data.totalSubjects || 0
        });
      }

      // Fetch dashboard overview (students and professors)
      const overviewResponse = await hodService.getDashboardOverview();
      if (overviewResponse && overviewResponse.data) {
        setStudents(Array.isArray(overviewResponse.data.allStudents) ? overviewResponse.data.allStudents : []);
        setProfessors(Array.isArray(overviewResponse.data.allProfessors) ? overviewResponse.data.allProfessors : []);
      }
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({ totalProfessors: 0, totalStudents: 0, totalSubjects: 0 });
      setStudents([]);
      setProfessors([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewAllStudents = () => {
    navigate('/hod/students');
  };

  const handleViewAllProfessors = () => {
    navigate('/hod/professors');
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
          <main className="flex-1">
            <DynamicHeader role="hod" />
            <div className="p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
        
        <main className="flex-1">
          <DynamicHeader role="hod" />

          <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="Total Professors"
                value={stats.totalProfessors.toString()}
                icon={Users}
                description="Active teaching staff"
                color="blue"
              />
              <DashboardCard
                title="Total Students"
                value={stats.totalStudents.toString()}
                icon={GraduationCap}
                description="Enrolled students"
                color="green"
              />
              <DashboardCard
                title="Subjects"
                value={stats.totalSubjects.toString()}
                icon={BookOpen}
                description="Active courses"
                color="purple"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    All Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg backdrop-blur-sm border border-border/30">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                {getInitials(student.name || 'Unknown')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student.name || 'Unknown Student'}</p>
                              <p className="text-xs text-muted-foreground">{student.course || 'N/A'} - {student.year || 'N/A'}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(student.status || 'unknown')}>
                            {student.status || 'Unknown'}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No students found</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleViewAllStudents}
                    >
                      View All Students
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    All Professors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {professors.length > 0 ? (
                      professors.map((professor) => (
                        <div key={professor.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg backdrop-blur-sm border border-border/30">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                                {getInitials(professor.name || 'Unknown')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{professor.name || 'Unknown Professor'}</p>
                              <p className="text-xs text-muted-foreground">{professor.subject || 'N/A'}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(professor.status || 'unknown')}>
                            {professor.status || 'Unknown'}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No professors found</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleViewAllProfessors}
                    >
                      View All Professors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODDashboard;