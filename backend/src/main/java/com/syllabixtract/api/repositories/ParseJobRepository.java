package com.syllabixtract.api.repositories;

import com.syllabixtract.api.domain.entities.ParseJobEntity;
import org.springframework.data.repository.CrudRepository;

public interface ParseJobRepository extends CrudRepository<ParseJobEntity, Long> {
}
