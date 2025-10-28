import { SidebarProvider, AppSidebar, DynamicHeader } from "@/shared/components";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { GraduationCap, Search, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";

interface Student {
  id: string;
  rollNumber: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  year: number;
  semester: number;
  program: string;
  specialization: string;
  attendancePercentage: number;
  totalSubjects: number;
  status: string;
  joinDate: string;
}

const HODStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await hodService.getAllStudents(currentPage, 20, searchTerm);
      setStudents(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchStudents}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    All Students ({students.length} students)
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
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-mono text-sm">{student.rollNumber}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                      {getInitials(student.name || 'Unknown')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{student.name || 'Unknown Student'}</p>
                                    <p className="text-xs text-muted-foreground">{student.enrollmentNumber}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.program}</TableCell>
                              <TableCell>Year {student.year}</TableCell>
                              <TableCell>{student.specialization}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${student.attendancePercentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{student.attendancePercentage}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(student.status || 'unknown')}>
                                  {student.status || 'Unknown'}
                                </Badge>
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
                      <p className="text-muted-foreground">No students found</p>
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

export default HODStudents;
