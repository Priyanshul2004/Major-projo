import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const HODProfessors = () => {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const sidebarItems = [
    { title: "Dashboard", url: "/hod", icon: Users },
    { title: "Attendance", url: "/hod/attendance", icon: Users },
    { title: "Professor Management", url: "/hod/professors", icon: GraduationCap },
    { title: "Exam Results", url: "/hod/results", icon: Users },
    { title: "Notices", url: "/hod/notices", icon: Users },
  ];

  const professors = [
    { id: 1, name: "Dr. Alice Wilson", email: "alice.wilson@university.edu", subject: "Computer Science", experience: "8 years" },
    { id: 2, name: "Prof. Robert Lee", email: "robert.lee@university.edu", subject: "Mathematics", experience: "12 years" },
    { id: 3, name: "Dr. Lisa Garcia", email: "lisa.garcia@university.edu", subject: "Physics", experience: "6 years" },
    { id: 4, name: "Prof. James Miller", email: "james.miller@university.edu", subject: "Chemistry", experience: "10 years" },
  ];

  const onSubmit = (data: any) => {
    console.log("Adding professor:", data);
    setOpen(false);
    form.reset();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Professor Management</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Professor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Professor</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@university.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                <SelectItem value="biology">Biology</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl>
                              <Input placeholder="5 years" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Professor</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Professor List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professors.map((professor) => (
                      <TableRow key={professor.id}>
                        <TableCell className="font-medium">{professor.name}</TableCell>
                        <TableCell>{professor.email}</TableCell>
                        <TableCell>{professor.subject}</TableCell>
                        <TableCell>{professor.experience}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
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

export default HODProfessors;