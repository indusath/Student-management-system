import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Pencil, ClipboardList, User, Loader2 } from "lucide-react";
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
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

const semesters = ["Semester 1", "Semester 2", "Summer Semester"];

interface Student {
  id: string;
  studentId: string;
  name: string;          // adjust to match your API field (e.g. firstName + lastName)
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

export default function Enrollment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [saving, setSaving] = useState(false);

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

  // Load students and courses once
  useEffect(() => {
    const init = async () => {
      try {
        // GET YOUR_API_BASE_URL/students
        const s = await apiGet<Student[]>("/students");
        setStudents(s);
        // GET YOUR_API_BASE_URL/courses
        const c = await apiGet<Course[]>("/courses");
        setCourses(c);
      } catch {
        toast.error("Failed to load students/courses");
      }
    };
    init();
  }, []);

  // Load enrollments when a student is selected
  useEffect(() => {
    if (!selectedStudent) return;
    const fetchEnrollments = async () => {
      setLoadingEnrollments(true);
      try {
        // GET YOUR_API_BASE_URL/enrollments?studentId=:id
        const data = await apiGet<Enrollment[]>(`/enrollments?studentId=${selectedStudent.id}`);
        setEnrollments(data);
      } catch {
        toast.error("Failed to load enrollments");
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchEnrollments();
  }, [selectedStudent]);

  const filteredStudents = students.filter(
    (s) =>
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setEnrollments([]);
    setSearchQuery("");
  };

  const validateEnrollment = () => {
    const newErrors = { courseId: "", semester: "", academicYear: "", enrollmentDate: "" };
    if (!enrollForm.courseId) newErrors.courseId = "Course is required";
    if (!enrollForm.semester) newErrors.semester = "Semester is required";
    if (!enrollForm.academicYear.trim()) newErrors.academicYear = "Academic year is required";
    if (!enrollForm.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnrollment() || !selectedStudent) return;
    const course = courses.find((c) => c.id === enrollForm.courseId);
    if (!course) return;

    setSaving(true);
    try {
      // POST YOUR_API_BASE_URL/enrollments
      const newEnrollment = await apiPost<Enrollment>("/enrollments", {
        studentId: selectedStudent.id,
        courseId: course.id,
        semester: enrollForm.semester,
        academicYear: enrollForm.academicYear,
        enrollmentDate: enrollForm.enrollmentDate,
      });
      setEnrollments([...enrollments, newEnrollment]);
      setEnrollForm({ courseId: "", semester: "", academicYear: "", enrollmentDate: "" });
      toast.success("Course enrolled successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to enroll";
      toast.error("Enrollment failed", { description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedEnrollment) return;
    try {
      // DELETE YOUR_API_BASE_URL/enrollments/:id
      await apiDelete(`/enrollments/${selectedEnrollment.id}`);
      setEnrollments(enrollments.filter((e) => e.id !== selectedEnrollment.id));
      toast.success("Course removed from enrollment");
    } catch {
      toast.error("Failed to remove enrollment");
    } finally {
      setIsRemoveDialogOpen(false);
      setSelectedEnrollment(null);
    }
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

  const handleEditSave = async () => {
    if (!editForm.semester || !editForm.academicYear || !editForm.enrollmentDate) return;
    setSaving(true);
    try {
      // PUT YOUR_API_BASE_URL/enrollments/:id
      await apiPut(`/enrollments/${selectedEnrollment?.id}`, editForm);
      setEnrollments(enrollments.map((e) =>
        e.id === selectedEnrollment?.id ? { ...e, ...editForm } : e
      ));
      setIsEditDialogOpen(false);
      toast.success("Enrollment updated successfully");
    } catch {
      toast.error("Failed to update enrollment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Course Enrollment Management</h1>
        <p className="page-description">Enroll students in courses and manage their course registrations.</p>
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
                    <Select value={enrollForm.courseId} onValueChange={(v) => setEnrollForm({ ...enrollForm, courseId: v })} disabled={saving}>
                      <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
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
                    <Select value={enrollForm.semester} onValueChange={(v) => setEnrollForm({ ...enrollForm, semester: v })} disabled={saving}>
                      <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem}</SelectItem>
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
                      disabled={saving}
                    />
                    {errors.academicYear && <p className="validation-message">{errors.academicYear}</p>}
                  </div>
                  <div className="input-wrapper">
                    <Label>Enrollment Date</Label>
                    <Input
                      type="date"
                      value={enrollForm.enrollmentDate}
                      onChange={(e) => setEnrollForm({ ...enrollForm, enrollmentDate: e.target.value })}
                      disabled={saving}
                    />
                    {errors.enrollmentDate && <p className="validation-message">{errors.enrollmentDate}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
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
                      {loadingEnrollments ? (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-muted-foreground">Loading enrollments…</td>
                        </tr>
                      ) : enrollments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-muted-foreground">No courses enrolled</td>
                        </tr>
                      ) : (
                        enrollments.map((enrollment) => (
                          <tr key={enrollment.id}>
                            <td>
                              <p className="font-medium">{enrollment.courseId}</p>
                              <p className="text-xs text-muted-foreground">{enrollment.courseName}</p>
                            </td>
                            <td>{enrollment.semester}</td>
                            <td>{enrollment.academicYear}</td>
                            <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                            <td>
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(enrollment)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => { setSelectedEnrollment(enrollment); setIsRemoveDialogOpen(true); }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
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
              <Select value={editForm.semester} onValueChange={(v) => setEditForm({ ...editForm, semester: v })} disabled={saving}>
                <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
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
                disabled={saving}
              />
            </div>
            <div className="input-wrapper">
              <Label>Enrollment Date</Label>
              <Input
                type="date"
                value={editForm.enrollmentDate}
                onChange={(e) => setEditForm({ ...editForm, enrollmentDate: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}