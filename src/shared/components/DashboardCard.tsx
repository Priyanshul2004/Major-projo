import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "green" | "purple" | "orange";
  trend?: "up" | "down" | "stable";
}

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  color = "blue",
  trend 
}: DashboardCardProps) => {
  const colorClasses = {
    blue: "border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm shadow-lg shadow-primary/10",
    green: "border-educational-green/30 bg-gradient-to-br from-educational-green/10 via-educational-green/5 to-transparent backdrop-blur-sm shadow-lg shadow-educational-green/10", 
    purple: "border-educational-purple/30 bg-gradient-to-br from-educational-purple/10 via-educational-purple/5 to-transparent backdrop-blur-sm shadow-lg shadow-educational-purple/10",
    orange: "border-educational-orange/30 bg-gradient-to-br from-educational-orange/10 via-educational-orange/5 to-transparent backdrop-blur-sm shadow-lg shadow-educational-orange/10"
  };

  const iconColors = {
    blue: "text-primary drop-shadow-sm",
    green: "text-educational-green drop-shadow-sm",
    purple: "text-educational-purple drop-shadow-sm", 
    orange: "text-educational-orange drop-shadow-sm"
  };

  const iconBackgrounds = {
    blue: "bg-gradient-to-br from-primary/20 to-primary/10",
    green: "bg-gradient-to-br from-educational-green/20 to-educational-green/10",
    purple: "bg-gradient-to-br from-educational-purple/20 to-educational-purple/10",
    orange: "bg-gradient-to-br from-educational-orange/20 to-educational-orange/10"
  };

  return (
    <Card className={`transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group relative overflow-hidden ${colorClasses[color]}`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconBackgrounds[color]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors duration-300">
            {description}
          </p>
        )}
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default DashboardCard;