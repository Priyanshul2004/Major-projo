import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Download, FileText, Calendar, Search, BookOpen } from "lucide-react";
import { useState } from "react";

const StudentMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { title: "Dashboard", url: "/student", icon: Users },
    { title: "Study Material", url: "/student/materials", icon: BookOpen },
    { title: "Assignments", url: "/student/assignments", icon: Users },
    { title: "Attendance", url: "/student/attendance", icon: Users },
    { title: "Communication", url: "/student/communication", icon: Users },
  ];

  const materials = [
    {
      id: 1,
      title: "Introduction to Data Structures",
      description: "Comprehensive notes on arrays, linked lists, stacks, and queues",
      type: "Notes",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      uploadDate: "2024-03-01",
      fileSize: "2.5 MB",
      downloads: 45
    },
    {
      id: 2,
      title: "Algorithm Analysis Homework",
      description: "Practice problems on time complexity and space complexity analysis",
      type: "Homework",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      uploadDate: "2024-03-05",
      fileSize: "1.8 MB",
      downloads: 38
    },
    {
      id: 3,
      title: "Object-Oriented Programming Concepts",
      description: "Detailed explanation of OOP principles with examples",
      type: "Notes",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      uploadDate: "2024-03-08",
      fileSize: "3.2 MB",
      downloads: 52
    },
    {
      id: 4,
      title: "Database Design Assignment",
      description: "Create an ER diagram for a library management system",
      type: "Homework",
      subject: "Computer Science",
      professor: "Dr. Alice Wilson",
      uploadDate: "2024-03-10",
      fileSize: "0.9 MB",
      downloads: 29
    },
    {
      id: 5,
      title: "Linear Algebra Fundamentals",
      description: "Basic concepts of vectors, matrices, and linear transformations",
      type: "Notes",
      subject: "Mathematics",
      professor: "Prof. Robert Lee",
      uploadDate: "2024-03-02",
      fileSize: "4.1 MB",
      downloads: 67
    },
    {
      id: 6,
      title: "Calculus Practice Problems",
      description: "Integration and differentiation exercises with solutions",
      type: "Homework",
      subject: "Mathematics",
      professor: "Prof. Robert Lee",
      uploadDate: "2024-03-06",
      fileSize: "2.3 MB",
      downloads: 43
    }
  ];

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "notes": return "bg-primary/10 text-primary";
      case "homework": return "bg-secondary/10 text-secondary-foreground";
      case "reference": return "bg-accent/10 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "computer science": return "bg-blue-100 text-blue-800";
      case "mathematics": return "bg-green-100 text-green-800";
      case "physics": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Study Materials</h1>
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredMaterials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {material.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(material.type)}>
                          {material.type}
                        </Badge>
                        <Badge className={getSubjectColor(material.subject)}>
                          {material.subject}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{material.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(material.uploadDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {material.fileSize}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {material.professor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {material.downloads} downloads
                        </div>
                      </div>
                      <Button className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredMaterials.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No materials found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentMaterials;