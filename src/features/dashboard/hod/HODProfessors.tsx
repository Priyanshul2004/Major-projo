import { SidebarProvider, AppSidebar, DynamicHeader } from "@/shared/components";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Users, GraduationCap, Plus, Trash2, Search, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";

interface Professor {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  subjects: Array<{
    name: string;
    code: string;
    isPrimary: boolean;
  }>;
  primarySubject: string;
  experience: number;
  qualifications: string[];
  rating: number;
  attendancePercentage: number;
  totalClasses: number;
  status: string;
  joinDate: string;
}

const HODProfessors = () => {
  const [open, setOpen] = useState(false);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState({
    professors: true,
    creating: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();

  useEffect(() => {
    fetchProfessors();
  }, [currentPage, searchTerm]);

  const fetchProfessors = async () => {
    try {
      setLoading(prev => ({ ...prev, professors: true }));
      const response = await hodService.getAllProfessors(currentPage, 10, searchTerm);
      setProfessors(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('Error fetching professors:', error);
      toast.error(error.message || 'Failed to load professors');
    } finally {
      setLoading(prev => ({ ...prev, professors: false }));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, creating: true }));
      
      // Prepare professor data for API
      const professorData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        experience: data.experience,
        password: data.password,
        phone: data.phone || '',
        qualifications: data.qualifications ? [data.qualifications] : []
      };

      // Call the API to create professor
      const response = await hodService.createProfessor(professorData);
      
      toast.success('Professor added successfully!');
      setOpen(false);
      form.reset();
      fetchProfessors(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating professor:', error);
      toast.error(error.message || 'Failed to add professor');
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const handleDelete = async (professorId: string) => {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this professor? This action cannot be undone.')) {
        return;
      }

      // Call the API to delete the professor
      await hodService.deleteProfessor(professorId);
      toast.success('Professor deleted successfully!');
      fetchProfessors(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting professor:', error);
      toast.error(error.message || 'Failed to delete professor');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
        
        <main className="flex-1">
          <DynamicHeader role="hod" />
          <div className="p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search professors..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchProfessors}
                    disabled={loading.professors}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading.professors ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
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
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Economics">Economics</SelectItem>
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
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="qualifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualifications (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="PhD in Computer Science" {...field} />
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
                            <FormLabel>Password (Numbers only, min 5 digits)</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter 5+ digit number (e.g., 12345)" 
                                pattern="[0-9]+"
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  field.onChange(value);
                                }}
                                value={field.value}
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
                        <Button type="submit" disabled={loading.creating}>
                          {loading.creating ? 'Adding...' : 'Add Professor'}
                        </Button>
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
                  Professor List ({professors.length} professors)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.professors ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading professors...</p>
                    </div>
                  </div>
                ) : professors.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Primary Subject</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {professors.map((professor) => (
                          <TableRow key={professor.id}>
                            <TableCell className="font-mono text-sm">{professor.employeeId}</TableCell>
                            <TableCell className="font-medium">{professor.name}</TableCell>
                            <TableCell>{professor.email}</TableCell>
                            <TableCell>{professor.primarySubject}</TableCell>
                            <TableCell>{professor.experience} years</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span>{professor.rating.toFixed(1)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                professor.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {professor.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleDelete(professor.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No professors found</p>
                    {searchTerm && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Try adjusting your search terms
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODProfessors;