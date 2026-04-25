package com.syllabixtract.api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DeadlineDto {

    private Long id;
    private SyllabiDto syllabiDto;
    private CourseDto courseDto;
    private String description;
    private String title;
    private LocalDate due_date;
    private LocalTime due_time;
    private LocalDateTime created_at;
    private Boolean is_confirmed;
    private Boolean is_completed;
}
