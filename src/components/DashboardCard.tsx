import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    blue: "border-educational-blue/20 bg-gradient-to-r from-blue-50 to-blue-100/50",
    green: "border-educational-green/20 bg-gradient-to-r from-green-50 to-green-100/50", 
    purple: "border-educational-purple/20 bg-gradient-to-r from-purple-50 to-purple-100/50",
    orange: "border-educational-orange/20 bg-gradient-to-r from-orange-50 to-orange-100/50"
  };

  const iconColors = {
    blue: "text-educational-blue",
    green: "text-educational-green",
    purple: "text-educational-purple", 
    orange: "text-educational-orange"
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColors[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;