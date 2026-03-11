 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Search, Eye, Pencil, Trash2, Users, Plus } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from "@/components/ui/alert-dialog";
 import { Badge } from "@/components/ui/badge";
 
 interface Student {
   id: string;
   studentId: string;
   firstName: string;
   lastName: string;
   degreeProgram: string;
   enrolledCourses: number;
 }
 
 const initialStudents: Student[] = [
   { id: "1", studentId: "SE/2024/001", firstName: "John", lastName: "Perera", degreeProgram: "BSc (Hons) in Software Engineering", enrolledCourses: 5 },
   { id: "2", studentId: "SE/2024/002", firstName: "Mary", lastName: "Silva", degreeProgram: "BSc (Hons) in Software Engineering", enrolledCourses: 4 },
   { id: "3", studentId: "SE/2023/045", firstName: "Kumar", lastName: "Fernando", degreeProgram: "BSc (Hons) in Computer Science", enrolledCourses: 6 },
   { id: "4", studentId: "SE/2023/078", firstName: "Nimali", lastName: "Jayasinghe", degreeProgram: "BSc (Hons) in Software Engineering", enrolledCourses: 5 },
   { id: "5", studentId: "SE/2022/112", firstName: "Amal", lastName: "Bandara", degreeProgram: "BSc (Hons) in Data Science", enrolledCourses: 7 },
   { id: "6", studentId: "SE/2024/015", firstName: "Saman", lastName: "Kumara", degreeProgram: "BSc (Hons) in Information Technology", enrolledCourses: 3 },
 ];
 
 export default function StudentList() {
   const navigate = useNavigate();
   const [students, setStudents] = useState<Student[]>(initialStudents);
   const [searchQuery, setSearchQuery] = useState("");
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
 
   const filteredStudents = students.filter(
     (student) =>
       student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.degreeProgram.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleDelete = () => {
     if (selectedStudent) {
       setStudents(students.filter((s) => s.id !== selectedStudent.id));
       setIsDeleteDialogOpen(false);
       setSelectedStudent(null);
     }
   };
 
   const openDeleteDialog = (student: Student) => {
     setSelectedStudent(student);
     setIsDeleteDialogOpen(true);
   };
 
   return (
     <div className="page-container">
       <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
           <h1 className="page-title">Students</h1>
           <p className="page-description">View, search, and manage registered students.</p>
         </div>
         <Button onClick={() => navigate("/students/register")}>
           <Plus className="h-4 w-4 mr-2" />
           Register Student
         </Button>
       </div>
 
       {/* Search */}
       <Card className="mb-6">
         <CardContent className="py-4">
           <div className="relative max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search by ID, name, or program..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9"
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Students Table */}
       <Card>
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <Users className="h-5 w-5" />
             Students ({filteredStudents.length})
           </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="data-table">
               <thead>
                 <tr>
                   <th>Student ID</th>
                   <th>Name</th>
                   <th>Degree Program</th>
                   <th>Courses</th>
                   <th className="text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredStudents.map((student) => (
                   <tr key={student.id}>
                     <td className="font-medium">{student.studentId}</td>
                     <td>{student.firstName} {student.lastName}</td>
                     <td className="max-w-xs truncate">{student.degreeProgram}</td>
                     <td>
                       <Badge variant="secondary">{student.enrolledCourses} enrolled</Badge>
                     </td>
                     <td className="text-right">
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => navigate(`/students/${student.id}`)}
                       >
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => navigate(`/students/${student.id}/edit`)}
                       >
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => openDeleteDialog(student)}
                         className="text-destructive hover:text-destructive"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </td>
                   </tr>
                 ))}
                 {filteredStudents.length === 0 && (
                   <tr>
                     <td colSpan={5} className="text-center py-8 text-muted-foreground">
                       No students found
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>
 
       {/* Delete Confirmation */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Remove Student</AlertDialogTitle>
             <AlertDialogDescription>
               Are you sure you want to remove {selectedStudent?.firstName} {selectedStudent?.lastName} ({selectedStudent?.studentId})? 
               This will preserve their enrollment history but mark them as inactive.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
               Remove
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 }