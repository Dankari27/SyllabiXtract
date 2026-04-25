package com.syllabixtract.api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SyllabiDto {


    private Long id;
    private CourseDto courseDto;
    private String file_name;
    private String file_type;
    private String storage_url;
    private LocalDateTime uploaded_at;
    private Boolean is_parsed;
    private String raw_text;

}
