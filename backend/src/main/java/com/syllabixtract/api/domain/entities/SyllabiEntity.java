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
@Table (name ="syllabus")
public class SyllabiEntity {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn (name= "course_id")
    private CourseEntity course;
    private String file_name;
    private String file_type;
    private String storage_url;

    @Column (updatable = false)
    private LocalDateTime uploaded_at;
    private Boolean is_parsed;

    @Column (columnDefinition = "TEXT")
    private String raw_text;


    @PrePersist
    public void onUpload(){
        this.uploaded_at = LocalDateTime.now();
    }
}
