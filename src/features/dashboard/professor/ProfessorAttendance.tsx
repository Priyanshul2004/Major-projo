import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Users, GraduationCap, Search, RefreshCw, AlertCircle, UserCheck, UserX, Save, Calendar } from "lucide-react";
import { toast } from "sonner";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";

const ProfessorAttendance = () => {
  const { user } = useAuth();
  console.log('=== PROFESSOR ATTENDANCE COMPONENT LOADED ===');
  console.log('User object:', user);
  console.log('User ID:', user?.id);
  console.log('User role:', user?.role);
  console.log('Component timestamp:', new Date().toISOString());
  
  const [loading, setLoading] = useState({
    students: true,
    summary: true,
    subjects: true,
    studentsForAttendance: false,
    saving: false
  });
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [studentsForAttendance, setStudentsForAttendance] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedSubjectForAttendance, setSelectedSubjectForAttendance] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });


  // Fetch data functions
  const fetchStudentAttendance = async () => {
    console.log('=== FETCH STUDENT ATTENDANCE CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Filters:', filters);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchStudentAttendance');
      return;
    }
    
    try {
      console.log('Setting loading state to true for students');
      setLoading(prev => ({ ...prev, students: true }));
      
      console.log('Calling professorService.getStudentAttendance...');
      const response = await professorService.getStudentAttendance({
        ...filters,
        professorId: user?.id
      });
      console.log('Student attendance response:', response);
      
      setStudentAttendance(response.data);
      setPagination(response.pagination);
      console.log('Student attendance data set successfully');
    } catch (error) {
      console.error('=== ERROR FETCHING STUDENT ATTENDANCE ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error('Failed to fetch student attendance');
    } finally {
      console.log('Setting loading state to false for students');
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchAttendanceSummary = async () => {
    console.log('=== FETCH ATTENDANCE SUMMARY CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Subject ID filter:', filters.subjectId);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchAttendanceSummary');
      return;
    }
    
    try {
      console.log('Setting loading state to true for summary');
      setLoading(prev => ({ ...prev, summary: true }));
      
      console.log('Calling professorService.getAttendanceSummary...');
      const response = await professorService.getAttendanceSummary(filters.subjectId, user?.id);
      console.log('Attendance summary response:', response);
      
      setAttendanceSummary(response.data);
      console.log('Attendance summary data set successfully');
    } catch (error) {
      console.error('=== ERROR FETCHING ATTENDANCE SUMMARY ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error('Failed to fetch attendance summary');
    } finally {
      console.log('Setting loading state to false for summary');
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const fetchSubjects = async () => {
    console.log('=== FETCH SUBJECTS CALLED ===');
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchSubjects');
      return;
    }
    
    try {
      console.log('Setting loading state to true for subjects');
      setLoading(prev => ({ ...prev, subjects: true }));
      
      console.log('Calling professorService.getProfessorSubjects...');
      const response = await professorService.getProfessorSubjects(user?.id);
      console.log('Subjects response:', response);
      
      setSubjects(response.data);
      console.log('Subjects data set successfully');
    } catch (error) {
      console.error('=== ERROR FETCHING SUBJECTS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error('Failed to fetch subjects');
    } finally {
      console.log('Setting loading state to false for subjects');
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    console.log('useEffect - fetchStudentAttendance triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchStudentAttendance();
    }
  }, [user?.id, filters]);

  useEffect(() => {
    console.log('useEffect - fetchAttendanceSummary triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchAttendanceSummary();
    }
  }, [user?.id, filters.subjectId]);

  useEffect(() => {
    console.log('useEffect - fetchSubjects triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchSubjects();
    }
  }, [user?.id]);

  // Auto-fetch students for daily attendance (no subject required)
  useEffect(() => {
    console.log('useEffect - fetchStudentsForAttendance triggered');
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('User role:', user?.role);
    
    if (user?.id) {
      console.log('Conditions met, calling fetchStudentsForAttendance for daily attendance');
      fetchStudentsForAttendance();
    } else {
      console.log('Conditions not met:');
      console.log('- User ID exists:', !!user?.id);
    }
  }, [user?.id]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleSubjectChange = (value: string) => {
    setFilters(prev => ({ ...prev, subjectId: value === "all" ? "" : value, page: 1 }));
  };

  const handleRefresh = () => {
    fetchStudentAttendance();
    fetchAttendanceSummary();
  };

  // Fetch students for attendance taking
  const fetchStudentsForAttendance = async () => {
    console.log('=== FETCH STUDENTS FOR ATTENDANCE CALLED ===');
    console.log('User object:', user);
    console.log('User ID:', user?.id);
    console.log('Selected subject:', selectedSubjectForAttendance);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchStudentsForAttendance');
      toast.error('User not authenticated');
      return;
    }

    // No subject selection required for daily attendance
    
    try {
      console.log('Setting loading state to true for studentsForAttendance');
      setLoading(prev => ({ ...prev, studentsForAttendance: true }));
      
      console.log('Calling professorService.getStudentsForAttendance with user ID:', user.id);
      const response = await professorService.getStudentsForAttendance(user.id);
      console.log('Students for attendance response:', response);
      
      if (response && response.data) {
        setStudentsForAttendance(response.data);
        console.log('Students for attendance data set successfully, count:', response.data.length);
        toast.success(`Loaded ${response.data.length} students for attendance`);
      } else {
        console.log('No data in response');
        setStudentsForAttendance([]);
        toast.warning('No students found for attendance');
      }
    } catch (error) {
      console.error('=== ERROR FETCHING STUDENTS FOR ATTENDANCE ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(`Failed to fetch students: ${error.message}`);
      setStudentsForAttendance([]);
    } finally {
      console.log('Setting loading state to false for studentsForAttendance');
      setLoading(prev => ({ ...prev, studentsForAttendance: false }));
    }
  };

  // Handle attendance change
  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: present
    }));
  };

  // Save student attendance
  const handleSaveAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, saving: true }));
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));
      
      // For daily attendance, don't send subjectId
      await professorService.saveStudentAttendance(user?.id, {
        date: new Date().toISOString().split('T')[0],
        attendance: attendanceData
        // No subjectId for daily attendance
      });
      
      toast.success('Daily attendance saved successfully!');
      setAttendance({});
      fetchStudentAttendance(); // Refresh student attendance data
      fetchAttendanceSummary(); // Refresh summary
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast.error(error.message || 'Failed to save attendance');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={PROFESSOR_NAV_ITEMS} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <Tabs defaultValue="students" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Student Attendance</TabsTrigger>
                <TabsTrigger value="summary">Attendance Summary</TabsTrigger>
                <TabsTrigger value="take-attendance">Take Attendance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Student Attendance Overview
                    </CardTitle>
                    <div className="flex gap-4 mt-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Search by name or roll number..."
                          value={filters.search}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Select value={filters.subjectId || "all"} onValueChange={handleSubjectChange}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading.students ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Loading student attendance...
                      </div>
                    ) : studentAttendance.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>No student attendance data found</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Total Classes</TableHead>
                            <TableHead>Present Days</TableHead>
                            <TableHead>Attendance %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentAttendance.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.rollNo}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.totalClasses}</TableCell>
                              <TableCell>{student.attended}</TableCell>
                              <TableCell className={getAttendanceColor(student.percentage)}>
                                {student.percentage}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loading.summary ? (
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        ) : (
                          attendanceSummary?.totalStudents || 0
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loading.summary ? (
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        ) : (
                          attendanceSummary?.totalClasses || 0
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Present Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {loading.summary ? (
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        ) : (
                          attendanceSummary?.totalAttended || 0
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Overall Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getAttendanceColor(attendanceSummary?.overallPercentage || 0)}`}>
                        {loading.summary ? (
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        ) : (
                          `${attendanceSummary?.overallPercentage || 0}%`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {attendanceSummary && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Attendance Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {attendanceSummary.attendanceBreakdown?.excellent || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Excellent (≥90%)</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {attendanceSummary.attendanceBreakdown?.good || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Good (75-89%)</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {attendanceSummary.attendanceBreakdown?.poor || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Poor (&lt;75%)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="take-attendance">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Date: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 px-3 py-2 rounded-md">
                        <span className="text-sm font-medium text-blue-900">Daily Attendance</span>
                      </div>
                      <Button 
                        onClick={handleSaveAttendance} 
                        className="flex items-center gap-2"
                        disabled={loading.saving || Object.keys(attendance).length === 0}
                      >
                        <Save className="h-4 w-4" />
                        {loading.saving ? 'Saving...' : 'Save Attendance'}
                      </Button>
                      <Button 
                        onClick={() => {
                          console.log('=== MANUAL DEBUG TEST ===');
                          console.log('User:', user);
                          console.log('User ID:', user?.id);
                          console.log('Selected subject:', selectedSubjectForAttendance);
                          fetchStudentsForAttendance();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Debug Test
                      </Button>
                    </div>
                  </div>
                  
                  {Object.keys(attendance).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold text-green-600">
                                {Object.values(attendance).filter(Boolean).length}
                              </p>
                              <p className="text-sm text-muted-foreground">Present</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <UserX className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-2xl font-bold text-red-600">
                                {Object.keys(attendance).length - Object.values(attendance).filter(Boolean).length}
                              </p>
                              <p className="text-sm text-muted-foreground">Absent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{Object.keys(attendance).length}</p>
                              <p className="text-sm text-muted-foreground">Total</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Mark Student Attendance ({studentsForAttendance.length} students)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading.studentsForAttendance ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading students...</p>
                          </div>
                        </div>
                      ) : studentsForAttendance.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Present</TableHead>
                              <TableHead>Roll No</TableHead>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Subjects</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentsForAttendance.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={attendance[student.id] || false}
                                    onCheckedChange={(checked) => 
                                      handleAttendanceChange(student.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{student.rollNo}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>
                                  {student.subjects.map(sub => sub.name).join(', ')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : selectedSubjectForAttendance ? (
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No students found for the selected subject</p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Please select a subject to view students</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorAttendance;