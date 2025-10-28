import { SidebarProvider, SidebarTrigger, AppSidebar, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@/shared/components";
import { Users, Calendar, TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/shared/constants";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    averageAttendance: 0,
    subjects: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.id) {
      fetchAttendanceData();
    }
  }, [user?.id, currentPage, searchQuery, selectedSubject]);

  // Real-time updates - refresh data every 30 seconds
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      console.log('=== REAL-TIME UPDATE: Refreshing attendance data ===');
      fetchAttendanceData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user?.id]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING STUDENT ATTENDANCE DATA ===');
      console.log('User ID:', user?.id);
      
      if (!user?.id) {
        console.log('No user ID, skipping fetchAttendanceData');
        return;
      }

      // Use student attendance card API to get current student's data
      const response = await studentService.getStudentAttendanceCard(user.id);
      console.log('Student attendance response:', response);
      
      if (response.data) {
        // Transform the data to match the expected format
        const studentData = response.data;
        setAttendanceData([studentData]); // Single student data
        setRecentAttendance([studentData]);
        
        // Calculate attendance summary from the student data
        const summary = {
          totalClasses: studentData.totalClasses || 100,
          attendedClasses: studentData.attended || 0,
          averageAttendance: studentData.attendancePercentage || 0,
          subjects: studentData.subjects || []
        };
        setAttendanceSummary(summary);
        console.log('Attendance summary calculated:', summary);
      } else {
        console.log('No student data found');
        setAttendanceData([]);
        setRecentAttendance([]);
        setAttendanceSummary({
          totalClasses: 0,
          attendedClasses: 0,
          averageAttendance: 0,
          subjects: []
        });
      }
      
      setTotalPages(1); // Single student, so only 1 page
    } catch (error: any) {
      console.error('Error fetching attendance data:', error);
      toast.error(error.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good": return "bg-green-100 text-green-800";
      case "average": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={STUDENT_NAV_ITEMS} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
                <p className="text-muted-foreground mt-2">Track your class attendance and performance</p>
              </div>
              <SidebarTrigger />
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceSummary.totalClasses}</div>
                  <p className="text-xs text-muted-foreground">All subjects combined</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attended Classes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceSummary.attendedClasses}</div>
                  <p className="text-xs text-muted-foreground">Classes attended</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getAttendanceColor(attendanceSummary.averageAttendance)}`}>
                    {attendanceSummary.averageAttendance.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search attendance records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {attendanceSummary.subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchAttendanceData}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>


            {/* Student Attendance Card */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading attendance data...</p>
              </div>
            ) : attendanceData.length > 0 ? (
              <div className="grid gap-6">
                {attendanceData.map((student: any, index: number) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{student.name || 'Student'}</h3>
                          <p className="text-muted-foreground">Roll No: {student.rollNo || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">ID: {student.id || student.studentId || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getAttendanceColor(student.attendancePercentage || 0)}`}>
                          {(student.attendancePercentage || 0).toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Attendance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Classes</p>
                            <p className="text-2xl font-bold text-foreground">{student.totalClasses || 100}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Present Days</p>
                            <p className="text-2xl font-bold text-foreground">{student.attended || 0}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Absent Days</p>
                            <p className="text-2xl font-bold text-foreground">{(student.totalClasses || 100) - (student.attended || 0)}</p>
                          </div>
                          <TrendingDown className="h-8 w-8 text-red-600" />
                        </div>
                      </div>
                    </div>

                    {/* Subject-wise Attendance */}
                    {student.subjects && student.subjects.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-4">Subject-wise Attendance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {student.subjects.map((subject: any, subIndex: number) => (
                            <div key={subIndex} className="bg-muted/20 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-foreground">{subject.subjectName || subject.name || 'Subject'}</h5>
                                <Badge className={getStatusColor(subject.attendance >= 75 ? 'Good' : 'Poor')}>
                                  {subject.attendance?.toFixed(1) || 0}%
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Attended: {subject.attended || 0}</span>
                                <span>Total: {subject.total || 0}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Attendance Data</h3>
                  <p className="text-muted-foreground">No attendance records found for this student</p>
                </div>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentAttendance;