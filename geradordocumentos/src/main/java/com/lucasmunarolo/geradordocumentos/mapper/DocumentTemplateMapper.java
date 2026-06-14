package com.lucasmunarolo.geradordocumentos.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateRequestDTO;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.entity.TemplateVariable;
import com.lucasmunarolo.geradordocumentos.utils.VariableExtractor;

import tools.jackson.databind.ObjectMapper;

@Component
public class DocumentTemplateMapper {

    private final ObjectMapper objectMapper;

    public DocumentTemplateMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public DocumentTemplate toEntity(DocumentTemplateRequestDTO dto) {
        DocumentTemplate entity = new DocumentTemplate();
        entity.setName(dto.name());
        entity.setDocument(objectMapper.writeValueAsString(dto.document()));
        return entity;
    }

    public DocumentTemplateResponseDTO toResponse(DocumentTemplate entity) {
        Document document = objectMapper.readValue(entity.getDocument(), Document.class);

        Set<String> loopVars = VariableExtractor.extractLoopVariablesFromDocument(entity.getDocument());

        List<String> variables = entity.getVariables().stream()
                .map(TemplateVariable::getName)
                .filter(v -> !loopVars.contains(v))
                .toList();

        return new DocumentTemplateResponseDTO(
                entity.getId(),
                entity.getName(),
                document,
                variables,
                new ArrayList<>(loopVars),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

}
