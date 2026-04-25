package com.syllabixtract.api.domain.dto;

import com.syllabixtract.api.domain.entities.SyllabiEntity;
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
public class ParseJobDto {


    private Long id;
    private SyllabiDto syllabiDto;
    private String status;
    private String description;
    private LocalDateTime started_at;
    private LocalDateTime completed_at;
    private int retry_count;

}
