import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, GraduationCap, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const HODResults = () => {
  const [openSubjects, setOpenSubjects] = useState<{ [key: string]: boolean }>({});

  const sidebarItems = [
    { title: "Dashboard", url: "/hod", icon: Users },
    { title: "Attendance", url: "/hod/attendance", icon: Users },
    { title: "Professor Management", url: "/hod/professors", icon: GraduationCap },
    { title: "Exam Results", url: "/hod/results", icon: Users },
    { title: "Notices", url: "/hod/notices", icon: Users },
  ];

  const subjectResults = [
    {
      subject: "Computer Science",
      totalStudents: 45,
      passed: 38,
      failed: 7,
      passPercentage: 84.4,
      students: [
        { name: "John Smith", rollNo: "CS001", marks: 85, grade: "A", status: "Pass" },
        { name: "Emily Johnson", rollNo: "CS002", marks: 78, grade: "B", status: "Pass" },
        { name: "Michael Brown", rollNo: "CS003", marks: 65, grade: "C", status: "Pass" },
        { name: "Sarah Davis", rollNo: "CS004", marks: 92, grade: "A+", status: "Pass" },
        { name: "Tom Wilson", rollNo: "CS005", marks: 45, grade: "F", status: "Fail" },
      ]
    },
    {
      subject: "Mathematics",
      totalStudents: 42,
      passed: 35,
      failed: 7,
      passPercentage: 83.3,
      students: [
        { name: "Alice Brown", rollNo: "MT001", marks: 88, grade: "A", status: "Pass" },
        { name: "Bob Johnson", rollNo: "MT002", marks: 72, grade: "B", status: "Pass" },
        { name: "Carol Davis", rollNo: "MT003", marks: 55, grade: "C", status: "Pass" },
        { name: "David Wilson", rollNo: "MT004", marks: 95, grade: "A+", status: "Pass" },
        { name: "Eve Miller", rollNo: "MT005", marks: 42, grade: "F", status: "Fail" },
      ]
    },
    {
      subject: "Physics",
      totalStudents: 38,
      passed: 32,
      failed: 6,
      passPercentage: 84.2,
      students: [
        { name: "Frank Garcia", rollNo: "PH001", marks: 82, grade: "A", status: "Pass" },
        { name: "Grace Lee", rollNo: "PH002", marks: 76, grade: "B", status: "Pass" },
        { name: "Henry Martinez", rollNo: "PH003", marks: 68, grade: "C", status: "Pass" },
        { name: "Ivy Taylor", rollNo: "PH004", marks: 89, grade: "A", status: "Pass" },
        { name: "Jack Anderson", rollNo: "PH005", marks: 48, grade: "F", status: "Fail" },
      ]
    }
  ];

  const toggleSubject = (subject: string) => {
    setOpenSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Exam Result Reports</h1>
            
            <div className="space-y-6">
              {subjectResults.map((result) => (
                <Card key={result.subject}>
                  <CardHeader>
                    <Collapsible 
                      open={openSubjects[result.subject]} 
                      onOpenChange={() => toggleSubject(result.subject)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                          <CardTitle className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5" />
                              {result.subject}
                            </div>
                            <div className="flex items-center gap-4 ml-6">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-success" />
                                <span className="text-sm text-success">
                                  {result.passed} Passed ({result.passPercentage}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-destructive" />
                                <span className="text-sm text-destructive">
                                  {result.failed} Failed
                                </span>
                              </div>
                            </div>
                          </CardTitle>
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform ${
                              openSubjects[result.subject] ? "rotate-180" : ""
                            }`} 
                          />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-muted-foreground">Pass Rate:</span>
                          <Progress value={result.passPercentage} className="flex-1 max-w-xs" />
                          <span className="text-sm font-medium">{result.passPercentage}%</span>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <CardContent className="pt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Marks</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {result.students.map((student) => (
                                <TableRow key={student.rollNo}>
                                  <TableCell className="font-medium">{student.rollNo}</TableCell>
                                  <TableCell>{student.name}</TableCell>
                                  <TableCell>{student.marks}/100</TableCell>
                                  <TableCell className={getGradeColor(student.grade)}>
                                    {student.grade}
                                  </TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      student.status === "Pass" 
                                        ? "bg-success/10 text-success" 
                                        : "bg-destructive/10 text-destructive"
                                    }`}>
                                      {student.status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODResults;