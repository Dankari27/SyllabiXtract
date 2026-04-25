package com.syllabixtract.api.domain.entities;

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
@Entity
@Table(name = "parsejobs")
public class ParseJobEntity {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name ="syllabi_id")
    private SyllabiEntity syllabiEntity;

    private String status;
    private String description;
    private LocalDateTime started_at;
    private LocalDateTime completed_at;
    private int retry_count;
}
