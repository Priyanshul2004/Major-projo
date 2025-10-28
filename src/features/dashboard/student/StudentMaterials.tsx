import { SidebarProvider, SidebarTrigger, AppSidebar, Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components";
import { Download, FileText, Calendar, Search, BookOpen, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/shared/constants";

const StudentMaterials = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.id) {
      fetchMaterials();
    }
  }, [user?.id, currentPage, searchQuery, selectedType, selectedSubject]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyMaterials(
        currentPage,
        20,
        searchQuery,
        selectedSubject === "all" ? "" : selectedSubject,
        selectedType === "all" ? "" : selectedType
      );
      
      setMaterials(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching materials:', error);
      toast.error(error.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (materialId: string) => {
    try {
      await studentService.downloadMaterial(materialId);
      toast.success('Material downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading material:', error);
      toast.error(error.message || 'Failed to download material');
    }
  };

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
        <AppSidebar role="student" items={STUDENT_NAV_ITEMS} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Study Materials</h1>
                <p className="text-muted-foreground mt-2">Access your course materials and resources</p>
              </div>
              <SidebarTrigger />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="homework">Homework</SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchMaterials}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Materials Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading materials...</p>
              </div>
            ) : materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material: any) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {material.description}
                          </p>
                        </div>
                        <Badge className={`ml-2 ${getTypeColor(material.type)}`}>
                          {material.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subject:</span>
                          <Badge variant="outline" className={getSubjectColor(material.subject)}>
                            {material.subject}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Professor:</span>
                          <span className="font-medium">{material.uploadedBy}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span>{new Date(material.uploadedDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">File Type:</span>
                          <span className="font-medium">{material.type}</span>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <Button
                            onClick={() => handleDownload(material.id)}
                            className="w-full"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Materials Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedType || selectedSubject
                    ? "Try adjusting your search filters"
                    : "No study materials have been uploaded yet"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentMaterials;