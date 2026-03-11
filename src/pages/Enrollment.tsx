 import { useState } from "react";
 import { Search, Plus, Trash2, Pencil, ClipboardList, User } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
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
 import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
 import { Badge } from "@/components/ui/badge";
 import { toast } from "sonner";
 
 interface Student {
   id: string;
   studentId: string;
   name: string;
   degreeProgram: string;
 }
 
 interface Course {
   id: string;
   courseId: string;
   courseName: string;
 }
 
 interface Enrollment {
   id: string;
   courseId: string;
   courseName: string;
   semester: string;
   academicYear: string;
   enrollmentDate: string;
 }
 
 const students: Student[] = [
   { id: "1", studentId: "SE/2024/001", name: "John Perera", degreeProgram: "BSc (Hons) in Software Engineering" },
   { id: "2", studentId: "SE/2024/002", name: "Mary Silva", degreeProgram: "BSc (Hons) in Software Engineering" },
   { id: "3", studentId: "SE/2023/045", name: "Kumar Fernando", degreeProgram: "BSc (Hons) in Computer Science" },
 ];
 
 const courses: Course[] = [
   { id: "1", courseId: "CS1012", courseName: "Introduction to Programming" },
   { id: "2", courseId: "CS2021", courseName: "Data Structures and Algorithms" },
   { id: "3", courseId: "CS2032", courseName: "Database Management Systems" },
   { id: "4", courseId: "CS3041", courseName: "Software Engineering I" },
   { id: "5", courseId: "CS3052", courseName: "Computer Networks" },
   { id: "6", courseId: "CS4061", courseName: "Machine Learning" },
 ];
 
 const semesters = ["Semester 1", "Semester 2", "Summer Semester"];
 
 const initialEnrollments: Enrollment[] = [
   { id: "1", courseId: "CS1012", courseName: "Introduction to Programming", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
   { id: "2", courseId: "CS2021", courseName: "Data Structures and Algorithms", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
 ];
 
 export default function Enrollment() {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
   const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
   const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
   const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [editForm, setEditForm] = useState({ semester: "", academicYear: "", enrollmentDate: "" });
 
   const [enrollForm, setEnrollForm] = useState({
     courseId: "",
     semester: "",
     academicYear: "",
     enrollmentDate: "",
   });
 
   const [errors, setErrors] = useState({
     courseId: "",
     semester: "",
     academicYear: "",
     enrollmentDate: "",
   });
 
   const filteredStudents = students.filter(
     (student) =>
       student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.name.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleSelectStudent = (student: Student) => {
     setSelectedStudent(student);
     setSearchQuery("");
   };
 
   const validateEnrollment = () => {
     const newErrors = {
       courseId: "",
       semester: "",
       academicYear: "",
       enrollmentDate: "",
     };
 
     if (!enrollForm.courseId) newErrors.courseId = "Course is required";
     if (!enrollForm.semester) newErrors.semester = "Semester is required";
     if (!enrollForm.academicYear.trim()) newErrors.academicYear = "Academic year is required";
     if (!enrollForm.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required";
 
     setErrors(newErrors);
     return Object.values(newErrors).every((e) => !e);
   };
 
   const handleEnroll = (e: React.FormEvent) => {
     e.preventDefault();
     if (!validateEnrollment()) return;
 
     const course = courses.find((c) => c.id === enrollForm.courseId);
     if (!course) return;
 
     // Check for duplicate
     const isDuplicate = enrollments.some((e) => e.courseId === course.courseId);
     if (isDuplicate) {
       setErrors({ ...errors, courseId: "Student is already enrolled in this course" });
       return;
     }
 
     const newEnrollment: Enrollment = {
       id: Date.now().toString(),
       courseId: course.courseId,
       courseName: course.courseName,
       semester: enrollForm.semester,
       academicYear: enrollForm.academicYear,
       enrollmentDate: enrollForm.enrollmentDate,
     };
 
     setEnrollments([...enrollments, newEnrollment]);
     setEnrollForm({ courseId: "", semester: "", academicYear: "", enrollmentDate: "" });
     toast.success("Course enrolled successfully");
   };
 
   const handleRemove = () => {
     if (selectedEnrollment) {
       setEnrollments(enrollments.filter((e) => e.id !== selectedEnrollment.id));
       setIsRemoveDialogOpen(false);
       setSelectedEnrollment(null);
       toast.success("Course removed from enrollment");
     }
   };
 
   const openRemoveDialog = (enrollment: Enrollment) => {
     setSelectedEnrollment(enrollment);
     setIsRemoveDialogOpen(true);
   };
   const openEditDialog = (enrollment: Enrollment) => {
  setSelectedEnrollment(enrollment);
  setEditForm({
    semester: enrollment.semester,
    academicYear: enrollment.academicYear,
    enrollmentDate: enrollment.enrollmentDate,
  });
  setIsEditDialogOpen(true);
};

const handleEditSave = () => {
  if (!editForm.semester || !editForm.academicYear || !editForm.enrollmentDate) return;
  setEnrollments(enrollments.map((e) =>
    e.id === selectedEnrollment?.id
      ? { ...e, semester: editForm.semester, academicYear: editForm.academicYear, enrollmentDate: editForm.enrollmentDate }
      : e
  ));
  setIsEditDialogOpen(false);
  toast.success("Enrollment updated successfully");
};
 
   return (
     <div className="page-container">
       <div className="page-header">
         <h1 className="page-title">Course Enrollment Management</h1>
         <p className="page-description">
           Enroll students in courses and manage their course registrations.
         </p>
       </div>
 
       {!selectedStudent ? (
         /* Student Selection */
         <Card className="max-w-xl">
           <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
               <Search className="h-5 w-5" />
               Select a Student
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search by Student ID or Name..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-9"
                 />
               </div>
               {searchQuery && (
                 <div className="border rounded-md divide-y">
                   {filteredStudents.map((student) => (
                     <button
                       key={student.id}
                       onClick={() => handleSelectStudent(student)}
                       className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
                     >
                       <p className="font-medium">{student.name}</p>
                       <p className="text-sm text-muted-foreground">{student.studentId} • {student.degreeProgram}</p>
                     </button>
                   ))}
                   {filteredStudents.length === 0 && (
                     <p className="px-4 py-3 text-sm text-muted-foreground">No students found</p>
                   )}
                 </div>
               )}
             </div>
           </CardContent>
         </Card>
       ) : (
         <div className="space-y-6">
           {/* Selected Student Info */}
           <Card>
             <CardContent className="py-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                     <User className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                     <h2 className="font-semibold">{selectedStudent.name}</h2>
                     <p className="text-sm text-muted-foreground">
                       {selectedStudent.studentId} • {selectedStudent.degreeProgram}
                     </p>
                   </div>
                 </div>
                 <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                   Change Student
                 </Button>
               </div>
             </CardContent>
           </Card>
 
           <div className="grid gap-6 lg:grid-cols-2">
             {/* Enrollment Form */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Plus className="h-5 w-5" />
                   Enroll in Course
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleEnroll} className="space-y-4">
                   <div className="input-wrapper">
                     <Label>Course</Label>
                     <Select
                       value={enrollForm.courseId}
                       onValueChange={(value) => setEnrollForm({ ...enrollForm, courseId: value })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select course" />
                       </SelectTrigger>
                       <SelectContent>
                         {courses.map((course) => (
                           <SelectItem key={course.id} value={course.id}>
                             {course.courseId} - {course.courseName}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {errors.courseId && <p className="validation-message">{errors.courseId}</p>}
                   </div>
 
                   <div className="input-wrapper">
                     <Label>Semester</Label>
                     <Select
                       value={enrollForm.semester}
                       onValueChange={(value) => setEnrollForm({ ...enrollForm, semester: value })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select semester" />
                       </SelectTrigger>
                       <SelectContent>
                         {semesters.map((sem) => (
                           <SelectItem key={sem} value={sem}>
                             {sem}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {errors.semester && <p className="validation-message">{errors.semester}</p>}
                   </div>
 
                   <div className="input-wrapper">
                     <Label>Academic Year</Label>
                     <Input
                       placeholder="e.g., 2024/2025"
                       value={enrollForm.academicYear}
                       onChange={(e) => setEnrollForm({ ...enrollForm, academicYear: e.target.value })}
                     />
                     {errors.academicYear && <p className="validation-message">{errors.academicYear}</p>}
                   </div>
 
                   <div className="input-wrapper">
                     <Label>Enrollment Date</Label>
                     <Input
                       type="date"
                       value={enrollForm.enrollmentDate}
                       onChange={(e) => setEnrollForm({ ...enrollForm, enrollmentDate: e.target.value })}
                     />
                     {errors.enrollmentDate && <p className="validation-message">{errors.enrollmentDate}</p>}
                   </div>
 
                   <Button type="submit" className="w-full">
                     <Plus className="h-4 w-4 mr-2" />
                     Enroll Course
                   </Button>
                 </form>
               </CardContent>
             </Card>
 
             {/* Enrolled Courses */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <ClipboardList className="h-5 w-5" />
                   Enrolled Courses
                   <Badge variant="secondary" className="ml-auto">{enrollments.length}</Badge>
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="overflow-x-auto">
                   <table className="data-table">
                     <thead>
                       <tr>
                         <th>Course</th>
                         <th>Semester</th>
                         <th>Year</th>
                         <th>Enrolled</th>
                         <th></th>
                       </tr>
                     </thead>
                     <tbody>
                       {enrollments.map((enrollment) => (
                         <tr key={enrollment.id}>
                           <td>
                             <p className="font-medium">{enrollment.courseId}</p>
                             <p className="text-xs text-muted-foreground">{enrollment.courseName}</p>
                           </td>
                           <td>{enrollment.semester}</td>
                           <td>{enrollment.academicYear}</td>
                           <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                           <td>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openEditDialog(enrollment)}
  >
    <Pencil className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openRemoveDialog(enrollment)}
    className="text-destructive hover:text-destructive"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</td>
                         </tr>
                       ))}
                       {enrollments.length === 0 && (
                         <tr>
                           <td colSpan={5} className="text-center py-8 text-muted-foreground">
                             No courses enrolled
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       )}
 
       {/* Remove Confirmation */}
       <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Remove Course Enrollment</AlertDialogTitle>
             <AlertDialogDescription>
               Are you sure you want to remove {selectedEnrollment?.courseName} from {selectedStudent?.name}'s enrollment? 
               The enrollment record will be preserved in the student's course history.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
             <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
               Remove
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
       {/* Edit Enrollment Dialog */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Enrollment</DialogTitle>
    </DialogHeader>
    <div className="space-y-4 py-2">
      <div className="input-wrapper">
        <Label>Course</Label>
        <Input value={selectedEnrollment?.courseName || ""} disabled />
      </div>
      <div className="input-wrapper">
        <Label>Semester</Label>
        <Select
          value={editForm.semester}
          onValueChange={(value) => setEditForm({ ...editForm, semester: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((sem) => (
              <SelectItem key={sem} value={sem}>{sem}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="input-wrapper">
        <Label>Academic Year</Label>
        <Input
          placeholder="e.g., 2024/2025"
          value={editForm.academicYear}
          onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
        />
      </div>
      <div className="input-wrapper">
        <Label>Enrollment Date</Label>
        <Input
          type="date"
          value={editForm.enrollmentDate}
          onChange={(e) => setEditForm({ ...editForm, enrollmentDate: e.target.value })}
        />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
      <Button onClick={handleEditSave}>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
     </div>
     
   );
 }