package com.se_project.student_service.controller;

import com.se_project.student_service.dto.StudentRegisterRequestDTO;
import com.se_project.student_service.dto.StudentRegisterResponseDTO;
import com.se_project.student_service.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping(path = "/register student")
    public ResponseEntity<StudentRegisterResponseDTO> registerStudent(@RequestBody StudentRegisterRequestDTO studentRegisterRequestDTO) {
        StudentRegisterResponseDTO responseDTO = studentService.registerStudent(studentRegisterRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }




}
