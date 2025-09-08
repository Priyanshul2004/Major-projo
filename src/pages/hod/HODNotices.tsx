import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Plus, Calendar, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const HODNotices = () => {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const sidebarItems = [
    { title: "Dashboard", url: "/hod", icon: Users },
    { title: "Attendance", url: "/hod/attendance", icon: Users },
    { title: "Professor Management", url: "/hod/professors", icon: GraduationCap },
    { title: "Exam Results", url: "/hod/results", icon: Users },
    { title: "Notices", url: "/hod/notices", icon: Users },
  ];

  const notices = [
    {
      id: 1,
      title: "Mid-Term Examinations Schedule",
      content: "Mid-term examinations will be conducted from March 15-22, 2024. Students are advised to prepare accordingly and check the detailed timetable on the notice board.",
      date: "2024-03-01",
      author: "Dr. John Smith",
      priority: "High",
      category: "Academic"
    },
    {
      id: 2,
      title: "Library Hours Extended",
      content: "The library will remain open until 10 PM starting from March 10, 2024, to help students prepare for their examinations.",
      date: "2024-03-08",
      author: "Dr. John Smith",
      priority: "Medium",
      category: "General"
    },
    {
      id: 3,
      title: "Annual Sports Day",
      content: "The annual sports day will be held on March 25, 2024. All students and faculty are encouraged to participate in various sporting events.",
      date: "2024-03-05",
      author: "Dr. John Smith",
      priority: "Low",
      category: "Event"
    },
    {
      id: 4,
      title: "COVID-19 Safety Guidelines",
      content: "All students and staff must follow COVID-19 safety protocols including mask wearing in common areas and maintaining social distancing.",
      date: "2024-02-28",
      author: "Dr. John Smith",
      priority: "High",
      category: "Health"
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Adding notice:", data);
    setOpen(false);
    form.reset();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-warning/10 text-warning";
      case "low": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "academic": return "bg-primary/10 text-primary";
      case "general": return "bg-secondary/10 text-secondary-foreground";
      case "event": return "bg-accent/10 text-accent-foreground";
      case "health": return "bg-orange-100 text-orange-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Notice Management</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Notice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Notice</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notice Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter notice title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notice Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter notice content"
                                rows={4}
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
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full px-3 py-2 border border-input rounded-md">
                                  <option value="">Select priority</option>
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full px-3 py-2 border border-input rounded-md">
                                  <option value="">Select category</option>
                                  <option value="Academic">Academic</option>
                                  <option value="General">General</option>
                                  <option value="Event">Event</option>
                                  <option value="Health">Health</option>
                                </select>
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
                        <Button type="submit">Publish Notice</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card key={notice.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{notice.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(notice.priority)}>
                          {notice.priority}
                        </Badge>
                        <Badge className={getCategoryColor(notice.category)}>
                          {notice.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{notice.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {notice.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(notice.date).toLocaleDateString()}
                      </div>
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

export default HODNotices;