package com.syllabixtract.api.repositories;

import com.syllabixtract.api.domain.entities.DeadlineEntity;
import org.springframework.data.repository.CrudRepository;

public interface DeadlineRepository extends CrudRepository<DeadlineEntity, Long> {
}
