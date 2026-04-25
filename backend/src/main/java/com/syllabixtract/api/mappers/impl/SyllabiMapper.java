package com.syllabixtract.api.mappers.impl;

import com.syllabixtract.api.domain.dto.SyllabiDto;
import com.syllabixtract.api.domain.entities.SyllabiEntity;
import com.syllabixtract.api.mappers.Mapper;
import org.modelmapper.ModelMapper;

public class SyllabiMapper implements Mapper<SyllabiEntity, SyllabiDto> {
    private ModelMapper modelMapper;

    public SyllabiMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public SyllabiDto mapTo(SyllabiEntity syllabiEntity) {
        return modelMapper.map(syllabiEntity, SyllabiDto.class);
    }

    @Override
    public SyllabiEntity mapFrom(SyllabiDto syllabiDto) {
        return modelMapper.map(syllabiDto, SyllabiEntity.class);
    }
}



