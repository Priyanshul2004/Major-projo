export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = "student" | "professor" | "hod";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any; // LucideIcon
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: any; // LucideIcon
  description?: string;
  color?: "blue" | "green" | "purple" | "orange";
  trend?: "up" | "down" | "stable";
}

export interface RoleCardProps {
  title: string;
  description: string;
  icon: any; // LucideIcon
  onClick: () => void;
  gradient?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  role: UserRole;
}
