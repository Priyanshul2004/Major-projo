import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen, CheckCircle, MessageSquare, FileText, TrendingUp, User } from "lucide-react";
import RoleCard from "./RoleCard";
import { Button } from "@/shared/components";

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "HOD/Director",
      description: "Manage the entire institution with comprehensive oversight of professors, students, and academic performance.",
      icon: GraduationCap,
      path: "/hod",
      gradient: "bg-gradient-to-br from-card to-blue-50"
    },
    {
      title: "Professor", 
      description: "Manage classes, upload study materials, track attendance, and communicate with students effectively.",
      icon: Users,
      path: "/professor",
      gradient: "bg-gradient-to-br from-card to-green-50"
    },
    {
      title: "Student",
      description: "Access study materials, submit assignments, view grades, and stay connected with your academic journey.",
      icon: BookOpen, 
      path: "/student",
      gradient: "bg-gradient-to-br from-card to-purple-50"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-accent/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-educational-blue/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-educational-purple/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-5 py-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 h-screen">
          
          {/* Left Side */}
          <div className="flex flex-col justify-center space-y-7">
            
            {/* Logo and Text */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-19 h-19 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-5 animate-bounce">
                <GraduationCap className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-5 bg-gradient-to-r from-primary via-educational-blue to-educational-purple bg-clip-text text-transparent leading-tight">
                AcademicBridge
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
                Transform your educational institution with our comprehensive management system. 
                Seamlessly connect students, professors, and administrators in one unified platform.
              </p>
              <div className="flex items-center justify-center gap-7 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-educational-green rounded-full"></div>
                  <span>Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-educational-blue rounded-full"></div>
                  <span>Easy to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-educational-purple rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Why Choose Smart Class Axis Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-5 text-foreground">
                Why Choose AcademicBridge?
              </h2>
              <p className="text-base text-muted-foreground mb-7 max-w-2xl mx-auto">
                Experience the future of educational management with our cutting-edge platform
              </p>
              
              <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto">
                <div className="p-4 bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg border border-border/50 shadow-soft backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-primary text-xl font-bold mb-1">500+</div>
                  <div className="text-xs text-muted-foreground font-medium">Students Managed</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg border border-border/50 shadow-soft backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-educational-green/20 to-educational-green/10 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-4 h-4 text-educational-green" />
                  </div>
                  <div className="text-educational-green text-xl font-bold mb-1">75+</div>
                  <div className="text-xs text-muted-foreground font-medium">Professors</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg border border-border/50 shadow-soft backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-educational-purple/20 to-educational-purple/10 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-4 h-4 text-educational-purple" />
                  </div>
                  <div className="text-educational-purple text-xl font-bold mb-1">50+</div>
                  <div className="text-xs text-muted-foreground font-medium">Subjects</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg border border-border/50 shadow-soft backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-educational-orange/20 to-educational-orange/10 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-4 h-4 text-educational-orange" />
                  </div>
                  <div className="text-educational-orange text-xl font-bold mb-1">98%</div>
                  <div className="text-xs text-muted-foreground font-medium">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center space-y-5 overflow-hidden">
            
            {/* Ready to Access Your Dashboard Card */}
            <div className="p-7 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 backdrop-blur-sm text-center max-w-sm mx-auto">
              <h2 className="text-xl font-bold mb-3 text-foreground">
                Ready to Access Your Dashboard?
              </h2>
              <p className="text-muted-foreground mb-5 text-sm">
                Sign in to your account or create a new one to get started with AcademicBridge
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                Login / Sign Up
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 max-w-sm mx-auto">
              <div className="p-4 bg-gradient-to-br from-card/50 via-card/30 to-card/20 rounded-lg border border-border/30 backdrop-blur-sm text-center">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 mx-auto">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">Real-time Tracking</h3>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Monitor attendance, assignments, and academic progress in real-time with our advanced tracking system.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-card/50 via-card/30 to-card/20 rounded-lg border border-border/30 backdrop-blur-sm text-center">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-educational-green/20 to-educational-green/10 flex items-center justify-center mb-3 mx-auto">
                  <MessageSquare className="w-4 h-4 text-educational-green" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">Seamless Communication</h3>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Connect students, professors, and administrators through our integrated communication platform.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-card/50 via-card/30 to-card/20 rounded-lg border border-border/30 backdrop-blur-sm text-center">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-educational-purple/20 to-educational-purple/10 flex items-center justify-center mb-3 mx-auto">
                  <FileText className="w-4 h-4 text-educational-purple" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">Digital Resources</h3>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Access and manage study materials, assignments, and resources from anywhere, anytime.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;