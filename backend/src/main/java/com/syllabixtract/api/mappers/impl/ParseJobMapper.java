package com.syllabixtract.api.mappers.impl;

import com.syllabixtract.api.domain.dto.ParseJobDto;
import com.syllabixtract.api.domain.dto.SyllabiDto;
import com.syllabixtract.api.domain.entities.ParseJobEntity;
import com.syllabixtract.api.mappers.Mapper;
import org.modelmapper.ModelMapper;

public class ParseJobMapper implements Mapper<ParseJobEntity, ParseJobDto> {

    private ModelMapper modelmapper;

    public ParseJobMapper(ModelMapper modelmapper) {
        this.modelmapper = modelmapper;
    }

    @Override
    public ParseJobDto mapTo(ParseJobEntity parseJobEntity) {
        return modelmapper.map(parseJobEntity, ParseJobDto.class);
    }

    @Override
    public ParseJobEntity mapFrom(ParseJobDto parseJobDto) {
        return modelmapper.map(parseJobDto, ParseJobEntity.class);
    }
}
