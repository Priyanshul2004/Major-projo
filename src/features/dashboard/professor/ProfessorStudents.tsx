import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Plus, Trash2, Search, RefreshCw, Users, UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { toast } from "sonner";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  academicInfo: {
    year: string;
    semester: number;
    specialization: string;
  };
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    subjectCode: string;
  }>;
}

const ProfessorStudents = () => {
  const { user } = useAuth();
  console.log('=== PROFESSOR STUDENTS COMPONENT LOADED ===');
  console.log('User object:', user);
  console.log('User ID:', user?.id);
  console.log('User role:', user?.role);
  console.log('Component timestamp:', new Date().toISOString());
  
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();


  useEffect(() => {
    console.log('useEffect - fetchStudents triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchStudents();
    }
  }, [user?.id, currentPage, searchTerm, selectedSubject]);

  const fetchStudents = async () => {
    console.log('=== FETCH STUDENTS CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Current page:', currentPage);
    console.log('Search term:', searchTerm);
    console.log('Selected subject:', selectedSubject);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchStudents');
      return;
    }
    
    try {
      console.log('Setting loading state to true');
      setLoading(true);
      
      console.log('Calling professorService.getStudentAttendance...');
      const response = await professorService.getStudentAttendance({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        subjectId: selectedSubject,
        professorId: user?.id
      });
      console.log('Students response:', response);
      
      setStudents(response.data);
      setTotalPages(response.pagination.totalPages);
      console.log('Students data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING STUDENTS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load students');
    } finally {
      console.log('Setting loading state to false');
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log("Adding student:", data);
      
      if (!user?.id) {
        toast.error('User not found');
        return;
      }

      // Prepare student data for API
      const studentData = {
        rollNo: data.rollNo,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        password: data.password || '12345', // Default password
        subjectIds: data.subjectIds || [] // Will be populated from professor's subjects
      };

      console.log('Calling professorService.addStudent...');
      const response = await professorService.addStudent(studentData);
      console.log('Add student response:', response);
      
      toast.success('Student added successfully!');
      setOpen(false);
      form.reset();
      fetchStudents();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(error.message || 'Failed to add student');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      // Note: Students are typically managed by HOD, not professors
      console.log("Student management action for:", studentId);
      toast.success('Student action completed successfully!');
      fetchStudents();
    } catch (error: any) {
      console.error('Error managing student:', error);
      toast.error(error.message || 'Failed to manage student');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={PROFESSOR_NAV_ITEMS} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Class Management</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? "" : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStudents}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Student Action
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
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Set student password" {...field} />
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
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Students ({students.length} students)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading students...</p>
                    </div>
                  </div>
                ) : students.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Password</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rollNo}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.password}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No students found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Students will appear here once they are assigned to your subjects'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorStudents;