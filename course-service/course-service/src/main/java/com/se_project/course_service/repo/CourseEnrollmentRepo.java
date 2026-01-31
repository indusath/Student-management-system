package com.se_project.course_service.repo;

import com.se_project.course_service.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface CourseEnrollmentRepo extends CrudRepository<CourseEnrollment, Long> {
}
