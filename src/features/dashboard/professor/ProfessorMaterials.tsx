import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { 
  Users, 
  UserCheck, 
  Upload, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Archive, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { toast } from "sonner";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";

// Types
interface Material {
  id: string;
  title: string;
  description: string;
  type: 'notes' | 'homework' | 'reference' | 'assignment';
  subject: {
    id: string;
    name: string;
    code: string;
    department: string;
  };
  professor: {
    id: string;
    employeeId: string;
  };
  file: {
    url: string;
    name: string;
    size: number;
    type: string;
    sizeFormatted: string;
  };
  downloads: number;
  status: 'active' | 'archived';
  uploadDate: string;
  lastModified: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
}

interface MaterialStatistics {
  totalMaterials: number;
  totalDownloads: number;
  totalFileSize: number;
  totalFileSizeFormatted: string;
  materialsByType: Array<{
    type: string;
    count: number;
    totalDownloads: number;
    totalFileSize: number;
    totalFileSizeFormatted: string;
  }>;
  recentMaterials: Array<{
    id: string;
    title: string;
    type: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    downloads: number;
    uploadDate: string;
  }>;
}

const ProfessorMaterials = () => {
  const { user } = useAuth();
  console.log('=== PROFESSOR MATERIALS COMPONENT LOADED ===');
  console.log('User object:', user);
  console.log('User ID:', user?.id);
  console.log('User role:', user?.role);
  console.log('Component timestamp:', new Date().toISOString());
  
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [statistics, setStatistics] = useState<MaterialStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { toast } = useToast();
  const form = useForm();
  const editForm = useForm();


  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  // Fetch materials
  const fetchMaterials = async () => {
    console.log('=== FETCH MATERIALS CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Current page:', currentPage);
    console.log('Search term:', searchTerm);
    console.log('Type filter:', typeFilter);
    console.log('Subject filter:', subjectFilter);
    console.log('Status filter:', statusFilter);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchMaterials');
      return;
    }
    
    try {
      console.log('Setting loading state to true');
      setLoading(true);
      
      console.log('Calling professorService.getMyMaterials...');
      const response = await professorService.getMyMaterials(
        user.id,
        currentPage,
        10,
        searchTerm,
        typeFilter,
        subjectFilter,
        statusFilter
      );
      console.log('Materials response:', response);
      
      setMaterials(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      console.log('Materials data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING MATERIALS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load materials');
    } finally {
      console.log('Setting loading state to false');
      setLoading(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    console.log('=== FETCH SUBJECTS CALLED ===');
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchSubjects');
      return;
    }
    
    try {
      console.log('Calling professorService.getProfessorSubjects...');
      const response = await professorService.getProfessorSubjects(user.id);
      console.log('Subjects response:', response);
      
      setSubjects(response.data || []);
      console.log('Subjects data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING SUBJECTS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load subjects');
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    console.log('=== FETCH STATISTICS CALLED ===');
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchStatistics');
      return;
    }
    
    try {
      console.log('Calling professorService.getMaterialStatistics...');
      const response = await professorService.getMaterialStatistics(user.id);
      console.log('Statistics response:', response);
      
      setStatistics(response.data || null);
      console.log('Statistics data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING STATISTICS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load statistics');
    }
  };

  // Upload material
  const uploadMaterial = async (data: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('subjectId', data.subjectId);
      formData.append('file', data.file[0]);

      const response = await fetch(`${API_BASE}/professor/${user.id}/materials`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Material uploaded successfully",
        });
    setOpen(false);
    form.reset();
        fetchMaterials();
        fetchStatistics();
      } else {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload material",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Update material
  const updateMaterial = async (data: any) => {
    try {
      setUploading(true);
      const response = await fetch(`${API_BASE}/professor/materials/${selectedMaterial?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Material updated successfully",
        });
        setEditOpen(false);
        editForm.reset();
        setSelectedMaterial(null);
        fetchMaterials();
      } else {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update material",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete material
  const deleteMaterial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`${API_BASE}/professor/materials/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Material deleted successfully",
        });
        fetchMaterials();
        fetchStatistics();
      } else {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive"
      });
    }
  };

  // Toggle material status
  const toggleMaterialStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'archived' : 'active';
      const response = await fetch(`${API_BASE}/professor/materials/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: `Material ${newStatus === 'active' ? 'activated' : 'archived'} successfully`,
        });
        fetchMaterials();
        fetchStatistics();
      } else {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update material status",
        variant: "destructive"
      });
    }
  };

  // Download material
  const downloadMaterial = async (id: string, filename: string) => {
    try {
      const response = await fetch(`${API_BASE}/professor/materials/${id}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "Material downloaded successfully",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download material",
        variant: "destructive"
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    editForm.reset({
      title: material.title,
      description: material.description,
      type: material.type,
      subjectId: material.subject.id
    });
    setEditOpen(true);
  };

  // Effects
  useEffect(() => {
    console.log('useEffect - fetchMaterials triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchMaterials();
      fetchSubjects();
      fetchStatistics();
    }
  }, [user?.id, currentPage, searchTerm, typeFilter, subjectFilter, statusFilter]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "notes": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "homework": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "reference": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
              <h1 className="text-3xl font-bold text-foreground">Study Materials</h1>
                <p className="text-muted-foreground mt-2">Manage and organize your study materials</p>
              </div>
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
                    <form onSubmit={form.handleSubmit(uploadMaterial)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Title is required" }}
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
                        rules={{ required: "Description is required" }}
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
                        rules={{ required: "Type is required" }}
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
                                <SelectItem value="assignment">Assignment</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subjectId"
                        rules={{ required: "Subject is required" }}
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
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name} ({subject.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="file"
                        rules={{ required: "File is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                                onChange={(e) => field.onChange(e.target.files)}
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
                        <Button type="submit" disabled={uploading}>
                          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Upload
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Materials</p>
                        <p className="text-2xl font-bold">{statistics.totalMaterials}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Download className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                        <p className="text-2xl font-bold">{statistics.totalDownloads}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Archive className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                        <p className="text-2xl font-bold">{statistics.totalFileSizeFormatted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Active Materials</p>
                        <p className="text-2xl font-bold">
                          {statistics.materialsByType.reduce((acc, item) => acc + item.count, 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
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
              <Select value={subjectFilter || "all"} onValueChange={(value) => setSubjectFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Materials List */}
            <div className="space-y-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-1/4" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : materials.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No materials found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || typeFilter || subjectFilter 
                        ? "Try adjusting your filters to see more results."
                        : "Upload your first study material to get started."
                      }
                    </p>
                    {!searchTerm && !typeFilter && !subjectFilter && (
                      <Button onClick={() => setOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Material
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                materials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5" />
                        {material.title}
                      </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {material.subject.name} ({material.subject.code})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                          <Badge className={getStatusColor(material.status)}>
                            {material.status}
                          </Badge>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{material.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(material.uploadDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                            {material.file.sizeFormatted}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {material.downloads} downloads
                        </div>
                      </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadMaterial(material.id, material.file.name)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(material)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleMaterialStatus(material.id, material.status)}
                          >
                            {material.status === 'active' ? (
                              <Archive className="h-3 w-3" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteMaterial(material.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
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

      {/* Edit Material Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(updateMaterial)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                rules={{ required: "Title is required" }}
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
                control={editForm.control}
                name="description"
                rules={{ required: "Description is required" }}
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
                control={editForm.control}
                name="type"
                rules={{ required: "Type is required" }}
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
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="subjectId"
                rules={{ required: "Subject is required" }}
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
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default ProfessorMaterials;