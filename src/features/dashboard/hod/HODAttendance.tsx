import { SidebarProvider, AppSidebar, DynamicHeader } from "@/shared/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Users, GraduationCap, UserCheck, UserX, Calendar, Save, Search, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";

interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

interface ProfessorAttendance {
  id: string;
  name: string;
  subject: string;
  totalDays: number;
  present: number;
  percentage: number;
}

interface ProfessorForAttendance {
  id: string;
  name: string;
  subject: string;
}

const HODAttendance = () => {
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);
  const [professorAttendance, setProfessorAttendance] = useState<ProfessorAttendance[]>([]);
  const [professors, setProfessors] = useState<ProfessorForAttendance[]>([]);
  const [loading, setLoading] = useState({
    students: false,
    professors: false,
    professorsList: false,
    saving: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [currentPage, setCurrentPage] = useState({
    students: 1,
    professors: 1
  });
  const [totalPages, setTotalPages] = useState({
    students: 1,
    professors: 1
  });

  useEffect(() => {
    fetchStudentAttendance();
    fetchProfessorAttendance();
    fetchProfessorsForAttendance();
  }, [currentPage.students, currentPage.professors, searchTerm, selectedYear, selectedSubject]);

  const fetchStudentAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, students: true }));
      
      // Use the HOD attendance API
      const response = await hodService.getStudentAttendanceForHOD(
        currentPage.students, 
        20
      );
      
      // The response is already in the correct format
      setStudentAttendance(response.data);
      setTotalPages(prev => ({ ...prev, students: response.pagination?.totalPages || 1 }));
    } catch (error: any) {
      console.error('Error fetching student attendance:', error);
      toast.error(error.message || 'Failed to load student attendance');
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchProfessorAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, professors: true }));
      const response = await hodService.getProfessorAttendance(
        currentPage.professors, 
        20, 
        searchTerm, 
        selectedSubject === 'all' ? '' : selectedSubject
      );
      setProfessorAttendance(response.data);
      setTotalPages(prev => ({ ...prev, professors: response.pagination.totalPages }));
    } catch (error: any) {
      console.error('Error fetching professor attendance:', error);
      toast.error(error.message || 'Failed to load professor attendance');
    } finally {
      setLoading(prev => ({ ...prev, professors: false }));
    }
  };

  const fetchProfessorsForAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, professorsList: true }));
      const response = await hodService.getProfessorsForAttendance();
      setProfessors(response.data);
    } catch (error: any) {
      console.error('Error fetching professors for attendance:', error);
      toast.error(error.message || 'Failed to load professors list');
    } finally {
      setLoading(prev => ({ ...prev, professorsList: false }));
    }
  };

  const handleAttendanceChange = (professorId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [professorId]: present
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      const attendanceData = Object.entries(attendance).map(([professorId, status]) => ({
        professorId,
        status
      }));
      
      await hodService.saveProfessorAttendance(new Date().toISOString().split('T')[0], attendanceData);
      toast.success('Professor attendance saved successfully!');
      setAttendance({});
      fetchProfessorAttendance(); // Refresh professor attendance data
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage({ students: 1, professors: 1 });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
        
        <main className="flex-1">
          <DynamicHeader role="hod" />
          <div className="p-6 bg-background">
            <div className="max-w-7xl mx-auto">
            
            <Tabs defaultValue="students" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Student Attendance</TabsTrigger>
                <TabsTrigger value="professors">Professor Attendance</TabsTrigger>
                <TabsTrigger value="take-attendance">Take Professor Attendance</TabsTrigger>
              </TabsList>
              
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedYear || undefined} onValueChange={(value) => setSelectedYear(value || '')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject || undefined} onValueChange={(value) => setSelectedSubject(value || '')}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetchStudentAttendance();
                    fetchProfessorAttendance();
                  }}
                  disabled={loading.students || loading.professors}
                >
                  <RefreshCw className={`h-4 w-4 ${(loading.students || loading.professors) ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Student Attendance Overview ({studentAttendance.length} students)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.students ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground">Loading student attendance...</p>
                        </div>
                      </div>
                    ) : studentAttendance.length > 0 ? (
                      <>
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
                                  {student.percentage.toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {/* Pagination */}
                        {totalPages.students > 1 && (
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                              Page {currentPage.students} of {totalPages.students}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => ({ ...prev, students: Math.max(prev.students - 1, 1) }))}
                                disabled={currentPage.students === 1}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => ({ ...prev, students: Math.min(prev.students + 1, totalPages.students) }))}
                                disabled={currentPage.students === totalPages.students}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No student attendance data found</p>
                        {searchTerm && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your search terms
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="professors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Professor Attendance Overview ({professorAttendance.length} professors)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.professors ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground">Loading professor attendance...</p>
                        </div>
                      </div>
                    ) : professorAttendance.length > 0 ? (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Professor Name</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Total Days</TableHead>
                              <TableHead>Present</TableHead>
                              <TableHead>Attendance %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {professorAttendance.map((professor) => (
                              <TableRow key={professor.id}>
                                <TableCell className="font-medium">{professor.name}</TableCell>
                                <TableCell>{professor.subject}</TableCell>
                                <TableCell>{professor.totalDays}</TableCell>
                                <TableCell>{professor.present}</TableCell>
                                <TableCell className={getAttendanceColor(professor.percentage)}>
                                  {professor.percentage.toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {/* Pagination */}
                        {totalPages.professors > 1 && (
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                              Page {currentPage.professors} of {totalPages.professors}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => ({ ...prev, professors: Math.max(prev.professors - 1, 1) }))}
                                disabled={currentPage.professors === 1}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => ({ ...prev, professors: Math.min(prev.professors + 1, totalPages.professors) }))}
                                disabled={currentPage.professors === totalPages.professors}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No professor attendance data found</p>
                        {searchTerm && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your search terms
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="take-attendance">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      onClick={handleSaveAttendance} 
                      className="flex items-center gap-2"
                      disabled={loading.saving || Object.keys(attendance).length === 0}
                    >
                      <Save className="h-4 w-4" />
                      {loading.saving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>
                  
                  {Object.keys(attendance).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-success" />
                            <div>
                              <p className="text-2xl font-bold text-success">
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
                            <UserX className="h-5 w-5 text-destructive" />
                            <div>
                              <p className="text-2xl font-bold text-destructive">
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
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-2xl font-bold text-primary">{Object.keys(attendance).length}</p>
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
                        Mark Professor Attendance ({professors.length} professors)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading.professorsList ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading professors...</p>
                          </div>
                        </div>
                      ) : professors.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Present</TableHead>
                              <TableHead>Professor Name</TableHead>
                              <TableHead>Subject</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {professors.map((professor) => (
                              <TableRow key={professor.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={attendance[professor.id] || false}
                                    onCheckedChange={(checked) => 
                                      handleAttendanceChange(professor.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{professor.name}</TableCell>
                                <TableCell>{professor.subject}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No professors found for attendance</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODAttendance;