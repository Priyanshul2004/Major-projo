import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Calendar, Save } from "lucide-react";
import { useState } from "react";

const ProfessorAttendance = () => {
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});

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
    { id: 1, rollNo: "CS001", name: "John Smith", totalClasses: 45, attended: 42, percentage: 93.3 },
    { id: 2, rollNo: "CS002", name: "Emily Johnson", totalClasses: 45, attended: 38, percentage: 84.4 },
    { id: 3, rollNo: "CS003", name: "Michael Brown", totalClasses: 45, attended: 40, percentage: 88.9 },
    { id: 4, rollNo: "CS004", name: "Sarah Davis", totalClasses: 45, attended: 44, percentage: 97.8 },
    { id: 5, rollNo: "CS005", name: "Tom Wilson", totalClasses: 45, attended: 35, percentage: 77.8 },
    { id: 6, rollNo: "CS006", name: "Lisa Garcia", totalClasses: 45, attended: 41, percentage: 91.1 },
  ];

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: present
    }));
  };

  const handleSaveAttendance = () => {
    console.log("Saving attendance:", attendance);
    // Here you would typically save to a backend
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-destructive";
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = Object.keys(attendance).length - presentCount;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString()}
                </div>
                <Button onClick={handleSaveAttendance} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            </div>
            
            {Object.keys(attendance).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-2xl font-bold text-success">{presentCount}</p>
                        <p className="text-sm text-muted-foreground">Present</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <UserX className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold text-primary">{Object.keys(attendance).length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Attendance - Computer Science
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Present</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Total Classes</TableHead>
                      <TableHead>Classes Attended</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={attendance[student.id.toString()] || false}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(student.id.toString(), checked as boolean)
                            }
                          />
                        </TableCell>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfessorAttendance;