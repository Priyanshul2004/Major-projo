import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Upload, Calendar, Clock, FileText, CheckCircle, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const StudentAssignments = () => {
  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const form = useForm();

  const sidebarItems = [
    { title: "Dashboard", url: "/student", icon: Users },
    { title: "Study Material", url: "/student/materials", icon: BookOpen },
    { title: "Assignments", url: "/student/assignments", icon: Users },
    { title: "Attendance", url: "/student/attendance", icon: Users },
    { title: "Communication", url: "/student/communication", icon: Users },
  ];

  const assignments = [
    {
      id: 1,
      title: "Data Structures Implementation",
      description: "Implement stack and queue using arrays and linked lists",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      dueDate: "2024-03-20",
      assignedDate: "2024-03-01",
      maxMarks: 100,
      status: "Pending",
      submitted: false,
      submissionDate: null,
      marks: null,
      feedback: null
    },
    {
      id: 2,
      title: "Algorithm Analysis Report",
      description: "Analyze time complexity of sorting algorithms",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      dueDate: "2024-03-15",
      assignedDate: "2024-02-28",
      maxMarks: 50,
      status: "Graded",
      submitted: true,
      submissionDate: "2024-03-12",
      marks: 45,
      feedback: "Excellent analysis of bubble sort and quick sort. Consider adding more examples for merge sort."
    },
    {
      id: 3,
      title: "Database Design Project",
      description: "Design a database schema for an e-commerce application",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      dueDate: "2024-03-25",
      assignedDate: "2024-03-05",
      maxMarks: 150,
      status: "Submitted",
      submitted: true,
      submissionDate: "2024-03-18",
      marks: null,
      feedback: null
    },
    {
      id: 4,
      title: "Linear Algebra Problems",
      description: "Solve matrix operations and vector space problems",
      subject: "Mathematics",
      professor: "Prof. Robert Lee",
      dueDate: "2024-03-22",
      assignedDate: "2024-03-08",
      maxMarks: 80,
      status: "Pending",
      submitted: false,
      submissionDate: null,
      marks: null,
      feedback: null
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Submitting assignment:", selectedAssignment, data);
    setOpen(false);
    setSelectedAssignment(null);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-warning/10 text-warning";
      case "submitted": return "bg-primary/10 text-primary";
      case "graded": return "bg-success/10 text-success";
      case "overdue": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingAssignments = assignments.filter(a => a.status === "Pending");
  const submittedAssignments = assignments.filter(a => a.status === "Submitted" || a.status === "Graded");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Assignments</h1>
            
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending Assignments</TabsTrigger>
                <TabsTrigger value="submitted">Submitted & Graded</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => {
                    const daysRemaining = getDaysRemaining(assignment.dueDate);
                    const isOverdue = daysRemaining < 0;
                    
                    return (
                      <Card key={assignment.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              {assignment.title}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                              {isOverdue ? (
                                <Badge className="bg-destructive/10 text-destructive">
                                  Overdue
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  {daysRemaining} days left
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{assignment.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{assignment.professor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>Max: {assignment.maxMarks} marks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{assignment.subject}</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Dialog 
                              open={open && selectedAssignment === assignment.id} 
                              onOpenChange={(open) => {
                                setOpen(open);
                                if (!open) setSelectedAssignment(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  className="flex items-center gap-2"
                                  onClick={() => setSelectedAssignment(assignment.id)}
                                >
                                  <Upload className="h-4 w-4" />
                                  Submit Assignment
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Submit: {assignment.title}</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="file"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Upload Assignment File</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="file" 
                                              accept=".pdf,.doc,.docx,.zip"
                                              {...field} 
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => {
                                          setOpen(false);
                                          setSelectedAssignment(null);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button type="submit">Submit</Button>
                                    </div>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {pendingAssignments.length === 0 && (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                        <p className="text-muted-foreground">No pending assignments! You're all caught up.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="submitted">
                <div className="space-y-4">
                  {submittedAssignments.map((assignment) => (
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{assignment.professor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Submitted: {assignment.submissionDate && new Date(assignment.submissionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>
                              {assignment.marks !== null 
                                ? `${assignment.marks}/${assignment.maxMarks}` 
                                : `Max: ${assignment.maxMarks} marks`
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{assignment.subject}</span>
                          </div>
                        </div>
                        
                        {assignment.feedback && (
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Professor Feedback:</p>
                            <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentAssignments;