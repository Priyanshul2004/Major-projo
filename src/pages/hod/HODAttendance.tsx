import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap } from "lucide-react";

const HODAttendance = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/hod", icon: Users },
    { title: "Attendance", url: "/hod/attendance", icon: Users },
    { title: "Professor Management", url: "/hod/professors", icon: GraduationCap },
    { title: "Exam Results", url: "/hod/results", icon: Users },
    { title: "Notices", url: "/hod/notices", icon: Users },
  ];

  const studentAttendance = [
    { id: 1, name: "John Smith", rollNo: "CS001", totalClasses: 45, attended: 42, percentage: 93.3 },
    { id: 2, name: "Emily Johnson", rollNo: "CS002", totalClasses: 45, attended: 38, percentage: 84.4 },
    { id: 3, name: "Michael Brown", rollNo: "CS003", totalClasses: 45, attended: 40, percentage: 88.9 },
    { id: 4, name: "Sarah Davis", rollNo: "CS004", totalClasses: 45, attended: 44, percentage: 97.8 },
  ];

  const professorAttendance = [
    { id: 1, name: "Dr. Alice Wilson", subject: "Computer Science", totalClasses: 50, conducted: 48, percentage: 96.0 },
    { id: 2, name: "Prof. Robert Lee", subject: "Mathematics", totalClasses: 45, conducted: 43, percentage: 95.6 },
    { id: 3, name: "Dr. Lisa Garcia", subject: "Physics", totalClasses: 40, conducted: 37, percentage: 92.5 },
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Attendance Management</h1>
            
            <Tabs defaultValue="students" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="students">Student Attendance</TabsTrigger>
                <TabsTrigger value="professors">Professor Attendance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Student Attendance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Total Classes</TableHead>
                          <TableHead>Classes Attended</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentAttendance.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rollNo}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.totalClasses}</TableCell>
                            <TableCell>{student.attended}</TableCell>
                            <TableCell className={getAttendanceColor(student.percentage)}>
                              {student.percentage}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="professors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Professor Attendance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Professor Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Total Classes</TableHead>
                          <TableHead>Classes Conducted</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {professorAttendance.map((professor) => (
                          <TableRow key={professor.id}>
                            <TableCell className="font-medium">{professor.name}</TableCell>
                            <TableCell>{professor.subject}</TableCell>
                            <TableCell>{professor.totalClasses}</TableCell>
                            <TableCell>{professor.conducted}</TableCell>
                            <TableCell className={getAttendanceColor(professor.percentage)}>
                              {professor.percentage}%
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

export default HODAttendance;