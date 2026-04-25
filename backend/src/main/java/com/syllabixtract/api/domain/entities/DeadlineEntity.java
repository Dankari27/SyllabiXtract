package com.syllabixtract.api.domain.entities;

import jakarta.persistence.*;
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
@Entity
@Table(name ="deadlines")
public class DeadlineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn  (name = "syllabi_id")
    private SyllabiEntity syllabiEntity;

    @ManyToOne
    @JoinColumn  (name = "course_id")
    private CourseEntity courseEntity;

    private String description;
    private String title;
    private LocalDate due_date;
    private LocalTime due_time;

    @Column (updatable = false)
    private LocalDateTime created_at;
    private Boolean is_confirmed;
    private Boolean is_completed;

    @PrePersist
    public void onCreate(){
        this.created_at = LocalDateTime.now();
    }
}
