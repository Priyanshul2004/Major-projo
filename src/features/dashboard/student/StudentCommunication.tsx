import { SidebarProvider, SidebarTrigger, AppSidebar, Button, Card, CardContent, CardHeader, CardTitle, Textarea, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from "@/shared/components";
import { Users, MessageCircle, Plus, Calendar, User, Clock, BookOpen, Search, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/shared/constants";

const StudentCommunication = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();

  useEffect(() => {
    if (user?.id) {
      fetchCommunications();
    }
  }, [user?.id, currentPage, searchQuery, selectedStatus, selectedSubject]);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudentDoubts(
        currentPage,
        20,
        searchQuery,
        selectedStatus === "all" ? "" : selectedStatus,
        "", // priority
        selectedSubject === "all" ? "" : selectedSubject
      );
      
      setCommunications(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching communications:', error);
      toast.error(error.message || 'Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await studentService.askDoubt({
        subject: data.subject || 'General Doubt',
        message: data.message,
        subjectId: data.subjectId
      });
      
      toast.success('Doubt submitted successfully');
    setOpen(false);
    form.reset();
      fetchCommunications();
    } catch (error: any) {
      console.error('Error submitting doubt:', error);
      toast.error(error.message || 'Failed to submit doubt');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "replied": return "bg-green-100 text-green-800";
      case "resolved": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" items={STUDENT_NAV_ITEMS} />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
              <h1 className="text-3xl font-bold text-foreground">Communication & Doubts</h1>
                <p className="text-muted-foreground mt-2">Ask questions and communicate with your professors</p>
              </div>
              <div className="flex items-center gap-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                    Ask Doubt
                  </Button>
                </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Ask a Doubt</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter subject/topic" {...field} />
                              </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                        
                      <FormField
                        control={form.control}
                          name="subjectId"
                        render={({ field }) => (
                          <FormItem>
                              <FormLabel>Related Subject (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="computer-science">Computer Science</SelectItem>
                                  <SelectItem value="mathematics">Mathematics</SelectItem>
                                  <SelectItem value="physics">Physics</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                        
                      <FormField
                        control={form.control}
                          name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Question</FormLabel>
                            <FormControl>
                              <Textarea 
                                  placeholder="Describe your doubt or question in detail..."
                                  className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                        
                        <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                          <Button type="submit">Submit Doubt</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
                <SidebarTrigger />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search communications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
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
                onClick={fetchCommunications}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {/* Communications List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading communications...</p>
              </div>
            ) : communications.length > 0 ? (
            <div className="space-y-6">
                {communications.map((comm: any) => (
                  <Card key={comm.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{comm.subject}</CardTitle>
                            <Badge className={getStatusColor(comm.status)}>
                              {comm.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(comm.askedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{comm.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {comm.priority}
                        </Badge>
                      </div>
                    </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Your Question:</h4>
                          <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            {comm.question}
                          </p>
                        </div>
                        
                        {comm.reply && comm.reply.content && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Professor's Response:</h4>
                            <p className="text-foreground bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                              {comm.reply.content}
                            </p>
                          </div>
                        )}
                        
                        {(!comm.reply || !comm.reply.content) && comm.status === 'pending' && (
                          <div className="text-center py-4">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Waiting for professor's response...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Communications Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedStatus || selectedSubject
                    ? "Try adjusting your search filters"
                    : "You haven't asked any doubts yet. Click 'Ask Doubt' to get started!"}
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

export default StudentCommunication;