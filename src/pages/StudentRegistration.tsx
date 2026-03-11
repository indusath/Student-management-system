import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DegreeProgramOption {
  name: string;
  displayName: string;
  code: string;
}

const FALLBACK_DEGREE_PROGRAMS: DegreeProgramOption[] = [
  { name: "SOFTWARE_ENGINEERING", displayName: "Software Engineering", code: "SE" },
  { name: "COMPUTER_ENGINEERING", displayName: "Computer Engineering", code: "CE" },
  { name: "COMPUTER_SCIENCE", displayName: "Computer Science", code: "CS" },
  { name: "INFORMATION_TECHNOLOGY", displayName: "Information Technology", code: "IT" },
  { name: "DATA_SCIENCE", displayName: "Data Science", code: "DBA" },
];

interface FormData {
  studentIdNumber: string;
  firstName: string;
  lastName: string;
  intake: string;
  address: string;
  birthday: string;
  degreeProgram: string;
}

interface FormErrors {
  studentIdNumber: string;
  firstName: string;
  lastName: string;
  intake: string;
  address: string;
  birthday: string;
  degreeProgram: string;
}

const emptyForm: FormData = {
  studentIdNumber: "",
  firstName: "",
  lastName: "",
  intake: "",
  address: "",
  birthday: "",
  degreeProgram: "",
};

