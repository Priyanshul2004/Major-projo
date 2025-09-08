import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import RoleCard from "@/components/RoleCard";

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
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-educational-blue bg-clip-text text-transparent">
            Smart Classroom Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Streamline your educational institution with our comprehensive management system. 
            Choose your role to access personalized dashboard and tools.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <RoleCard
              key={role.title}
              title={role.title}
              description={role.description}
              icon={role.icon}
              onClick={() => navigate(role.path)}
              gradient={role.gradient}
            />
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Comprehensive Educational Management
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg shadow-soft">
              <div className="text-educational-blue text-2xl font-bold">100+</div>
              <div className="text-sm text-muted-foreground">Students Managed</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-soft">
              <div className="text-educational-green text-2xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Professors</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-soft">
              <div className="text-educational-purple text-2xl font-bold">25+</div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-soft">
              <div className="text-educational-orange text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;