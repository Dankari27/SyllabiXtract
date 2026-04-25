package com.syllabixtract.api.mappers.impl;

import com.syllabixtract.api.domain.dto.CourseDto;
import com.syllabixtract.api.domain.entities.CourseEntity;
import com.syllabixtract.api.mappers.Mapper;
import org.modelmapper.ModelMapper;


// Mapper from Course entity to Dto
public class CourseMapper implements Mapper<CourseEntity, CourseDto> {
    private ModelMapper modelMapper;

    public CourseMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public CourseDto mapTo(CourseEntity courseEntity) {
        return modelMapper.map(courseEntity, CourseDto.class);
    }

    @Override
    public CourseEntity mapFrom(CourseDto courseDto) {
        return modelMapper.map(courseDto, CourseEntity.class);
    }
}
