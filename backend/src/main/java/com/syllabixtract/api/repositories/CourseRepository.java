package com.syllabixtract.api.repositories;

import com.syllabixtract.api.domain.entities.CourseEntity;
import org.springframework.data.repository.CrudRepository;

public interface CourseRepository   extends CrudRepository<CourseEntity, Long> {
}
