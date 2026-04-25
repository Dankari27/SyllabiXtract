package com.syllabixtract.api.repositories;

import com.syllabixtract.api.domain.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity, Long> {
}
