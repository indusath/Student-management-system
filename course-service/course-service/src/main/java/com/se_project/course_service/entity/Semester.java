package com.se_project.course_service.entity;

public enum Semester {
    SEMESTER_1("Semester 1"),
    SEMESTER_2("Semester 2"),
    SUMMER("Summer Semester");

    private final String displayName;

    Semester(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
