 import { useNavigate, useParams } from "react-router-dom";
 import { ArrowLeft, User, Calendar, MapPin, GraduationCap, BookOpen, ClipboardList } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Separator } from "@/components/ui/separator";
 
 // Mock student data
 const allStudents = [
  {
    id: "1",
    studentId: "SE/2024/001",
    firstName: "John",
    lastName: "Perera",
    address: "45 Temple Road, Colombo 07, Sri Lanka",
    dateOfBirth: "2002-05-15",
    degreeProgram: "BSc (Hons) in Software Engineering",
    enrolledCourses: [
      { courseId: "CS1012", courseName: "Introduction to Programming", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
      { courseId: "CS2021", courseName: "Data Structures and Algorithms", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [
      { courseId: "CS1011", courseName: "Mathematics for Computing", semester: "Semester 1", academicYear: "2023/2024", enrollmentDate: "2023-09-01", status: "completed" },
    ],
  },
  {
    id: "2",
    studentId: "SE/2024/002",
    firstName: "Mary",
    lastName: "Silva",
    address: "12 Galle Road, Colombo 03, Sri Lanka",
    dateOfBirth: "2001-08-22",
    degreeProgram: "BSc (Hons) in Software Engineering",
    enrolledCourses: [
      { courseId: "CS1012", courseName: "Introduction to Programming", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
      { courseId: "CS2032", courseName: "Database Management Systems", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [
      { courseId: "CS1013", courseName: "Computer Fundamentals", semester: "Semester 1", academicYear: "2023/2024", enrollmentDate: "2023-09-01", status: "completed" },
    ],
  },
  {
    id: "3",
    studentId: "SE/2023/045",
    firstName: "Kumar",
    lastName: "Fernando",
    address: "78 Kandy Road, Peradeniya, Sri Lanka",
    dateOfBirth: "2000-03-10",
    degreeProgram: "BSc (Hons) in Computer Science",
    enrolledCourses: [
      { courseId: "CS2021", courseName: "Data Structures and Algorithms", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
      { courseId: "CS3041", courseName: "Software Engineering I", semester: "Semester 2", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [
      { courseId: "CS1011", courseName: "Mathematics for Computing", semester: "Semester 1", academicYear: "2023/2024", enrollmentDate: "2023-09-01", status: "completed" },
      { courseId: "CS1012", courseName: "Introduction to Programming", semester: "Semester 1", academicYear: "2023/2024", enrollmentDate: "2023-09-01", status: "completed" },
    ],
  },
  {
    id: "4",
    studentId: "SE/2023/078",
    firstName: "Nimali",
    lastName: "Jayasinghe",
    address: "23 Negombo Road, Wattala, Sri Lanka",
    dateOfBirth: "2001-11-05",
    degreeProgram: "BSc (Hons) in Software Engineering",
    enrolledCourses: [
      { courseId: "CS3041", courseName: "Software Engineering I", semester: "Semester 2", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
      { courseId: "CS3052", courseName: "Computer Networks", semester: "Semester 2", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [
      { courseId: "CS1011", courseName: "Mathematics for Computing", semester: "Semester 1", academicYear: "2023/2024", enrollmentDate: "2023-09-01", status: "completed" },
    ],
  },
  {
    id: "5",
    studentId: "SE/2022/112",
    firstName: "Amal",
    lastName: "Bandara",
    address: "56 Matara Road, Galle, Sri Lanka",
    dateOfBirth: "1999-07-18",
    degreeProgram: "BSc (Hons) in Data Science",
    enrolledCourses: [
      { courseId: "CS4061", courseName: "Machine Learning", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
      { courseId: "CS4072", courseName: "Cloud Computing", semester: "Semester 2", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [
      { courseId: "CS1011", courseName: "Mathematics for Computing", semester: "Semester 1", academicYear: "2022/2023", enrollmentDate: "2022-09-01", status: "completed" },
      { courseId: "CS2032", courseName: "Database Management Systems", semester: "Semester 2", academicYear: "2022/2023", enrollmentDate: "2022-09-01", status: "completed" },
    ],
  },
  {
    id: "6",
    studentId: "SE/2024/015",
    firstName: "Saman",
    lastName: "Kumara",
    address: "89 Kurunegala Road, Colombo 10, Sri Lanka",
    dateOfBirth: "2003-01-30",
    degreeProgram: "BSc (Hons) in Information Technology",
    enrolledCourses: [
      { courseId: "CS1012", courseName: "Introduction to Programming", semester: "Semester 1", academicYear: "2024/2025", enrollmentDate: "2024-09-01" },
    ],
    courseHistory: [],
  },
];
 
 export default function StudentProfile() {
   const navigate = useNavigate();
   const { id } = useParams();
   const studentData = allStudents.find((s) => s.id === id) || allStudents[0];
 
   return (
     <div className="page-container">
       {/* Back Button */}
       <Button variant="ghost" onClick={() => navigate("/students")} className="mb-4">
         <ArrowLeft className="h-4 w-4 mr-2" />
         Back to Students
       </Button>
 
       <div className="page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
         <div>
           <h1 className="page-title">{studentData.firstName} {studentData.lastName}</h1>
           <p className="page-description">{studentData.studentId}</p>
         </div>
         <div className="flex gap-2">
           <Button variant="outline" onClick={() => navigate(`/students/${id}/edit`)}>
             Edit Profile
           </Button>
           <Button onClick={() => navigate(`/enrollment?student=${id}`)}>
             <ClipboardList className="h-4 w-4 mr-2" />
             Manage Courses
           </Button>
         </div>
       </div>
 
       <div className="grid gap-6 lg:grid-cols-3">
         {/* Personal Information */}
         <Card className="lg:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
               <User className="h-5 w-5" />
               Personal Information
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-start gap-3">
               <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
               <div>
                 <p className="text-sm text-muted-foreground">Degree Program</p>
                 <p className="text-sm font-medium">{studentData.degreeProgram}</p>
               </div>
             </div>
             <Separator />
             <div className="flex items-start gap-3">
               <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
               <div>
                 <p className="text-sm text-muted-foreground">Date of Birth</p>
                 <p className="text-sm font-medium">
                   {new Date(studentData.dateOfBirth).toLocaleDateString('en-GB', { 
                     day: 'numeric', month: 'long', year: 'numeric' 
                   })}
                 </p>
               </div>
             </div>
             <Separator />
             <div className="flex items-start gap-3">
               <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
               <div>
                 <p className="text-sm text-muted-foreground">Address</p>
                 <p className="text-sm font-medium">{studentData.address}</p>
               </div>
             </div>
           </CardContent>
         </Card>
 
         {/* Enrolled Courses */}
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
               <BookOpen className="h-5 w-5" />
               Current Enrolled Courses
               <Badge variant="secondary" className="ml-auto">{studentData.enrolledCourses.length} courses</Badge>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Course ID</th>
                     <th>Course Name</th>
                     <th>Semester</th>
                     <th>Academic Year</th>
                     <th>Enrolled</th>
                   </tr>
                 </thead>
                 <tbody>
                   {studentData.enrolledCourses.map((course) => (
                     <tr key={course.courseId}>
                       <td className="font-medium">{course.courseId}</td>
                       <td>{course.courseName}</td>
                       <td>{course.semester}</td>
                       <td>{course.academicYear}</td>
                       <td>{new Date(course.enrollmentDate).toLocaleDateString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </CardContent>
         </Card>
 
         {/* Course History */}
         <Card className="lg:col-span-3">
           <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
               <ClipboardList className="h-5 w-5" />
               Course History
               <Badge variant="outline" className="ml-auto">{studentData.courseHistory.length} past courses</Badge>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Course ID</th>
                     <th>Course Name</th>
                     <th>Semester</th>
                     <th>Academic Year</th>
                     <th>Enrolled</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {studentData.courseHistory.map((course) => (
                     <tr key={course.courseId}>
                       <td className="font-medium">{course.courseId}</td>
                       <td>{course.courseName}</td>
                       <td>{course.semester}</td>
                       <td>{course.academicYear}</td>
                       <td>{new Date(course.enrollmentDate).toLocaleDateString()}</td>
                       <td>
                         <Badge variant="secondary" className="bg-success/10 text-success border-0">
                           Completed
                         </Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }