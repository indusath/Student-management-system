 import { useState } from "react";
 import { Search, FileText, Filter } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 
 interface AuditLog {
   id: string;
   action: string;
   details: string;
   administrator: string;
   timestamp: string;
   category: "student" | "course" | "enrollment" | "system";
 }
 
 const auditLogs: AuditLog[] = [
   { id: "1", action: "Student Registered", details: "John Perera (SE/2024/001) was registered", administrator: "Admin", timestamp: "2024-12-15T10:30:00", category: "student" },
   { id: "2", action: "Course Enrollment", details: "John Perera enrolled in CS1012 - Introduction to Programming", administrator: "Admin", timestamp: "2024-12-15T10:35:00", category: "enrollment" },
   { id: "3", action: "Course Enrollment", details: "John Perera enrolled in CS2021 - Data Structures and Algorithms", administrator: "Admin", timestamp: "2024-12-15T10:36:00", category: "enrollment" },
   { id: "4", action: "Course Added", details: "CS4072 - Cloud Computing was added to the system", administrator: "Admin", timestamp: "2024-12-14T14:20:00", category: "course" },
   { id: "5", action: "Student Updated", details: "Mary Silva (SE/2024/002) address was updated", administrator: "Admin", timestamp: "2024-12-14T11:15:00", category: "student" },
   { id: "6", action: "Course Updated", details: "CS3041 - Software Engineering I description was modified", administrator: "Admin", timestamp: "2024-12-13T09:45:00", category: "course" },
   { id: "7", action: "Course Removed", details: "Kumar Fernando removed from CS2032 - Database Management Systems", administrator: "Admin", timestamp: "2024-12-13T08:30:00", category: "enrollment" },
   { id: "8", action: "Student Registered", details: "Saman Kumara (SE/2024/015) was registered", administrator: "Admin", timestamp: "2024-12-12T16:00:00", category: "student" },
   { id: "9", action: "Admin Login", details: "Administrator logged into the system", administrator: "Admin", timestamp: "2024-12-15T08:00:00", category: "system" },
   { id: "10", action: "Course Deleted", details: "CS1010 - Computer Literacy was removed from the system", administrator: "Admin", timestamp: "2024-12-11T15:30:00", category: "course" },
   { id: "11", action: "Course Enrollment", details: "Nimali Jayasinghe enrolled in CS3052 - Computer Networks", administrator: "Admin", timestamp: "2024-12-10T13:20:00", category: "enrollment" },
   { id: "12", action: "Student Removed", details: "Inactive student record removed (SE/2020/089)", administrator: "Admin", timestamp: "2024-12-09T10:00:00", category: "student" },
 ];
 
 const categoryColors = {
   student: "bg-blue-100 text-blue-800",
   course: "bg-green-100 text-green-800",
   enrollment: "bg-purple-100 text-purple-800",
   system: "bg-gray-100 text-gray-800",
 };
 
 export default function AuditLogs() {
   const [searchQuery, setSearchQuery] = useState("");
   const [categoryFilter, setCategoryFilter] = useState<string>("all");
 
   const filteredLogs = auditLogs.filter((log) => {
     const matchesSearch =
       log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
       log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
       log.administrator.toLowerCase().includes(searchQuery.toLowerCase());
     
     const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
     
     return matchesSearch && matchesCategory;
   });
 
   const formatDateTime = (timestamp: string) => {
     const date = new Date(timestamp);
     return {
       date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
       time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
     };
   };
 
   return (
     <div className="page-container">
       <div className="page-header">
         <h1 className="page-title">Audit Logs</h1>
         <p className="page-description">
           View a complete history of all administrative actions performed in the system.
         </p>
       </div>
 
       {/* Filters */}
       <Card className="mb-6">
         <CardContent className="py-4">
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search by action, details, or administrator..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9"
               />
             </div>
             <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-muted-foreground" />
               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                 <SelectTrigger className="w-40">
                   <SelectValue placeholder="Filter by type" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Categories</SelectItem>
                   <SelectItem value="student">Student</SelectItem>
                   <SelectItem value="course">Course</SelectItem>
                   <SelectItem value="enrollment">Enrollment</SelectItem>
                   <SelectItem value="system">System</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Audit Log Table */}
       <Card>
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <FileText className="h-5 w-5" />
             Activity Log ({filteredLogs.length} entries)
           </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="data-table">
               <thead>
                 <tr>
                   <th>Action</th>
                   <th>Details</th>
                   <th>Administrator</th>
                   <th>Date & Time</th>
                   <th>Category</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredLogs.map((log) => {
                   const { date, time } = formatDateTime(log.timestamp);
                   return (
                     <tr key={log.id}>
                       <td className="font-medium">{log.action}</td>
                       <td className="max-w-xs">{log.details}</td>
                       <td>{log.administrator}</td>
                       <td>
                         <div>
                           <p className="text-sm">{date}</p>
                           <p className="text-xs text-muted-foreground">{time}</p>
                         </div>
                       </td>
                       <td>
                         <Badge variant="secondary" className={categoryColors[log.category]}>
                           {log.category}
                         </Badge>
                       </td>
                     </tr>
                   );
                 })}
                 {filteredLogs.length === 0 && (
                   <tr>
                     <td colSpan={5} className="text-center py-8 text-muted-foreground">
                       No audit logs found
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>
 
       {/* Info Note */}
       <p className="text-xs text-muted-foreground mt-4 text-center">
         Audit logs are read-only and cannot be modified or deleted. All administrative actions are automatically recorded.
       </p>
     </div>
   );
 }