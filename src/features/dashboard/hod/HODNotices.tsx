import { SidebarProvider, AppSidebar, DynamicHeader, Button, Card, CardContent, CardHeader, CardTitle, Textarea, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components";
import { Users, GraduationCap, Plus, Calendar, User, Search, RefreshCw, Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { HOD_NAV_ITEMS } from "@/shared/constants";
import { hodService } from "@/services/hodService";
import { toast } from "sonner";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: string;
  category: string;
}

const HODNotices = () => {
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState({
    notices: false,
    creating: false
  });
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();

  useEffect(() => {
    fetchNotices();
  }, [currentPage, filters]);

  const fetchNotices = async () => {
    try {
      setLoading(prev => ({ ...prev, notices: true }));
      const response = await hodService.getAllNotices(
        currentPage,
        10,
        filters.priority === 'all' ? '' : filters.priority,
        filters.category === 'all' ? '' : filters.category,
        filters.search
      );
      setNotices(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('Error fetching notices:', error);
      toast.error(error.message || 'Failed to load notices');
    } finally {
      setLoading(prev => ({ ...prev, notices: false }));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, creating: true }));
      await hodService.createNotice({
        title: data.title,
        content: data.content,
        priority: data.priority,
        category: data.category,
        authorId: 'current-user-id' // In real app, this would be the current user's ID
      });
      toast.success('Notice created successfully!');
      setOpen(false);
      form.reset();
      fetchNotices(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating notice:', error);
      toast.error(error.message || 'Failed to create notice');
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "academic": return "bg-blue-100 text-blue-800";
      case "general": return "bg-gray-100 text-gray-800";
      case "event": return "bg-purple-100 text-purple-800";
      case "health": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="hod" items={HOD_NAV_ITEMS} />
        
        <main className="flex-1">
          <DynamicHeader role="hod" />
          <div className="p-6 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search notices..."
                      value={filters.search}
                      onChange={handleSearch}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchNotices}
                    disabled={loading.notices}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading.notices ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Notice
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Notice</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notice Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter notice title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notice Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter notice content"
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Academic">Academic</SelectItem>
                                  <SelectItem value="General">General</SelectItem>
                                  <SelectItem value="Event">Event</SelectItem>
                                  <SelectItem value="Health">Health</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading.creating}>
                          {loading.creating ? 'Publishing...' : 'Publish Notice'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {loading.notices ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading notices...</p>
                  </div>
                </div>
              ) : notices.length > 0 ? (
                <>
                  {notices.map((notice) => (
                    <Card key={notice.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{notice.title}</CardTitle>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(notice.priority)}>
                              {notice.priority}
                            </Badge>
                            <Badge className={getCategoryColor(notice.category)}>
                              {notice.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{notice.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {notice.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(notice.date).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
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
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No notices found</p>
                  {filters.search && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search terms or filters
                    </p>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HODNotices;