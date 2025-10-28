import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Badge } from "@/shared/components/ui/badge";
import { MessageCircle, Reply, Calendar, User, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { professorService } from "@/services/professorService";
import { toast } from "sonner";
import { PROFESSOR_NAV_ITEMS } from "@/shared/constants";

const ProfessorCommunication = () => {
  const { user } = useAuth();
  console.log('=== PROFESSOR COMMUNICATION COMPONENT LOADED ===');
  console.log('User object:', user);
  console.log('User ID:', user?.id);
  console.log('User role:', user?.role);
  console.log('Component timestamp:', new Date().toISOString());
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const form = useForm();


  // Fetch communications
  const fetchCommunications = async () => {
    console.log('=== FETCH COMMUNICATIONS CALLED ===');
    console.log('User ID:', user?.id);
    console.log('Current page:', currentPage);
    console.log('Search term:', searchTerm);
    console.log('Selected status:', selectedStatus);
    console.log('Selected priority:', selectedPriority);
    
    if (!user?.id) {
      console.log('No user ID, skipping fetchCommunications');
      return;
    }
    
    try {
      console.log('Setting loading state to true');
      setLoading(true);
      
      console.log('Calling professorService.getAllStudentDoubts...');
      const response = await professorService.getAllStudentDoubts(
        currentPage,
        10,
        searchTerm,
        selectedStatus,
        selectedPriority
      );
      console.log('Communications response:', response);
      
      setCommunications(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      console.log('Communications data set successfully');
    } catch (error: any) {
      console.error('=== ERROR FETCHING COMMUNICATIONS ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to load communications');
    } finally {
      console.log('Setting loading state to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect - fetchCommunications triggered, user?.id:', user?.id);
    if (user?.id) {
      fetchCommunications();
    }
  }, [user?.id, currentPage, searchTerm, selectedStatus, selectedPriority]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log('=== SUBMITTING REPLY ===');
      console.log('Replying to communication ID:', replyingTo);
      console.log('Reply data:', data);
      console.log('User ID:', user?.id);
      
      await professorService.replyToStudentDoubt(replyingTo, data.reply, user.id);
      toast.success('Reply sent successfully!');
      setReplyingTo(null);
      form.reset();
      fetchCommunications();
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-warning/10 text-warning";
      case "replied": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-warning/10 text-warning";
      case "low": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Student Communication</h1>
            
            <div className="space-y-6">
              {communications.map((doubt) => (
                <Card key={doubt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {doubt.subject}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(doubt.priority)}>
                          {doubt.priority}
                        </Badge>
                        <Badge className={getStatusColor(doubt.status)}>
                          {doubt.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {doubt.student?.name || 'Unknown Student'} ({doubt.student?.rollNo || 'N/A'})
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doubt.askedDate)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Student Question:</p>
                        <p className="text-muted-foreground">{doubt.question}</p>
                      </div>
                      
                      {doubt.reply && doubt.reply.content ? (
                        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="h-4 w-4" />
                            <p className="text-sm font-medium">Reply by {doubt.reply.repliedBy}:</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Clock className="h-3 w-3" />
                              {formatDate(doubt.reply.repliedDate)}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{doubt.reply.content}</p>
                        </div>
                      ) : doubt.status === 'pending' ? (
                        <div className="flex justify-end">
                          <Dialog 
                            open={replyingTo === doubt.id} 
                            onOpenChange={(open) => setReplyingTo(open ? doubt.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button className="flex items-center gap-2">
                                <Reply className="h-4 w-4" />
                                Reply to Student
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Reply to {doubt.student?.name || 'Student'}</DialogTitle>
                              </DialogHeader>
                              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium mb-1">Student Question:</p>
                                <p className="text-sm text-muted-foreground">{doubt.question}</p>
                              </div>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="reply"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Your Reply</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Type your response here..."
                                            rows={5}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setReplyingTo(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit">Send Reply</Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : null}
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

export default ProfessorCommunication;