import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { ROLE_LABELS, ROLE_ICONS } from "@/shared/constants";

interface AppSidebarProps {
  role: "hod" | "professor" | "student";
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export function AppSidebar({ role, items }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium shadow-lg shadow-primary/25 border-l-4 border-primary-foreground/30" 
      : "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/20 hover:border-l-4 hover:border-accent-foreground/20";
  };


  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300`}>
      <SidebarContent className="bg-gradient-to-b from-sidebar-background via-sidebar-background/95 to-sidebar-background/90 border-r border-sidebar-border/50 backdrop-blur-sm">
        <SidebarGroup className="p-4">
          <SidebarGroupLabel className="text-sidebar-foreground font-bold text-lg mb-6 flex items-center gap-3">
            {!collapsed && (
              <>
                <span className="text-2xl">{ROLE_ICONS[role]}</span>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {ROLE_LABELS[role]}
                </span>
              </>
            )}
            {collapsed && <span className="text-2xl">{ROLE_ICONS[role]}</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items?.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg mx-2">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavCls(item.url)} flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="relative z-10">
                        <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      {!collapsed && (
                        <span className="relative z-10 font-medium transition-all duration-300">
                          {item.title}
                        </span>
                      )}
                      {/* Subtle background glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Decorative bottom section */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border/30">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">SC</span>
              </div>
              <p className="text-xs text-sidebar-foreground/60 font-medium">Smart Class</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}