package com.se_project.student_service.service.IMPL;

import com.se_project.student_service.dto.StudentRegisterRequestDTO;
import com.se_project.student_service.dto.StudentRegisterResponseDTO;
import com.se_project.student_service.entity.DegreeProgram;
import com.se_project.student_service.entity.Student;
import com.se_project.student_service.entity.StudentStatus;
import com.se_project.student_service.repo.StudentRepo;
import com.se_project.student_service.service.StudentService;
import com.sun.jdi.request.DuplicateRequestException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class StudentServiceIMPL implements StudentService {

    @Autowired
    private StudentRepo studentRepo;

    private String generateStudentNumber(DegreeProgram degreeProgram, int intake) {

        // Get degree code from enum (SE, CS, IT, etc.)
        String degreeCode = degreeProgram.getCode();

        // Count existing students with same degree program and intake
        long count = studentRepo.countByDegreeProgramAndIntake(degreeProgram, intake);

        // Generate sequential number (starts from 1)
        long sequentialNumber = count + 1;

        // Format: DegreeCode-Intake-Number
        String studentNumber = String.format("%s-%d-%d", degreeCode, intake, sequentialNumber);

      //  log.info("Generated student number: {}", studentNumber);

        return studentNumber;
    }



    @Override
    @Transactional
    public StudentRegisterResponseDTO registerStudent(StudentRegisterRequestDTO requestDTO) {

       // student.setStudentNumber(generateStudentNumber(studentRegisterRequestDTO.getDegreeProgram().getCode()));

        if (studentRepo.existsByStudentIdNumber(requestDTO.getStudentIdNumber())) {
            throw new DuplicateRequestException(
                    "Student with ID number " + requestDTO.getStudentIdNumber() + " already exists"
            );
        }

        Student student = new Student();

        // Generate unique student number
        String studentNumber = generateStudentNumber(
                requestDTO.getDegreeProgram(),
                requestDTO.getIntake()
        );
        student.setStudentNumber(studentNumber);

        // Set personal details
        student.setFirstName(requestDTO.getFirstName());
        student.setLastName(requestDTO.getLastName());
        student.setAddress(requestDTO.getAddress());
        student.setBirthday(requestDTO.getBirthday());
        student.setStudentIdNumber(requestDTO.getStudentIdNumber());

        // Set degree program and intake
        student.setDegreeProgram(requestDTO.getDegreeProgram());
        student.setIntake(requestDTO.getIntake());

        // Set status as ACTIVE by default
        student.setStatus(StudentStatus.ACTIVE);

        // Save to database
        Student savedStudent = studentRepo.save(student);



        return new StudentRegisterResponseDTO("Student registered successfully", savedStudent.getStudentNumber());
    }
}
