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
public class UserDto{

    private Long id;
    private String first_name;
    private String last_name;
    private String email;
    private String password;
    private LocalDateTime created_at ;


}
