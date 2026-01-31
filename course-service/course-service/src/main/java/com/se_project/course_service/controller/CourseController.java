package com.se_project.course_service.controller;

import com.se_project.course_service.dto.CourseCreateRequestDTO;
import com.se_project.course_service.dto.CourseCreateResponseDTO;
import com.se_project.course_service.dto.EnrollRequestDTO;
import com.se_project.course_service.dto.EnrollResponseDTO;
import com.se_project.course_service.entity.Course;
import com.se_project.course_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
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

    @GetMapping( path = "/get-All-Courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }



}
