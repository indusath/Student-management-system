package com.se_project.course_service.service;

import com.se_project.course_service.dto.CourseCreateRequestDTO;
import com.se_project.course_service.dto.CourseCreateResponseDTO;
import com.se_project.course_service.dto.EnrollRequestDTO;
import com.se_project.course_service.dto.EnrollResponseDTO;
import com.se_project.course_service.entity.Course;

import java.util.List;

public interface CourseService {

    CourseCreateResponseDTO createCourse(CourseCreateRequestDTO courseCreateRequestDTO);

    EnrollResponseDTO enrollCourse(EnrollRequestDTO enrollRequestDTO);

    List<Course> getAllCourses();
}
