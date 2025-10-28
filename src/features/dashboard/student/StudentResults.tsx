import { SidebarProvider, SidebarTrigger, AppSidebar, Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Progress } from "@/shared/components";
import { BookOpen, FileText, CheckCircle, Clock, TrendingUp, MessageSquare, User, LogOut, Settings, Award, Target, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/shared/constants";

const StudentResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState({
    totalExams: 0,
    averageScore: 0,
    totalMarks: 0,
    obtainedMarks: 0,
    subjects: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.id) {
      fetchResultsData();
    }
  }, [user?.id, currentPage, searchQuery, selectedSubject, selectedExamType]);

  const fetchResultsData = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING STUDENT RESULTS DATA ===');
      console.log('User ID:', user?.id);
      
      if (!user?.id) {
        console.log('No user ID, skipping fetchResultsData');
        return;
      }

      // Use student results card API to get current student's results
      const response = await studentService.getStudentResultsCard(user.id);
      console.log('Student results response:', response);
      
      if (response.data && response.data.length > 0) {
        const examResults = response.data;
        setResults(examResults);
        
        // Extract student's results from each exam
        const studentResults: any[] = [];
        examResults.forEach((exam: any) => {
          if (exam.results && Array.isArray(exam.results)) {
            // Since the API already filters results for the current student, 
            // we can take the first (and only) result from each exam
            const studentResult = exam.results[0];
            if (studentResult) {
              studentResults.push({
                ...studentResult,
                examName: exam.examName,
                examType: exam.examType,
                subject: exam.subject,
                totalMarks: exam.totalMarks,
                examDate: exam.examDate
              });
            }
          }
        });
        
        // Calculate performance summary from the student's results
        const totalExams = studentResults.length;
        const totalMarks = studentResults.reduce((sum: number, result: any) => sum + (result.totalMarks || 0), 0);
        const obtainedMarks = studentResults.reduce((sum: number, result: any) => sum + (result.marksObtained || 0), 0);
        const averageScore = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
        
        console.log('=== STUDENT RESULTS CALCULATION ===');
        console.log('Student results found:', studentResults.length);
        console.log('Total exams:', totalExams);
        console.log('Total marks:', totalMarks);
        console.log('Obtained marks:', obtainedMarks);
        console.log('Average score:', averageScore);
        console.log('Student results data:', studentResults);
        
        // Get unique subjects
        const subjects = [...new Set(studentResults.map((result: any) => result.subject?.name || 'Unknown Subject'))];
        
        const summary = {
          totalExams: totalExams,
          averageScore: Math.round(averageScore * 100) / 100,
          totalMarks: totalMarks,
          obtainedMarks: obtainedMarks,
          subjects: subjects
        };
        
        setPerformanceSummary(summary);
        console.log('Performance summary calculated:', summary);
        console.log('Student results extracted:', studentResults.length);
      } else {
        console.log('No student results found');
        setResults([]);
        setPerformanceSummary({
          totalExams: 0,
          averageScore: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          subjects: []
        });
      }
      
      setTotalPages(1); // Single student, so only 1 page
    } catch (error: any) {
      console.error('Error fetching results data:', error);
      toast.error(error.message || 'Failed to load results data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored user data/session here if needed
    // For now, just redirect to home page
    navigate("/");
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-green-100 text-green-800";
      case "A": return "bg-green-100 text-green-800";
      case "B+": return "bg-blue-100 text-blue-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C+": return "bg-yellow-100 text-yellow-800";
      case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
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
                <h1 className="text-3xl font-bold text-foreground">My Results</h1>
                <p className="text-muted-foreground mt-2">View your exam results and performance</p>
              </div>
              <SidebarTrigger />
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(performanceSummary.averageScore || 0)}`}>
                    {(performanceSummary.averageScore || 0).toFixed(1)}%
                  </div>
                  <Progress 
                    value={performanceSummary.averageScore || 0} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceSummary.totalMarks || 0}</div>
                  <p className="text-xs text-muted-foreground">Total possible marks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Obtained Marks</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceSummary.obtainedMarks || 0}</div>
                  <p className="text-xs text-muted-foreground">Marks obtained</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search results..."
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
                  {(performanceSummary.subjects || []).map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exam Types</SelectItem>
                  <SelectItem value="mid-term">Mid-Term</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchResultsData}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Results Cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading results...</p>
                </div>
              ) : results.length > 0 ? (
                results.map((examResult: any, index: number) => {
                  // Since the API already filters results for the current student,
                  // we can take the first (and only) result from each exam
                  const studentResult = examResult.results?.[0];

                  if (!studentResult) return null;

                  const percentage = examResult.totalMarks > 0 ? (studentResult.marksObtained / examResult.totalMarks) * 100 : 0;

                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{examResult.examName}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {examResult.subject?.name || 'Unknown Subject'} • {examResult.examType}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(examResult.examDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                              {studentResult.marksObtained} / {examResult.totalMarks}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </div>
                            <Badge className={getStatusColor(studentResult.status || 'pending')}>
                              {studentResult.status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                                Exam Details
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Subject:</span>
                                  <span className="text-sm font-medium">{examResult.subject?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Exam Type:</span>
                                  <span className="text-sm font-medium">{examResult.examType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Date:</span>
                                  <span className="text-sm font-medium">
                                    {new Date(examResult.examDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Published By:</span>
                                  <span className="text-sm font-medium">{examResult.publishedBy || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                                Your Performance
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Marks Obtained:</span>
                                  <span className="text-sm font-medium">{studentResult.marksObtained}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Total Marks:</span>
                                  <span className="text-sm font-medium">{examResult.totalMarks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Percentage:</span>
                                  <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status:</span>
                                  <Badge className={getStatusColor(studentResult.status || 'pending')}>
                                    {studentResult.status || 'Pending'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }).filter(Boolean)
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedSubject !== "all" || selectedExamType !== "all"
                      ? "Try adjusting your search filters"
                      : "No exam results have been published yet"}
                  </p>
                </div>
              )}
            </div>

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

export default StudentResults;