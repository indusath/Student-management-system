package com.se_project.student_service.service;

import com.se_project.student_service.dto.StudentRegisterRequestDTO;
import com.se_project.student_service.dto.StudentRegisterResponseDTO;

public interface StudentService {
    StudentRegisterResponseDTO registerStudent(StudentRegisterRequestDTO studentRegisterRequestDTO);
}
