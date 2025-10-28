import { SidebarProvider, SidebarTrigger, AppSidebar, DashboardCard, Button, Avatar, AvatarFallback, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { BookOpen, Users, CheckCircle, Clock, FileText, TrendingUp, User, LogOut, Settings, RefreshCw, Info, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { useState, useEffect } from "react";
import { toast } from "sonner";


const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { user, professor, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalChapters: 0,
    completedChapters: 0,
    pendingChapters: 0,
    activeAssignments: 0
  });

  useEffect(() => {
    console.log('Professor Dashboard - user data:', user);
    if (user?.id) {
      console.log('Professor Dashboard - fetching data for user ID:', user.id);
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data from /api/auth/me
      const userResponse = await professorService.getCurrentUser();
      setUserData(userResponse.data?.user || null);
      
      const statsResponse = await professorService.getDashboardStats();

      // Set stats with proper default values (matching backend response)
      setStats({
        totalClasses: statsResponse.data?.totalClasses || 0,
        totalChapters: statsResponse.data?.chapters || 0,
        completedChapters: statsResponse.data?.completed || 0,
        pendingChapters: statsResponse.data?.pending || 0,
        activeAssignments: statsResponse.data?.assignments || 0
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({
        totalClasses: 0,
        totalChapters: 0,
        completedChapters: 0,
        pendingChapters: 0,
        activeAssignments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error('Logout failed:', error);
      navigate("/");
    }
  };

  const handleProfile = () => {
    // Add profile logic here
    console.log("Profile clicked");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="professor" items={PROFESSOR_NAV_ITEMS} />
        
        <main className="flex-1">
          <header className="h-16 border-b border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/40 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 hover:bg-accent/50 transition-colors duration-200" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Professor Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Teaching & Class Management</p>
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
                  <Button variant="ghost" size="sm" className="hover:bg-accent/50 transition-colors duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile?.avatar} alt="Professor" />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user?.profile ? getInitials(user.profile.firstName, user.profile.lastName) : 'P'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Professor'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="p-6 space-y-8">
            {/* User Info and Instructions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Professor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : userData ? (
                    <div className="space-y-4">
                      {/* Profile Section */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={userData.profile?.avatar || "/placeholder.svg"} alt="Professor" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {userData.profile?.fullName?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{userData.profile?.fullName || 'Professor'}</h3>
                          <p className="text-sm text-muted-foreground">Professor</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userData.email || 'No email'}</span>
                        </div>
                        
                        {userData.profile?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{userData.profile.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Joined: {new Date(userData.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            Status: {userData.status || 'Active'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Academic Info */}
                      <div className="pt-3 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Teaching Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <p className="text-lg font-bold text-blue-600">{stats.totalClasses}</p>
                            <p className="text-xs text-muted-foreground">Classes</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                            <p className="text-lg font-bold text-green-600">{stats.totalChapters}</p>
                            <p className="text-xs text-muted-foreground">Chapters</p>
                          </div>
                        </div>
                        <div className="mt-2 text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                          <p className="text-lg font-bold text-purple-600">{stats.activeAssignments}</p>
                          <p className="text-xs text-muted-foreground">Active Assignments</p>
                        </div>
                      </div>
                      
                      {/* Recent Activity */}
                      <div className="pt-3 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Recent Activity</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Last login: Today</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>Profile updated: 2 days ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <span>Last class: 1 day ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No user data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Professor Panel Instructions Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Professor Panel Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Navigation Guide */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">Navigation Guide</h4>
                      
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">Dashboard</h5>
                          <p className="text-xs text-muted-foreground">View personal info, teaching stats, and panel guide</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">Attendance</h5>
                          <p className="text-xs text-muted-foreground">Take student attendance and view records</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">Materials</h5>
                          <p className="text-xs text-muted-foreground">Upload and manage course materials</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">Results</h5>
                          <p className="text-xs text-muted-foreground">Add exam results and view student performance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-cyan-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">Communication</h5>
                          <p className="text-xs text-muted-foreground">Reply to student questions and doubts</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Tips */}
                    <div className="pt-3 border-t">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Quick Tips</h4>
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                          <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                            💡 <strong>Real-time Updates:</strong> All data syncs automatically
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                          <p className="text-xs font-medium text-green-800 dark:text-green-200">
                            📱 <strong>Mobile Access:</strong> Works on all devices
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                          <p className="text-xs font-medium text-purple-800 dark:text-purple-200">
                            🔄 <strong>Refresh:</strong> Use refresh button for manual updates
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* System Status */}
                    <div className="pt-3 border-t">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">System Status</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Server Status</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Last Sync</span>
                          <span className="text-muted-foreground">Just now</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Data Version</span>
                          <span className="text-muted-foreground">v2.1.0</span>
                        </div>
                      </div>
                    </div>
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

export default ProfessorDashboard;