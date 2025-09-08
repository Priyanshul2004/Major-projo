import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, MessageCircle, Reply, Calendar, User, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ProfessorCommunication = () => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
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

  const doubts = [
    {
      id: 1,
      studentName: "John Smith",
      rollNo: "CS001",
      subject: "Data Structures",
      question: "Can you explain the difference between a stack and a queue? I'm having trouble understanding when to use each one.",
      askedDate: "2024-03-12T10:30:00",
      status: "Pending",
      priority: "Medium",
      reply: null
    },
    {
      id: 2,
      studentName: "Emily Johnson",
      rollNo: "CS002",
      subject: "Algorithm Analysis",
      question: "I don't understand how to calculate the time complexity of recursive algorithms. Could you provide some examples?",
      askedDate: "2024-03-11T14:20:00",
      status: "Replied",
      priority: "High",
      reply: {
        content: "For recursive algorithms, you need to set up a recurrence relation. For example, T(n) = T(n-1) + O(1) for linear recursion. I'll explain this in detail in tomorrow's class.",
        repliedDate: "2024-03-11T16:45:00"
      }
    },
    {
      id: 3,
      studentName: "Michael Brown",
      rollNo: "CS003",
      subject: "Database Design",
      question: "What's the difference between INNER JOIN and LEFT JOIN in SQL? When should I use each one?",
      askedDate: "2024-03-10T09:15:00",
      status: "Pending",
      priority: "Low",
      reply: null
    },
    {
      id: 4,
      studentName: "Sarah Davis",
      rollNo: "CS004",
      subject: "Object-Oriented Programming",
      question: "Could you clarify the concept of polymorphism with a practical example?",
      askedDate: "2024-03-09T11:45:00",
      status: "Replied",
      priority: "Medium",
      reply: {
        content: "Polymorphism allows objects of different types to be treated as objects of a common base type. For example, a Shape class with Circle and Rectangle subclasses can all implement a draw() method differently.",
        repliedDate: "2024-03-09T13:30:00"
      }
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Replying to doubt:", replyingTo, data);
    setReplyingTo(null);
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
        <AppSidebar role="professor" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Student Communication</h1>
            
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
                        {doubt.studentName} ({doubt.rollNo})
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
                        <p className="text-sm font-medium mb-2">Student Question:</p>
                        <p className="text-muted-foreground">{doubt.question}</p>
                      </div>
                      
                      {doubt.reply ? (
                        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="h-4 w-4" />
                            <p className="text-sm font-medium">Your Reply:</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Clock className="h-3 w-3" />
                              {formatDate(doubt.reply.repliedDate)}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{doubt.reply.content}</p>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Dialog 
                            open={replyingTo === doubt.id} 
                            onOpenChange={(open) => setReplyingTo(open ? doubt.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button className="flex items-center gap-2">
                                <Reply className="h-4 w-4" />
                                Reply to Student
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Reply to {doubt.studentName}</DialogTitle>
                              </DialogHeader>
                              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium mb-1">Student Question:</p>
                                <p className="text-sm text-muted-foreground">{doubt.question}</p>
                              </div>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="reply"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Your Reply</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Type your response here..."
                                            rows={5}
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
                                      onClick={() => setReplyingTo(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit">Send Reply</Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
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

export default ProfessorCommunication;