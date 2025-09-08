import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient?: string;
}

const RoleCard = ({ title, description, icon: Icon, onClick, gradient = "bg-gradient-to-br from-card to-accent" }: RoleCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${gradient}`}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <Button 
          onClick={onClick}
          variant="educational"
          size="lg"
          className="w-full"
        >
          Enter {title} Panel
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;