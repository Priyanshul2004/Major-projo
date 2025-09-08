import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Users, UserCheck, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ProfessorStudents = () => {
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

  const students = [
    { id: 1, rollNo: "CS001", name: "John Smith", email: "john.smith@student.edu", phone: "+1234567890", joinDate: "2023-08-15" },
    { id: 2, rollNo: "CS002", name: "Emily Johnson", email: "emily.johnson@student.edu", phone: "+1234567891", joinDate: "2023-08-15" },
    { id: 3, rollNo: "CS003", name: "Michael Brown", email: "michael.brown@student.edu", phone: "+1234567892", joinDate: "2023-08-15" },
    { id: 4, rollNo: "CS004", name: "Sarah Davis", email: "sarah.davis@student.edu", phone: "+1234567893", joinDate: "2023-08-15" },
    { id: 5, rollNo: "CS005", name: "Tom Wilson", email: "tom.wilson@student.edu", phone: "+1234567894", joinDate: "2023-08-20" },
    { id: 6, rollNo: "CS006", name: "Lisa Garcia", email: "lisa.garcia@student.edu", phone: "+1234567895", joinDate: "2023-08-20" },
  ];

  const onSubmit = (data: any) => {
    console.log("Adding student:", data);
    setOpen(false);
    form.reset();
  };

  const handleDeleteStudent = (studentId: number) => {
    console.log("Deleting student:", studentId);
    // Here you would typically delete from backend
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Class Management</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="rollNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl>
                              <Input placeholder="CS007" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
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
                              <Input placeholder="john.doe@student.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Student</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Computer Science Class - Student List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{new Date(student.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
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

export default ProfessorStudents;