const emptyErrors: FormErrors = { ...emptyForm };

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  // ⚠️ IMPORTANT: The route must pass studentNumber (e.g. "SE-2024-1"), NOT the DB numeric id.
  // In your students list navigate like: navigate(`/students/edit/${student.studentNumber}`)
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(isEditing);

  // FIX: Track whether degree programs have finished loading.
  // We must not apply student data to the form until degree programs are ready,
  // otherwise the Select has no matching <SelectItem> and renders blank.
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgramOption[]>(FALLBACK_DEGREE_PROGRAMS);
  const [degreeProgramsReady, setDegreeProgramsReady] = useState(false);

  // ── Load degree programs first ─────────────────────────────────────────────
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const data = await apiGet<DegreeProgramOption[] | string[]>("/api/v1/students/degree-programs");

        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === "string") {
            const mapped = (data as string[]).map((name) => {
              const fallback = FALLBACK_DEGREE_PROGRAMS.find((f) => f.name === name);
              return fallback ?? { name, displayName: name.replace(/_/g, " "), code: "" };
            });
            setDegreePrograms(mapped);
          } else {
            setDegreePrograms(data as DegreeProgramOption[]);
          }
        }
      } catch {
        // Silently fall back to constants — fallback is already the initial state
      } finally {
        // FIX: Signal that degree programs are ready regardless of success/failure
        setDegreeProgramsReady(true);
      }
    };
    fetchDegreePrograms();
  }, []);

  // ── Pre-fill when editing — only runs after degree programs are ready ───────
  useEffect(() => {
    // FIX: Wait for degree programs before populating formData.
    // Without this guard the Select value is set before its options exist,
    // causing Radix UI to silently discard the value and show a blank dropdown.
    if (!isEditing || !degreeProgramsReady) return;

    const fetchStudent = async () => {
      setFetchingStudent(true);
      try {
        const data = await apiGet<any>(`/api/v1/student/get-every-student-details/${id}`);

        console.log("Raw API response:", data);
        console.log("degreeProgram from API:", data.degreeProgram);

        setFormData({
          studentIdNumber: data.studentIdNumber ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          // FIX: Backend sends int — cast to string for the controlled <Input>
          intake: data.intake != null ? String(data.intake) : "",
          address: data.address ?? "",
          // LocalDate from Spring serializes as "YYYY-MM-DD" — matches <input type="date">
          birthday: data.birthday ?? "",
          // FIX: Java enum serializes as its .name() string e.g. "SOFTWARE_ENGINEERING"
          // String() is safe even if it's already a string
          degreeProgram: data.degreeProgram != null ? String(data.degreeProgram) : "",
        });
      } catch {
        toast.error("Failed to load student data");
        navigate("/students");
      } finally {
        setFetchingStudent(false);
      }
    };
    fetchStudent();
  }, [id, isEditing, degreeProgramsReady, navigate]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...emptyErrors };

    if (!formData.studentIdNumber.trim())
      newErrors.studentIdNumber = "Student ID is required";

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.intake.trim()) {
      newErrors.intake = "Intake year is required";
    } else if (!/^\d{2}$/.test(formData.intake)) {
      newErrors.intake = "Intake must be a 2-digit year (e.g. 41/42/43)";
    }

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.birthday)
      newErrors.birthday = "Date of birth is required";

    if (!formData.degreeProgram)
      newErrors.degreeProgram = "Degree program is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      studentIdNumber: formData.studentIdNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      intake: parseInt(formData.intake, 10),
      address: formData.address,
      birthday: formData.birthday,
      degreeProgram: formData.degreeProgram,
    };

    try {
      if (isEditing) {
        await apiPut(`/api/v1/student/get-every-student-details/${id}`, payload);
        toast.success("Student updated successfully");
      } else {
        const response: any = await apiPost("/api/v1/student/register-student", payload);
        const generatedNumber = response?.studentNumber || formData.studentIdNumber;
        toast.success("Student registered successfully", {
          description: `${formData.firstName} ${formData.lastName} (${generatedNumber})`,
        });
      }
      navigate("/students");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      toast.error(`Failed to ${isEditing ? "update" : "register"} student`, { description: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (fetchingStudent) {
    return (
      <div className="page-container">
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Loading student data…
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{isEditing ? "Edit Student" : "Student Registration"}</h1>
        <p className="page-description">
          {isEditing
            ? "Update the student's information."
            : "Register a new student in the system. Course enrollment is done separately after registration."}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {isEditing ? "Edit Student Details" : "New Student Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="form-section">

            {/* Student ID Number */}
            <div className="input-wrapper">
              <Label htmlFor="studentIdNumber">Student ID Number</Label>
              <Input
                id="studentIdNumber"
                placeholder="e.g. NIC"
                value={formData.studentIdNumber}
                onChange={(e) => setFormData({ ...formData, studentIdNumber: e.target.value })}
                disabled={isEditing || loading}
              />
              {errors.studentIdNumber && (
                <p className="validation-message">{errors.studentIdNumber}</p>
              )}
            </div>

            {/* First / Last Name */}
            <div className="form-row">
              <div className="input-wrapper">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={loading}
                />
                {errors.firstName && <p className="validation-message">{errors.firstName}</p>}
              </div>
              <div className="input-wrapper">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={loading}
                />
                {errors.lastName && <p className="validation-message">{errors.lastName}</p>}
              </div>
            </div>

            {/* Intake */}
            <div className="input-wrapper">
              <Label htmlFor="intake">Intake</Label>
              <Input
                id="intake"
                type="text"
                placeholder="e.g. 40, 41, 42"
                value={formData.intake}
                onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                disabled={loading}
              />
              {errors.intake && <p className="validation-message">{errors.intake}</p>}
            </div>

            {/* Address */}
            <div className="input-wrapper">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
              />
              {errors.address && <p className="validation-message">{errors.address}</p>}
            </div>

            {/* Birthday / Degree Program */}
            <div className="form-row">
              <div className="input-wrapper">
                <Label htmlFor="birthday">Date of Birth</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  disabled={loading}
                />
                {errors.birthday && <p className="validation-message">{errors.birthday}</p>}
              </div>

              <div className="input-wrapper">
                <Label htmlFor="degreeProgram">Degree Program</Label>
                <Select
                  value={formData.degreeProgram}
                  onValueChange={(value) => setFormData({ ...formData, degreeProgram: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="degreeProgram">
                    <SelectValue placeholder="Select degree program" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreePrograms.map((program) => (
                      <SelectItem key={program.name} value={program.name}>
                        {program.displayName}
                        {program.code ? ` (${program.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.degreeProgram && (
                  <p className="validation-message">{errors.degreeProgram}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Save Changes" : "Save Student"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/students")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}