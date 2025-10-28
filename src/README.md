# Smart Class Axis - Code Organization

This document outlines the organized folder structure of the Smart Class Axis application.

## 📁 Folder Structure

```
src/
├── features/                    # Feature-based organization
│   ├── auth/                   # Authentication feature
│   │   ├── Auth.tsx           # Main auth component
│   │   └── index.ts           # Feature exports
│   ├── dashboard/             # Dashboard feature
│   │   ├── student/           # Student dashboard pages
│   │   ├── professor/         # Professor dashboard pages
│   │   ├── hod/              # HOD dashboard pages
│   │   └── index.ts          # Feature exports
│   └── landing/              # Landing page feature
│       ├── Landing.tsx       # Main landing component
│       ├── RoleCard.tsx      # Role selection card
│       └── index.ts          # Feature exports
├── shared/                    # Shared resources
│   ├── components/           # Reusable components
│   │   ├── ui/              # UI component library
│   │   ├── AppSidebar.tsx   # Main sidebar component
│   │   ├── DashboardCard.tsx # Dashboard card component
│   │   ├── NotFound.tsx     # 404 page component
│   │   └── index.ts         # Component exports
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   └── use-toast.ts     # Toast notification hook
│   ├── utils/               # Utility functions
│   │   └── utils.ts         # Common utilities
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Type exports
│   └── constants/           # Application constants
│       └── index.ts         # Constant exports
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css               # Global styles
```

## 🎯 Key Benefits

### 1. **Feature-Based Organization**
- Each feature is self-contained with its own components and logic
- Easy to locate and modify feature-specific code
- Clear separation of concerns

### 2. **Shared Resources**
- Common components, hooks, and utilities are centralized
- Consistent imports across the application
- Easy to maintain and update shared code

### 3. **Clean Imports**
- Index files provide clean import paths
- Reduced import complexity
- Better IDE support and autocomplete

### 4. **Scalability**
- Easy to add new features
- Clear patterns for new components
- Maintainable as the application grows

## 📦 Import Patterns

### Feature Imports
```typescript
import { Auth } from "@/features/auth";
import { Landing, RoleCard } from "@/features/landing";
import { StudentDashboard, ProfessorDashboard } from "@/features/dashboard";
```

### Shared Component Imports
```typescript
import { Button, Card, Input } from "@/shared/components";
import { useMobile } from "@/shared/hooks";
import { cn } from "@/shared/utils";
```

### Type Imports
```typescript
import { User, UserRole, NavigationItem } from "@/shared/types";
```

### Constant Imports
```typescript
import { ROLE_OPTIONS, STUDENT_NAV_ITEMS } from "@/shared/constants";
```

## 🔧 Development Guidelines

1. **New Features**: Create a new folder under `features/`
2. **Shared Components**: Add to `shared/components/`
3. **Custom Hooks**: Add to `shared/hooks/`
4. **Utilities**: Add to `shared/utils/`
5. **Types**: Add to `shared/types/`
6. **Constants**: Add to `shared/constants/`

## 🚀 Benefits Achieved

- ✅ **Clean Architecture**: Clear separation of concerns
- ✅ **Maintainability**: Easy to find and modify code
- ✅ **Scalability**: Simple to add new features
- ✅ **Consistency**: Standardized import patterns
- ✅ **Developer Experience**: Better IDE support and autocomplete
- ✅ **Code Reusability**: Shared components and utilities
- ✅ **Type Safety**: Centralized type definitions
