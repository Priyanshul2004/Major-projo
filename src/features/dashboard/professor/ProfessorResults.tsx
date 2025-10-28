import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Plus, Upload, TrendingUp, TrendingDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { toast } from "sonner";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";

const ProfessorResults = () => {
  const { user } = useAuth();
  console.log('=== PROFESSOR RESULTS COMPONENT LOADED ===');
  console.log('User object:', user);
  console.log('User ID:', user?.id);
  console.log('User role:', user?.role);
  console.log('Component timestamp:', new Date().toISOString());
  
  const [open, setOpen] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();

  // Fetch students using attendance API
  const fetchStudents = async () => {
    try {
      console.log('=== FETCH STUDENTS CALLED ===');
      console.log('User ID:', user?.id);
      
      if (!user?.id) {
        console.log('No user ID, skipping fetchStudents');
        return;
      }

      const response = await professorService.getStudentAttendance({
        page: 1,
        limit: 100, // Get all students
        professorId: user.id
      });
      
      console.log('Students response:', response);
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  // Fetch exam results
  const fetchExamResults = async () => {
    console.log('=== FETCH EXAM RESULTS CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Current page:', currentPage);
    console.log('Search term:', searchTerm);
    console.log('Selected subject:', selectedSubject);
    console.log('Selected exam type:', selectedExamType);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchExamResults');
      return;
    }
    
    try {
      console.log('Setting loading state to true');
      setLoading(true);
      
      console.log('Calling professorService.getExamResults...');
      const response = await professorService.getExamResults(
        user.id,
        currentPage,
        10,
        searchTerm,
        selectedSubject,
        selectedExamType
      );
      console.log('Exam results response:', response);
      
      setExamResults(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      console.log('Exam results data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING EXAM RESULTS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load exam results');
    } finally {
      console.log('Setting loading state to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect - fetchExamResults triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchExamResults();
      fetchStudents(); // Fetch students for the dropdown
    }
  }, [user?.id, currentPage, searchTerm, selectedSubject, selectedExamType]);

  const totalStudents = examResults.length;
  const passedStudents = examResults.filter(student => student.status === "Pass").length;
  const failedStudents = totalStudents - passedStudents;
  const passPercentage = totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await professorService.createStudentResult(user.id, data);
      toast.success('Student result added successfully!');
      setOpen(false);
      form.reset();
      fetchExamResults();
    } catch (error: any) {
      console.error('Error creating student result:', error);
      toast.error(error.message || 'Failed to create student result');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "text-emerald-600";
      case "A": return "text-green-600";
      case "B": return "text-blue-600";
      case "C": return "text-yellow-600";
      case "F": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Pass" 
      ? "bg-success/10 text-success" 
      : "bg-destructive/10 text-destructive";
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Upload className="h-8 w-8 animate-spin mx-auto mb-4" />
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
              <h1 className="text-3xl font-bold text-foreground">Exam Results</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Exam Result</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="student"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {students.map((student) => (
                                  <SelectItem key={student.id} value={student.rollNo}>
                                    {student.rollNo} - {student.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Computer Science, Mathematics" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="examType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exam Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select exam type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="midterm">Mid-Term</SelectItem>
                                <SelectItem value="final">Final Exam</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="marks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marks (out of 100)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" placeholder="85" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Result</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Pass Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Passed: {passedStudents}</span>
                      <span>{passPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={passPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Students Passed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-2xl font-bold text-success">{passedStudents}</p>
                      <p className="text-sm text-muted-foreground">Out of {totalStudents} students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    Students Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-2xl font-bold text-destructive">{failedStudents}</p>
                      <p className="text-sm text-muted-foreground">Need improvement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.rollNo}</TableCell>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{result.subject?.name || 'Unknown Subject'}</div>
                            <div className="text-sm text-muted-foreground">{result.subject?.code || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {result.examType}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.marks}/{result.totalMarks}</TableCell>
                        <TableCell className={getGradeColor(result.grade)}>
                          {result.grade}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.publishedBy}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorResults;