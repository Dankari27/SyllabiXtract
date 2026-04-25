package com.syllabixtract.api.repositories;

import com.syllabixtract.api.domain.entities.SyllabiEntity;
import org.springframework.data.repository.CrudRepository;

public interface SyllabiRepository extends CrudRepository<SyllabiEntity, Long> {
}
