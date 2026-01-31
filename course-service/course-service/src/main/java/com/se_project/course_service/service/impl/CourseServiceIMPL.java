package com.se_project.course_service.service.impl;

import com.se_project.course_service.dto.CourseCreateRequestDTO;
import com.se_project.course_service.dto.CourseCreateResponseDTO;
import com.se_project.course_service.dto.EnrollRequestDTO;
import com.se_project.course_service.dto.EnrollResponseDTO;
import com.se_project.course_service.entity.Course;
import com.se_project.course_service.entity.CourseEnrollment;
import com.se_project.course_service.entity.EnrollmentStatus;
import com.se_project.course_service.repo.CourseEnrollmentRepo;
import com.se_project.course_service.repo.CourseRepo;
import com.se_project.course_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceIMPL implements CourseService {
    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private CourseEnrollmentRepo courseEnrollmentRepo;


    @Override
    public CourseCreateResponseDTO createCourse(CourseCreateRequestDTO courseCreateRequestDTO) {

        Course course = new Course();
        course.setCourseName(courseCreateRequestDTO.getCourseName());
        course.setCourseCode(courseCreateRequestDTO.getCourseCode());
        course.setDepartment(courseCreateRequestDTO.getDepartment());
        course.setDuration(courseCreateRequestDTO.getDuration());
        course.setDescription(courseCreateRequestDTO.getDescription());
        course.setIsActive(true);

        courseRepo.save(course);

        return new CourseCreateResponseDTO("Course created successfully");
    }

    @Override
    public EnrollResponseDTO enrollCourse(EnrollRequestDTO enrollRequestDTO) {

        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setStudentNumber(enrollRequestDTO.getStudentNumber());
      //  enrollment.setCourse(enrollRequestDTO.getCourse().);

        Course course = courseRepo.findByCourseCode(enrollRequestDTO.getCourseCode());
        enrollment.setCourse(course);
        enrollment.setSemester(enrollRequestDTO.getSemester());
        enrollment.setAcademicYear(enrollRequestDTO.getAcademicYear());
        enrollment.setEnrollmentDate(enrollRequestDTO.getEnrollmentDate());
        enrollment.setStatus(EnrollmentStatus.ENROLLED);

       // courseRepo.save();
        courseEnrollmentRepo.save(enrollment);

        return new EnrollResponseDTO("Course enrolled successfully");


    }

    @Override
    public List<Course> getAllCourses() {

        List<Course> courses = courseRepo.findAll();

        return courses;
    }
}
