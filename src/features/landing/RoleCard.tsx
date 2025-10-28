import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { LucideIcon, ArrowRight, Sparkles } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient?: string;
}

const RoleCard = ({ title, description, icon: Icon, onClick, gradient = "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" }: RoleCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden border-2 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm ${gradient} hover:border-blue-300 dark:hover:border-blue-600`}>
      {/* Animated background decoration */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Sparkle effect */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
      </div>
      
      <CardContent className="p-10 text-center space-y-8 relative z-10">
        {/* Icon container with enhanced animation */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-blue-500/20 group-hover:shadow-blue-500/40">
          <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300 text-lg">
            {description}
          </p>
        </div>
        
        {/* Enhanced button */}
        <Button 
          onClick={onClick}
          className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          size="lg"
        >
          <span className="flex items-center justify-center gap-3">
            Enter {title} Panel
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
    </Card>
  );
};

export default RoleCard;