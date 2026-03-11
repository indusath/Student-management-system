 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
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
 import { UserPlus } from "lucide-react";
 import { toast } from "sonner";
 
 const degreePrograms = [
   "BSc (Hons) in Software Engineering",
   "BSc (Hons) in Computer Science",
   "BSc (Hons) in Information Technology",
   "BSc (Hons) in Data Science",
 ];
 
 interface FormData {
   studentId: string;
   firstName: string;
   lastName: string;
   address: string;
   dateOfBirth: string;
   degreeProgram: string;
 }
 
 interface FormErrors {
   studentId: string;
   firstName: string;
   lastName: string;
   address: string;
   dateOfBirth: string;
   degreeProgram: string;
 }
 
 export default function StudentRegistration() {
   const navigate = useNavigate();
   const [formData, setFormData] = useState<FormData>({
     studentId: "",
     firstName: "",
     lastName: "",
     address: "",
     dateOfBirth: "",
     degreeProgram: "",
   });
 
   const [errors, setErrors] = useState<FormErrors>({
     studentId: "",
     firstName: "",
     lastName: "",
     address: "",
     dateOfBirth: "",
     degreeProgram: "",
   });
 
   const validateForm = (): boolean => {
     const newErrors: FormErrors = {
       studentId: "",
       firstName: "",
       lastName: "",
       address: "",
       dateOfBirth: "",
       degreeProgram: "",
     };
 
     if (!formData.studentId.trim()) {
       newErrors.studentId = "Student ID is required";
     } else if (!/^SE\/\d{4}\/\d{3}$/.test(formData.studentId)) {
       newErrors.studentId = "Format: SE/YYYY/XXX (e.g., SE/2024/001)";
     }
 
     if (!formData.firstName.trim()) {
       newErrors.firstName = "First name is required";
     }
 
     if (!formData.lastName.trim()) {
       newErrors.lastName = "Last name is required";
     }
 
     if (!formData.address.trim()) {
       newErrors.address = "Address is required";
     }
 
     if (!formData.dateOfBirth) {
       newErrors.dateOfBirth = "Date of birth is required";
     }
 
     if (!formData.degreeProgram) {
       newErrors.degreeProgram = "Degree program is required";
     }
 
     setErrors(newErrors);
     return Object.values(newErrors).every((error) => !error);
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (validateForm()) {
       toast.success("Student registered successfully", {
         description: `${formData.firstName} ${formData.lastName} (${formData.studentId})`,
       });
       navigate("/students");
     }
   };
 
   const handleCancel = () => {
     navigate("/students");
   };
 
   return (
     <div className="page-container">
       <div className="page-header">
         <h1 className="page-title">Student Registration</h1>
         <p className="page-description">
           Register a new student in the system. Course enrollment is done separately after registration.
         </p>
       </div>
 
       <Card className="max-w-2xl">
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <UserPlus className="h-5 w-5" />
             New Student Details
           </CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="form-section">
             <div className="input-wrapper">
               <Label htmlFor="studentId">Student ID</Label>
               <Input
                 id="studentId"
                 placeholder="SE/2024/001"
                 value={formData.studentId}
                 onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
               />
               {errors.studentId && <p className="validation-message">{errors.studentId}</p>}
             </div>
 
             <div className="form-row">
               <div className="input-wrapper">
                 <Label htmlFor="firstName">First Name</Label>
                 <Input
                   id="firstName"
                   placeholder="Enter first name"
                   value={formData.firstName}
                   onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                 />
                 {errors.lastName && <p className="validation-message">{errors.lastName}</p>}
               </div>
             </div>
 
             <div className="input-wrapper">
               <Label htmlFor="address">Address</Label>
               <Input
                 id="address"
                 placeholder="Enter full address"
                 value={formData.address}
                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               />
               {errors.address && <p className="validation-message">{errors.address}</p>}
             </div>
 
             <div className="form-row">
               <div className="input-wrapper">
                 <Label htmlFor="dateOfBirth">Date of Birth</Label>
                 <Input
                   id="dateOfBirth"
                   type="date"
                   value={formData.dateOfBirth}
                   onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                 />
                 {errors.dateOfBirth && <p className="validation-message">{errors.dateOfBirth}</p>}
               </div>
 
               <div className="input-wrapper">
                 <Label htmlFor="degreeProgram">Degree Program</Label>
                 <Select
                   value={formData.degreeProgram}
                   onValueChange={(value) => setFormData({ ...formData, degreeProgram: value })}
                 >
                   <SelectTrigger id="degreeProgram">
                     <SelectValue placeholder="Select degree program" />
                   </SelectTrigger>
                   <SelectContent>
                     {degreePrograms.map((program) => (
                       <SelectItem key={program} value={program}>
                         {program}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 {errors.degreeProgram && <p className="validation-message">{errors.degreeProgram}</p>}
               </div>
             </div>
 
             <div className="flex gap-3 pt-4">
               <Button type="submit">Save Student</Button>
               <Button type="button" variant="outline" onClick={handleCancel}>
                 Cancel
               </Button>
             </div>
           </form>
         </CardContent>
       </Card>
     </div>
   );
 }