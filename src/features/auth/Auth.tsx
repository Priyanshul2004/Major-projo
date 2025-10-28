import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { ROLE_OPTIONS } from "@/shared/constants";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, studentSignup, professorSignup, hodSignup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    // Student specific
    rollNumber: "",
    academicYear: "",
    semester: "",
    specialization: "",
    // Professor/HOD specific
    employeeId: "",
    qualification: "",
    experience: "",
    department: ""
  });


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Login successful!");
      const selectedRoleOption = ROLE_OPTIONS.find(role => role.value === selectedRole);
      if (selectedRoleOption) {
        navigate(selectedRoleOption.path);
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Please select your role");
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      let userData: any = {
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        password: signupForm.password
      };

      if (selectedRole === 'student') {
        userData = {
          ...userData,
          phone: signupForm.phone,
          dateOfBirth: signupForm.dateOfBirth,
          address: signupForm.address,
          rollNumber: signupForm.rollNumber,
          academicYear: signupForm.academicYear,
          semester: parseInt(signupForm.semester),
          specialization: signupForm.specialization
        };
      } else if (selectedRole === 'professor') {
        userData = {
          ...userData,
          phone: signupForm.phone,
          dateOfBirth: signupForm.dateOfBirth,
          address: signupForm.address,
          employeeId: signupForm.employeeId,
          qualification: signupForm.qualification,
          experience: parseInt(signupForm.experience),
          department: signupForm.department
        };
      } else if (selectedRole === 'hod') {
        userData = {
          ...userData,
          employeeId: signupForm.employeeId,
          phone: signupForm.phone,
          dateOfBirth: signupForm.dateOfBirth,
          address: signupForm.address,
          qualification: signupForm.qualification,
          experience: parseInt(signupForm.experience),
          department: signupForm.department
        };
      }
      
      // Debug: Log what we're sending
      console.log('Sending userData for', selectedRole, ':', userData);
      
      if (selectedRole === 'student') {
        await studentSignup(userData);
      } else if (selectedRole === 'professor') {
        await professorSignup(userData);
      } else if (selectedRole === 'hod') {
        await hodSignup(userData);
      }
      
      toast.success("Account created successfully!");
      const selectedRoleOption = ROLE_OPTIONS.find(role => role.value === selectedRole);
      if (selectedRoleOption) {
        navigate(selectedRoleOption.path);
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-educational-blue/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-educational-purple/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-educational-blue bg-clip-text text-transparent mb-2">
            Smart Class Axis
          </h1>
          <p className="text-muted-foreground">Your gateway to educational excellence</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-role">Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              <role.icon className="w-4 h-4" />
                              {role.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password (Numbers only)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your numeric password"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setLoginForm({...loginForm, password: value});
                        }}
                        pattern="[0-9]+"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="rounded border-border"
                      />
                      <Label htmlFor="remember-me" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Forgot password?
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              <role.icon className="w-4 h-4" />
                              {role.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={`${signupForm.firstName} ${signupForm.lastName}`.trim()}
                        onChange={(e) => {
                          const fullName = e.target.value;
                          const [firstName = "", lastName = ""] = fullName.split(" ");
                          setSignupForm({...signupForm, firstName, lastName});
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password (Numbers only, min 5 digits)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter 5+ digit number (e.g., 12345)"
                        className="pl-10 pr-10"
                        value={signupForm.password}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setSignupForm({...signupForm, password: value});
                        }}
                        pattern="[0-9]+"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Role-specific fields */}
                  {selectedRole && (
                    <>
                      {/* Student-specific fields */}
                      {selectedRole === 'student' && (
                        <>
                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-phone">Phone Number</Label>
                            <Input
                              id="signup-phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={signupForm.phone}
                              onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                              required
                            />
                          </div>
                          
                          {/* Date of Birth */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-dob">Date of Birth</Label>
                            <Input
                              id="signup-dob"
                              type="date"
                              value={signupForm.dateOfBirth}
                              onChange={(e) => setSignupForm({...signupForm, dateOfBirth: e.target.value})}
                              required
                            />
                          </div>
                          
                          {/* Address */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-address">Address</Label>
                            <Input
                              id="signup-address"
                              type="text"
                              placeholder="Enter your address"
                              value={signupForm.address}
                              onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="signup-roll">Roll Number</Label>
                            <Input
                              id="signup-roll"
                              type="text"
                              placeholder="Enter your roll number"
                              value={signupForm.rollNumber}
                              onChange={(e) => setSignupForm({...signupForm, rollNumber: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-year">Academic Year</Label>
                            <Select value={signupForm.academicYear} onValueChange={(value) => setSignupForm({...signupForm, academicYear: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select academic year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-semester">Semester</Label>
                            <Select value={signupForm.semester} onValueChange={(value) => setSignupForm({...signupForm, semester: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-specialization">Specialization</Label>
                            <Input
                              id="signup-specialization"
                              type="text"
                              placeholder="Enter your specialization"
                              value={signupForm.specialization}
                              onChange={(e) => setSignupForm({...signupForm, specialization: e.target.value})}
                              required
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Professor-specific fields */}
                      {selectedRole === 'professor' && (
                        <>
                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-phone">Phone Number</Label>
                            <Input
                              id="signup-phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={signupForm.phone}
                              onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                              required
                            />
                          </div>
                          
                          {/* Date of Birth */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-dob">Date of Birth</Label>
                            <Input
                              id="signup-dob"
                              type="date"
                              value={signupForm.dateOfBirth}
                              onChange={(e) => setSignupForm({...signupForm, dateOfBirth: e.target.value})}
                              required
                            />
                          </div>
                          
                          {/* Address */}
                          <div className="space-y-2">
                            <Label htmlFor="signup-address">Address</Label>
                            <Input
                              id="signup-address"
                              type="text"
                              placeholder="Enter your address"
                              value={signupForm.address}
                              onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="signup-employee">Employee ID</Label>
                            <Input
                              id="signup-employee"
                              type="text"
                              placeholder="Enter your employee ID"
                              value={signupForm.employeeId}
                              onChange={(e) => setSignupForm({...signupForm, employeeId: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-qualification">Qualification</Label>
                            <Input
                              id="signup-qualification"
                              type="text"
                              placeholder="Enter your qualification"
                              value={signupForm.qualification}
                              onChange={(e) => setSignupForm({...signupForm, qualification: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-experience">Experience (Years)</Label>
                            <Input
                              id="signup-experience"
                              type="number"
                              placeholder="Enter years of experience"
                              value={signupForm.experience}
                              onChange={(e) => setSignupForm({...signupForm, experience: e.target.value})}
                              min={0}
                              max={50}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-department">Department</Label>
                            <Input
                              id="signup-department"
                              type="text"
                              placeholder="Enter your department"
                              value={signupForm.department}
                              onChange={(e) => setSignupForm({...signupForm, department: e.target.value})}
                              required
                            />
                          </div>
                        </>
                      )}
                      
                      {/* HOD-specific fields - Only Employee ID */}
                      {selectedRole === 'hod' && (
                        <div className="space-y-2">
                          <Label htmlFor="signup-employee">Employee ID</Label>
                          <Input
                            id="signup-employee"
                            type="text"
                            placeholder="Enter your employee ID"
                            value={signupForm.employeeId}
                            onChange={(e) => setSignupForm({...signupForm, employeeId: e.target.value})}
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      type="checkbox"
                      className="rounded border-border"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
