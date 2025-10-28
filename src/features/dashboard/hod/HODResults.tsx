import { SidebarProvider, AppSidebar, DynamicHeader } from "@/shared/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Users, GraduationCap, TrendingUp, Award, RefreshCw, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";

interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  examType: string;
  subject: {
    id: string;
    name: string;
    code: string;
    department: string;
  };
  academicYear: string;
  semester: number;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  publishedBy: string;
  publishedAt: string;
  status: string;
  results: Array<{
    studentId: string;
    rollNumber: string;
    marksObtained: number;
    grade: string;
    status: string;
    remarks: string;
    _id: string;
  }>;
}

const HODResults = () => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch exam results
  const fetchExamResults = async () => {
    try {
      setLoading(true);
      const response = await hodService.getExamResultsForHOD(
        currentPage,
        20,
        searchTerm,
        selectedSubject,
        selectedExamType
      );
      
      setExamResults(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching exam results:', error);
      toast.error(error.message || 'Failed to load exam results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamResults();
  }, [currentPage, searchTerm, selectedSubject, selectedExamType]);

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    let totalStudents = 0;
    let totalPassed = 0;
    let totalMarks = 0;
    let highestMarks = 0;
    let totalExams = 0;

    examResults.forEach(exam => {
      totalExams++;
      exam.results.forEach(result => {
        totalStudents++;
        totalMarks += result.marksObtained;
        highestMarks = Math.max(highestMarks, result.marksObtained);
        if (result.status === 'pass') {
          totalPassed++;
        }
      });
    });

    const passRate = totalStudents > 0 ? (totalPassed / totalStudents) * 100 : 0;
    const averageMarks = totalStudents > 0 ? totalMarks / totalStudents : 0;

    return {
      totalStudents,
      passRate: Math.round(passRate * 10) / 10,
      averageMarks: Math.round(averageMarks * 10) / 10,
      highestMarks
    };
  };

  const summaryStats = calculateSummaryStats();

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
    return status === "pass" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
        
        <main className="flex-1">
          <DynamicHeader role="hod" />
          <div className="p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {summaryStats.totalStudents}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pass Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      {summaryStats.passRate}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Marks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      {summaryStats.averageMarks}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Highest Marks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      {summaryStats.highestMarks}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by exam name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? "" : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by subject" />
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
                <Select value={selectedExamType || "all"} onValueChange={(value) => setSelectedExamType(value === "all" ? "" : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exam Types</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="midterm">Midterm</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchExamResults}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    All Exam Results ({examResults.length} exams)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading exam results...</p>
                      </div>
                    </div>
                  ) : examResults.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exam Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Exam Type</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examResults.map((exam) => 
                            exam.results.map((result) => (
                              <TableRow key={`${exam.id}-${result._id}`}>
                                <TableCell className="font-medium">{exam.examName}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{exam.subject.name}</div>
                                    <div className="text-sm text-muted-foreground">{exam.subject.code}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {exam.examType}
                                  </Badge>
                                </TableCell>
                                <TableCell>{result.rollNumber}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{result.marksObtained}</div>
                                    <div className="text-sm text-muted-foreground">/ {exam.totalMarks}</div>
                                  </div>
                                </TableCell>
                                <TableCell className={getGradeColor(result.grade)}>
                                  {result.grade}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(result.status)}>
                                    {result.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{exam.publishedBy}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
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
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No exam results found</p>
                      {searchTerm && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Try adjusting your search terms
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODResults;