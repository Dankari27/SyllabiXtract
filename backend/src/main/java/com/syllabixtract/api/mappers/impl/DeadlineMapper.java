package com.syllabixtract.api.mappers.impl;

import com.syllabixtract.api.domain.dto.CourseDto;
import com.syllabixtract.api.domain.dto.DeadlineDto;
import com.syllabixtract.api.domain.entities.DeadlineEntity;
import com.syllabixtract.api.mappers.Mapper;
import org.modelmapper.ModelMapper;

public class DeadlineMapper implements Mapper<DeadlineEntity, DeadlineDto> {

    private ModelMapper modelMapper;

    public DeadlineMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    @Override
    public DeadlineDto mapTo(DeadlineEntity deadlineEntity) {
        return modelMapper.map(deadlineEntity, DeadlineDto.class);
    }

    @Override
    public DeadlineEntity mapFrom(DeadlineDto deadlineDto) {
        return modelMapper.map(deadlineDto, DeadlineEntity.class);
    }
}
