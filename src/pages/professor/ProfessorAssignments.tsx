import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Plus, Eye, Calendar, Clock, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ProfessorAssignments = () => {
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

  const assignments = [
    {
      id: 1,
      title: "Data Structures Implementation",
      description: "Implement stack and queue using arrays and linked lists",
      dueDate: "2024-03-20",
      createdDate: "2024-03-01",
      maxMarks: 100,
      submissions: 42,
      totalStudents: 45,
      status: "Active"
    },
    {
      id: 2,
      title: "Algorithm Analysis Report",
      description: "Analyze time complexity of sorting algorithms",
      dueDate: "2024-03-15",
      createdDate: "2024-02-28",
      maxMarks: 50,
      submissions: 45,
      totalStudents: 45,
      status: "Completed"
    },
    {
      id: 3,
      title: "Database Design Project",
      description: "Design a database schema for an e-commerce application",
      dueDate: "2024-03-25",
      createdDate: "2024-03-05",
      maxMarks: 150,
      submissions: 28,
      totalStudents: 45,
      status: "Active"
    }
  ];

  const submissions = [
    { id: 1, studentName: "John Smith", rollNo: "CS001", submittedDate: "2024-03-12", status: "Submitted", marks: null },
    { id: 2, studentName: "Emily Johnson", rollNo: "CS002", submittedDate: "2024-03-13", status: "Submitted", marks: null },
    { id: 3, studentName: "Michael Brown", rollNo: "CS003", submittedDate: "2024-03-14", status: "Submitted", marks: null },
    { id: 4, studentName: "Sarah Davis", rollNo: "CS004", submittedDate: "2024-03-11", status: "Graded", marks: 85 },
    { id: 5, studentName: "Tom Wilson", rollNo: "CS005", submittedDate: null, status: "Pending", marks: null },
  ];

  const onSubmit = (data: any) => {
    console.log("Creating assignment:", data);
    setOpen(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-success/10 text-success";
      case "completed": return "bg-primary/10 text-primary";
      case "overdue": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted": return "bg-primary/10 text-primary";
      case "graded": return "bg-success/10 text-success";
      case "pending": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignment Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter assignment title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter assignment description"
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxMarks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Marks</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Assignment</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs defaultValue="assignments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assignments">Assignment List</TabsTrigger>
                <TabsTrigger value="submissions">Student Submissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assignments">
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {assignment.title}
                          </CardTitle>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{assignment.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Created: {new Date(assignment.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>Max Marks: {assignment.maxMarks}</span>
                          </div>
                          <div>
                            <span>Submissions: {assignment.submissions}/{assignment.totalStudents}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="submissions">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Submitted Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.rollNo}</TableCell>
                            <TableCell>{submission.studentName}</TableCell>
                            <TableCell>
                              {submission.submittedDate 
                                ? new Date(submission.submittedDate).toLocaleDateString()
                                : "-"
                              }
                            </TableCell>
                            <TableCell>
                              <Badge className={getSubmissionStatusColor(submission.status)}>
                                {submission.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {submission.marks ? `${submission.marks}/100` : "-"}
                            </TableCell>
                            <TableCell>
                              {submission.status === "Submitted" && (
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  Review
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorAssignments;