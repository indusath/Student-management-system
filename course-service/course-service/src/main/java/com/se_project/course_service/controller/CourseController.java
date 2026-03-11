package com.se_project.course_service.controller;

import com.se_project.course_service.dto.*;
import com.se_project.course_service.entity.Course;
import com.se_project.course_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/v1/course")
public class CourseController {

    @Autowired
    private CourseService courseService;


    @PostMapping(path = "/create")
    public ResponseEntity<CourseCreateResponseDTO> createCourse(@RequestBody CourseCreateRequestDTO courseCreateRequestDTO) {
        CourseCreateResponseDTO responseDTO = courseService.createCourse(courseCreateRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping(path = "/enroll")
    public ResponseEntity<EnrollResponseDTO> enrollCourse(@RequestBody EnrollRequestDTO enrollRequestDTO) {
        EnrollResponseDTO responseDTO = courseService.enrollCourse(enrollRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping( path = "/get-all-courses")
    public ResponseEntity<List<GetAllCourseDTO>> getAllCourses() {
        List<GetAllCourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/getEnrollmentByStudentNumber/{studentNumber}")
    public ResponseEntity<List<CourseEnrollmentDTO>> getEnrollmentByStudentNumber(@PathVariable String studentNumber) {
        List<CourseEnrollmentDTO> enrollments = courseService.getEnrollmentByStudentNumber(studentNumber);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping(path = "/update-enrollment/{studentNumber}")
    public ResponseEntity<EnrollResponseDTO> updateEnrollment(@PathVariable String studentNumber, @RequestBody EnrollUpdateDTO enrollUpdateDTO) {

        EnrollResponseDTO reponse = courseService.updateEnrollment(studentNumber,enrollUpdateDTO);

        return ResponseEntity.ok(reponse) ;
    }

    @DeleteMapping(path = "/delete-course/{courseId}")
    public ResponseEntity<MessageResponseDTO> deleteCourse(@PathVariable Long courseId) {
        MessageResponseDTO responseDTO = courseService.deleteCourse(courseId);
        return ResponseEntity.ok(responseDTO);
    }




}
