 import { useState } from "react";
 import { Plus, Search, Eye, Pencil, Trash2, BookOpen } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from "@/components/ui/dialog";
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
 
 interface Course {
  id: string;
  courseId: string;
  courseName: string;
  description: string;
  credits: number;
  status: "Active" | "Inactive";
  enrolledStudents: number;
}
const initialCourses: Course[] = [
  { id: "1", courseId: "CS1012", courseName: "Introduction to Programming", description: "Fundamentals of programming using Python.", credits: 3, status: "Active", enrolledStudents: 45 },
  { id: "2", courseId: "CS2021", courseName: "Data Structures and Algorithms", description: "Core data structures and algorithm design.", credits: 4, status: "Active", enrolledStudents: 38 },
  { id: "3", courseId: "CS2032", courseName: "Database Management Systems", description: "Relational databases and SQL.", credits: 3, status: "Active", enrolledStudents: 42 },
  { id: "4", courseId: "CS3041", courseName: "Software Engineering I", description: "Software development lifecycle and methodologies.", credits: 3, status: "Active", enrolledStudents: 35 },
  { id: "5", courseId: "CS3052", courseName: "Computer Networks", description: "Network protocols and architecture.", credits: 3, status: "Inactive", enrolledStudents: 0 },
  { id: "6", courseId: "CS4061", courseName: "Machine Learning", description: "Introduction to ML algorithms and applications.", credits: 4, status: "Active", enrolledStudents: 28 },
  { id: "7", courseId: "CS4072", courseName: "Cloud Computing", description: "Cloud platforms and distributed systems.", credits: 3, status: "Active", enrolledStudents: 30 },
  { id: "8", courseId: "CS3043", courseName: "Software Engineering II", description: "Advanced software design and testing.", credits: 3, status: "Inactive", enrolledStudents: 0 },
];
 
 export default function Courses() {
   const [courses, setCourses] = useState<Course[]>(initialCourses);
   const [searchQuery, setSearchQuery] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
   const [viewCourse, setViewCourse] = useState<Course | null>(null);
   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
   const [formData, setFormData] = useState({ courseId: "", courseName: "", description: "", credits: 3, status: "Active" as "Active" | "Inactive", enrolledStudents: 0 });
   const [errors, setErrors] = useState({ courseId: "", courseName: "", description: "" });


 
   const filteredCourses = courses.filter(
     (course) =>
       course.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleOpenDialog = (course?: Course) => {
  if (course) {
    setSelectedCourse(course);
    setFormData({ courseId: course.courseId, courseName: course.courseName, description: course.description, credits: course.credits, status: course.status, enrolledStudents: course.enrolledStudents });
  } else {
    setSelectedCourse(null);
    setFormData({ courseId: "", courseName: "", description: "", credits: 3, status: "Active", enrolledStudents: 0 });
  }
  setErrors({ courseId: "", courseName: "", description: "" });
  setIsDialogOpen(true);
};
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const newErrors = { courseId: "", courseName: "", description: "" };
if (!formData.courseId.trim()) newErrors.courseId = "Course ID is required";
if (!formData.courseName.trim()) newErrors.courseName = "Course Name is required";
if (!formData.description.trim()) newErrors.description = "Description is required";
setErrors(newErrors);
if (!newErrors.courseId && !newErrors.courseName && !newErrors.description) {

  if (selectedCourse) {
  setCourses(courses.map(c => 
    c.id === selectedCourse.id 
      ? { ...c, courseId: formData.courseId, courseName: formData.courseName, description: formData.description, credits: formData.credits, status: formData.status, enrolledStudents: formData.enrolledStudents }
      : c
  ));
} else {
  const newCourse: Course = {
    id: Date.now().toString(),
    courseId: formData.courseId,
    courseName: formData.courseName,
    description: formData.description,
    credits: formData.credits,
    status: formData.status,
    enrolledStudents: formData.enrolledStudents,
  };
  setCourses([...courses, newCourse]);
}
  
       setIsDialogOpen(false);
     }
   };
 
   const handleDelete = () => {
     if (selectedCourse) {
       setCourses(courses.filter(c => c.id !== selectedCourse.id));
       setIsDeleteDialogOpen(false);
       setSelectedCourse(null);
     }
   };
 
   const openDeleteDialog = (course: Course) => {
     setSelectedCourse(course);
     setIsDeleteDialogOpen(true);
   };
   const openViewDialog = (course: Course) => {
  setViewCourse(course);
  setIsViewDialogOpen(true);
};
 
   return (
     <div className="page-container">
       <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
           <h1 className="page-title">Course Management</h1>
           <p className="page-description">Add, edit, and manage courses in the system.</p>
         </div>
         <Button onClick={() => handleOpenDialog()}>
           <Plus className="h-4 w-4 mr-2" />
           Add Course
         </Button>
       </div>
 
       {/* Search */}
       <Card className="mb-6">
         <CardContent className="py-4">
           <div className="relative max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search by Course ID or Name..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9"
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Courses Table */}
       <Card>
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <BookOpen className="h-5 w-5" />
             Courses ({filteredCourses.length})
           </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="data-table">
               <thead>
                 <tr>
                   <th>Course ID</th>
                   <th>Course Name</th>
                   <th className="text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredCourses.map((course) => (
                   <tr key={course.id}>
                     <td className="font-medium">{course.courseId}</td>
                     <td>{course.courseName}</td>
                     <td className="text-right">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openViewDialog(course)}
  
  >
    <Eye className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleOpenDialog(course)}
  >
    <Pencil className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openDeleteDialog(course)}
    className="text-destructive hover:text-destructive"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</td>
                   </tr>
                 ))}
                 {filteredCourses.length === 0 && (
                   <tr>
                     <td colSpan={3} className="text-center py-8 text-muted-foreground">
                       No courses found
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>
 
       {/* Add/Edit Dialog */}
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>
               {selectedCourse ? "Edit Course" : "Add New Course"}
             </DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-4">
  <div className="input-wrapper">
    <Label htmlFor="courseId">Course ID</Label>
    <Input
      id="courseId"
      placeholder="e.g., CS1012"
      value={formData.courseId}
      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
    />
    {errors.courseId && <p className="validation-message">{errors.courseId}</p>}
  </div>
  <div className="input-wrapper">
    <Label htmlFor="courseName">Course Name</Label>
    <Input
      id="courseName"
      placeholder="e.g., Introduction to Programming"
      value={formData.courseName}
      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
    />
    {errors.courseName && <p className="validation-message">{errors.courseName}</p>}
  </div>
  <div className="input-wrapper">
    <Label htmlFor="description">Description</Label>
    <Input
      id="description"
      placeholder="Brief course description"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    />
    {errors.description && <p className="validation-message">{errors.description}</p>}
  </div>
  <div className="form-row">
    <div className="input-wrapper">
      <Label htmlFor="credits">Credits</Label>
      <Input
        id="credits"
        type="number"
        min={1}
        max={6}
        value={formData.credits}
        onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
      />
    </div>
    <div className="input-wrapper">
      <Label htmlFor="status">Status</Label>
      <select
        id="status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  </div>
  <DialogFooter>
    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
    <Button type="submit">{selectedCourse ? "Save Changes" : "Add Course"}</Button>
  </DialogFooter>
</form>
         </DialogContent>
       </Dialog>
 
       {/* Delete Confirmation */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Course</AlertDialogTitle>
             <AlertDialogDescription>
               Are you sure you want to delete "{selectedCourse?.courseName}"? This action cannot be undone.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
               Delete
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
       {/* View Course Dialog */}
<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Course Details</DialogTitle>
    </DialogHeader>
    <div className="space-y-4 py-2">
  <div>
    <p className="text-sm text-muted-foreground">Course ID</p>
    <p className="font-medium">{viewCourse?.courseId}</p>
  </div>
  <div>
    <p className="text-sm text-muted-foreground">Course Name</p>
    <p className="font-medium">{viewCourse?.courseName}</p>
  </div>
  <div>
    <p className="text-sm text-muted-foreground">Description</p>
    <p className="font-medium">{viewCourse?.description}</p>
  </div>
  <div className="form-row">
    <div>
      <p className="text-sm text-muted-foreground">Credits</p>
      <p className="font-medium">{viewCourse?.credits}</p>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Enrolled Students</p>
      <p className="font-medium">{viewCourse?.enrolledStudents}</p>
    </div>
  </div>
  <div>
    <p className="text-sm text-muted-foreground">Status</p>
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewCourse?.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
      {viewCourse?.status}
    </span>
  </div>
</div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
     </div>
   );
 }