# Smart Class Axis - Routing Documentation

This document outlines the complete routing structure of the Smart Class Axis application.

## 🛣️ Route Structure

### Public Routes
- **`/`** - Landing page (home page with role selection)
- **`/auth`** - Authentication page (login/signup)

### HOD (Head of Department) Routes
- **`/hod`** - HOD Dashboard (main overview)
- **`/hod/attendance`** - Attendance management
- **`/hod/professors`** - Professor management
- **`/hod/students`** - Student management
- **`/hod/results`** - Exam results overview
- **`/hod/notices`** - Notice management

### Professor Routes
- **`/professor`** - Professor Dashboard (main overview)
- **`/professor/attendance`** - Class attendance tracking
- **`/professor/classes`** - Class management
- **`/professor/students`** - Student management (same as classes)
- **`/professor/materials`** - Study materials management
- **`/professor/assignments`** - Assignment management
- **`/professor/results`** - Student results management
- **`/professor/communication`** - Communication with students

### Student Routes
- **`/student`** - Student Dashboard (main overview)
- **`/student/subjects`** - Subject materials (same as materials)
- **`/student/materials`** - Study materials access
- **`/student/assignments`** - Assignment submissions
- **`/student/attendance`** - Personal attendance view
- **`/student/results`** - Personal exam results
- **`/student/communication`** - Communication with professors

### Error Routes
- **`*`** - 404 Not Found page

## 🧭 Navigation Structure

### Sidebar Navigation Items

#### Student Navigation
```typescript
[
  { title: "Dashboard", url: "/student", icon: TrendingUp },
  { title: "Subjects", url: "/student/subjects", icon: BookOpen },
  { title: "Assignments", url: "/student/assignments", icon: FileText },
  { title: "Attendance", url: "/student/attendance", icon: CheckCircle },
  { title: "Results", url: "/student/results", icon: TrendingUp },
  { title: "Communication", url: "/student/communication", icon: MessageSquare }
]
```

#### Professor Navigation
```typescript
[
  { title: "Dashboard", url: "/professor", icon: TrendingUp },
  { title: "Attendance", url: "/professor/attendance", icon: CheckCircle },
  { title: "Classes", url: "/professor/classes", icon: Users },
  { title: "Materials", url: "/professor/materials", icon: FileText },
  { title: "Assignments", url: "/professor/assignments", icon: BookOpen },
  { title: "Results", url: "/professor/results", icon: TrendingUp }
]
```

#### HOD Navigation
```typescript
[
  { title: "Dashboard", url: "/hod", icon: TrendingUp },
  { title: "Professors", url: "/hod/professors", icon: Users },
  { title: "Students", url: "/hod/students", icon: GraduationCap },
  { title: "Attendance", url: "/hod/attendance", icon: Calendar },
  { title: "Exam Results", url: "/hod/results", icon: BookOpen },
  { title: "Notices", url: "/hod/notices", icon: MessageSquare }
]
```

## 🔄 Navigation Flow

### Authentication Flow
1. **Landing Page** (`/`) → User selects role and clicks "Login / Sign Up"
2. **Auth Page** (`/auth`) → User logs in/signs up with role selection
3. **Dashboard Redirect** → Based on selected role:
   - Student → `/student`
   - Professor → `/professor`
   - HOD → `/hod`

### Dashboard Navigation
- All dashboard pages use the `AppSidebar` component for consistent navigation
- Sidebar items use `NavLink` for active state management
- Each role has its own navigation items defined in constants
- Logout redirects to landing page (`/`)

## 🛡️ Route Protection

Currently, the application uses basic routing without authentication guards. Future enhancements could include:
- Route protection based on user authentication status
- Role-based access control
- Redirect to login for protected routes

## 📱 Responsive Navigation

- **Desktop**: Full sidebar with labels and icons
- **Mobile**: Collapsible sidebar with icon-only view
- **Header**: Consistent across all dashboard pages with user profile dropdown

## 🔧 Technical Implementation

### Router Setup
```typescript
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    
    {/* Role-based Routes */}
    {/* HOD, Professor, Student routes */}
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Navigation Component
- Uses `react-router-dom`'s `NavLink` for active state
- Implements smooth transitions and hover effects
- Role-specific icons and labels
- Responsive design with mobile support

## 🚀 Future Enhancements

1. **Route Guards**: Implement authentication and authorization
2. **Lazy Loading**: Code-split routes for better performance
3. **Breadcrumbs**: Add breadcrumb navigation for deep routes
4. **Route Animations**: Add page transition animations
5. **Deep Linking**: Support for direct URL access to specific pages

## 📋 Route Testing Checklist

- [ ] Landing page loads correctly
- [ ] Auth page accessible from landing page
- [ ] Role-based dashboard redirects work
- [ ] All sidebar navigation items work
- [ ] Logout redirects to landing page
- [ ] 404 page shows for invalid routes
- [ ] Mobile navigation works properly
- [ ] Active states show correctly in sidebar
