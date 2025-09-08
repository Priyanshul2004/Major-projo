import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Plus, Upload, TrendingUp, TrendingDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ProfessorResults = () => {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const sidebarItems = [
    { title: "Dashboard", url: "/professor", icon: Users },
    { title: "Attendance", url: "/professor/attendance", icon: UserCheck },
    { title: "Class Management", url: "/professor/students", icon: Users },
    { title: "Study Material", url: "/professor/materials", icon: Users },
    { title: "Assignments", url: "/professor/assignments", icon: Users },
    { title: "Exam Results", url: "/professor/results", icon: Users },
    { title: "Communication", url: "/professor/communication", icon: Users },
  ];

  const examResults = [
    { id: 1, rollNo: "CS001", name: "John Smith", midTerm: 85, finalExam: 88, total: 86.5, grade: "A", status: "Pass" },
    { id: 2, rollNo: "CS002", name: "Emily Johnson", midTerm: 78, finalExam: 82, total: 80, grade: "B", status: "Pass" },
    { id: 3, rollNo: "CS003", name: "Michael Brown", midTerm: 65, finalExam: 70, total: 67.5, grade: "C", status: "Pass" },
    { id: 4, rollNo: "CS004", name: "Sarah Davis", midTerm: 92, finalExam: 95, total: 93.5, grade: "A+", status: "Pass" },
    { id: 5, rollNo: "CS005", name: "Tom Wilson", midTerm: 45, finalExam: 48, total: 46.5, grade: "F", status: "Fail" },
    { id: 6, rollNo: "CS006", name: "Lisa Garcia", midTerm: 88, finalExam: 85, total: 86.5, grade: "A", status: "Pass" },
  ];

  const totalStudents = examResults.length;
  const passedStudents = examResults.filter(student => student.status === "Pass").length;
  const failedStudents = totalStudents - passedStudents;
  const passPercentage = (passedStudents / totalStudents) * 100;

  const onSubmit = (data: any) => {
    console.log("Adding exam result:", data);
    setOpen(false);
    form.reset();
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={sidebarItems} />
        
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
                                {examResults.map((student) => (
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
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-success">{passedStudents}</p>
                      <p className="text-sm text-muted-foreground">Students Passed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold text-destructive">{failedStudents}</p>
                      <p className="text-sm text-muted-foreground">Students Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Computer Science - Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Mid-Term</TableHead>
                      <TableHead>Final Exam</TableHead>
                      <TableHead>Total Average</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.rollNo}</TableCell>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.midTerm}/100</TableCell>
                        <TableCell>{result.finalExam}/100</TableCell>
                        <TableCell>{result.total}/100</TableCell>
                        <TableCell className={getGradeColor(result.grade)}>
                          {result.grade}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
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