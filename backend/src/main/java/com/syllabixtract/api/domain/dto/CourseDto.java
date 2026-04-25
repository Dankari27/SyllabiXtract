package com.syllabixtract.api.domain.dto;

import com.syllabixtract.api.domain.entities.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CourseDto {

    private Long id;
    private UserDto userDto;
    private String course_code;
    private String course_name;
    private LocalDateTime created_at;
}
