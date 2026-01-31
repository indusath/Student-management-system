package com.se_project.course_service.dto;

import jakarta.persistence.NamedEntityGraph;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NamedEntityGraph
@Data
public class EnrollResponseDTO {
    private String message;
}
