 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 import { AdminLayout } from "@/components/layout/AdminLayout";
 import Login from "./pages/Login";
 import Dashboard from "./pages/Dashboard";
 import Courses from "./pages/Courses";
 import StudentRegistration from "./pages/StudentRegistration";
 import StudentList from "./pages/StudentList";
 import StudentProfile from "./pages/StudentProfile";
 import Enrollment from "./pages/Enrollment";
 import AuditLogs from "./pages/AuditLogs";
 import NotFound from "./pages/NotFound";
 import Signup from "./pages/Signup";
 const queryClient = new QueryClient();
 
 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <Sonner />
       <BrowserRouter>
         <Routes>
           {/* Public Route */}
           <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           {/* Admin Routes with Layout */}
           <Route element={<AdminLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/students" element={<StudentList />} />
             <Route path="/students/register" element={<StudentRegistration />} />
             <Route path="/students/:id" element={<StudentProfile />} />
             <Route path="/students/:id/edit" element={<StudentRegistration />} />
             <Route path="/courses" element={<Courses />} />
             <Route path="/enrollment" element={<Enrollment />} />
             <Route path="/audit-logs" element={<AuditLogs />} />
           </Route>
           
           {/* Catch-all */}
           <Route path="*" element={<NotFound />} />
         </Routes>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
 );
 
 export default App;
