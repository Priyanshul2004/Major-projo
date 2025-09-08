import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Upload, FileText, Download, Calendar, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ProfessorMaterials = () => {
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

  const materials = [
    {
      id: 1,
      title: "Introduction to Data Structures",
      description: "Comprehensive notes on arrays, linked lists, stacks, and queues",
      type: "Notes",
      subject: "Computer Science",
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
      uploadDate: "2024-03-10",
      fileSize: "0.9 MB",
      downloads: 29
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Uploading material:", data);
    setOpen(false);
    form.reset();
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "notes": return "bg-primary/10 text-primary";
      case "homework": return "bg-secondary/10 text-secondary-foreground";
      case "reference": return "bg-accent/10 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="professor" items={sidebarItems} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Study Materials</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter material title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter description"
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="notes">Notes</SelectItem>
                                <SelectItem value="homework">Homework</SelectItem>
                                <SelectItem value="reference">Reference Material</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                              <Input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Upload</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {materials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {material.title}
                      </CardTitle>
                      <Badge className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{material.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(material.uploadDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {material.fileSize}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {material.downloads} downloads
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
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

export default ProfessorMaterials;