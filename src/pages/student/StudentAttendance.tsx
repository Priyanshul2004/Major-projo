import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp, TrendingDown, BookOpen, PieChart } from "lucide-react";

const StudentAttendance = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/student", icon: Users },
    { title: "Study Material", url: "/student/materials", icon: BookOpen },
    { title: "Assignments", url: "/student/assignments", icon: Users },
    { title: "Attendance", url: "/student/attendance", icon: Users },
    { title: "Communication", url: "/student/communication", icon: Users },
  ];

  const attendanceData = [
    { subject: "Computer Science", totalClasses: 45, attended: 42, percentage: 93.3, professor: "Dr. Alice Wilson" },
    { subject: "Mathematics", totalClasses: 40, attended: 35, percentage: 87.5, professor: "Prof. Robert Lee" },
    { subject: "Physics", totalClasses: 38, attended: 30, percentage: 78.9, professor: "Dr. Lisa Garcia" },
    { subject: "Chemistry", totalClasses: 35, attended: 32, percentage: 91.4, professor: "Prof. James Miller" },
  ];

  const recentAttendance = [
    { date: "2024-03-15", subject: "Computer Science", status: "Present" },
    { date: "2024-03-15", subject: "Mathematics", status: "Present" },
    { date: "2024-03-14", subject: "Physics", status: "Absent" },
    { date: "2024-03-14", subject: "Chemistry", status: "Present" },
    { date: "2024-03-13", subject: "Computer Science", status: "Present" },
    { date: "2024-03-13", subject: "Mathematics", status: "Absent" },
    { date: "2024-03-12", subject: "Physics", status: "Present" },
    { date: "2024-03-12", subject: "Chemistry", status: "Present" },
  ];

  const overallAttendance = attendanceData.reduce((acc, curr) => {
    acc.totalClasses += curr.totalClasses;
    acc.attended += curr.attended;
    return acc;
  }, { totalClasses: 0, attended: 0 });

  const overallPercentage = (overallAttendance.attended / overallAttendance.totalClasses) * 100;

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-destructive";
  };

  const getStatusColor = (status: string) => {
    return status === "Present" 
      ? "bg-success/10 text-success" 
      : "bg-destructive/10 text-destructive";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 75) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">My Attendance</h1>
            
            {/* Overall Attendance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Overall Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getAttendanceColor(overallPercentage)}`}>
                      {overallPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {overallAttendance.attended}/{overallAttendance.totalClasses} classes
                    </div>
                    <Progress 
                      value={overallPercentage} 
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-success">{overallAttendance.attended}</p>
                      <p className="text-sm text-muted-foreground">Classes Attended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold text-destructive">
                        {overallAttendance.totalClasses - overallAttendance.attended}
                      </p>
                      <p className="text-sm text-muted-foreground">Classes Missed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Subject-wise Attendance */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subject-wise Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Total Classes</TableHead>
                      <TableHead>Classes Attended</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.professor}</TableCell>
                        <TableCell>{subject.totalClasses}</TableCell>
                        <TableCell>{subject.attended}</TableCell>
                        <TableCell className={getAttendanceColor(subject.percentage)}>
                          {subject.percentage}%
                        </TableCell>
                        <TableCell>
                          <Progress value={subject.percentage} className="w-20" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Attendance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAttendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
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

export default StudentAttendance;