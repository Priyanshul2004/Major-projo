import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Plus, Calendar, User, Clock, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const StudentCommunication = () => {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const sidebarItems = [
    { title: "Dashboard", url: "/student", icon: Users },
    { title: "Study Material", url: "/student/materials", icon: BookOpen },
    { title: "Assignments", url: "/student/assignments", icon: Users },
    { title: "Attendance", url: "/student/attendance", icon: Users },
    { title: "Communication", url: "/student/communication", icon: Users },
  ];

  const doubts = [
    {
      id: 1,
      subject: "Data Structures",
      professor: "Dr. Alice Wilson",
      question: "Can you explain the difference between a stack and a queue? I'm having trouble understanding when to use each one.",
      askedDate: "2024-03-12T10:30:00",
      status: "Replied",
      priority: "Medium",
      reply: {
        content: "A stack follows LIFO (Last In First Out) principle - think of it like a stack of plates. You can only add or remove from the top. A queue follows FIFO (First In First Out) - like a line at the cafeteria. Use stacks for undo operations, function calls, etc. Use queues for task scheduling, breadth-first search, etc.",
        repliedDate: "2024-03-12T14:20:00"
      }
    },
    {
      id: 2,
      subject: "Algorithm Analysis",
      professor: "Dr. Alice Wilson",
      question: "I don't understand how to calculate the time complexity of recursive algorithms. Could you provide some examples?",
      askedDate: "2024-03-11T14:20:00",
      status: "Replied",
      priority: "High",
      reply: {
        content: "For recursive algorithms, you need to set up a recurrence relation. For example, T(n) = T(n-1) + O(1) for linear recursion like factorial. For binary recursion like Fibonacci, it's T(n) = 2T(n-1) + O(1). I'll explain this in detail in tomorrow's class with more examples.",
        repliedDate: "2024-03-11T16:45:00"
      }
    },
    {
      id: 3,
      subject: "Database Design",
      professor: "Dr. Alice Wilson",
      question: "What's the difference between INNER JOIN and LEFT JOIN in SQL? When should I use each one?",
      askedDate: "2024-03-10T09:15:00",
      status: "Pending",
      priority: "Low",
      reply: null
    },
    {
      id: 4,
      subject: "Linear Algebra",
      professor: "Prof. Robert Lee",
      question: "Could you clarify the concept of eigenvectors and eigenvalues with a practical example?",
      askedDate: "2024-03-09T11:45:00",
      status: "Replied",
      priority: "Medium",
      reply: {
        content: "Eigenvalues and eigenvectors are fundamental concepts. When you multiply a matrix by its eigenvector, you get the same vector multiplied by a scalar (eigenvalue). Think of it like stretching or compressing the vector without changing its direction. They're used in face recognition, principal component analysis, and Google's PageRank algorithm.",
        repliedDate: "2024-03-09T13:30:00"
      }
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Asking doubt:", data);
    setOpen(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-warning/10 text-warning";
      case "replied": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-warning/10 text-warning";
      case "low": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Communication & Doubts</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ask Doubt
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Ask a Doubt</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="computer-science">Computer Science</SelectItem>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="physics">Physics</SelectItem>
                                <SelectItem value="chemistry">Chemistry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="professor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select professor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dr-alice-wilson">Dr. Alice Wilson</SelectItem>
                                <SelectItem value="prof-robert-lee">Prof. Robert Lee</SelectItem>
                                <SelectItem value="dr-lisa-garcia">Dr. Lisa Garcia</SelectItem>
                                <SelectItem value="prof-james-miller">Prof. James Miller</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Question</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Type your question here..."
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Ask Question</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-6">
              {doubts.map((doubt) => (
                <Card key={doubt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {doubt.subject}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(doubt.priority)}>
                          {doubt.priority}
                        </Badge>
                        <Badge className={getStatusColor(doubt.status)}>
                          {doubt.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {doubt.professor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doubt.askedDate)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Your Question:</p>
                        <p className="text-muted-foreground">{doubt.question}</p>
                      </div>
                      
                      {doubt.reply ? (
                        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-4 w-4" />
                            <p className="text-sm font-medium">Professor's Reply:</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Clock className="h-3 w-3" />
                              {formatDate(doubt.reply.repliedDate)}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{doubt.reply.content}</p>
                        </div>
                      ) : (
                        <div className="bg-warning/5 p-4 rounded-lg border-l-4 border-warning">
                          <p className="text-sm text-warning">Waiting for professor's reply...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentCommunication;