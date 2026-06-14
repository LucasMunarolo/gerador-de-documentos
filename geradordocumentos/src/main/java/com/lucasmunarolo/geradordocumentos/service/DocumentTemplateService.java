package com.lucasmunarolo.geradordocumentos.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateRequestDTO;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.entity.TemplateVariable;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.mapper.DocumentTemplateMapper;
import com.lucasmunarolo.geradordocumentos.repository.DocumentTemplateRepository;
import com.lucasmunarolo.geradordocumentos.utils.VariableExtractor;

import tools.jackson.databind.ObjectMapper;

@Service
public class DocumentTemplateService {

    private final DocumentTemplateRepository repository;
    private final DocumentTemplateMapper mapper;
    private final ObjectMapper objectMapper;

    public DocumentTemplateService(
        DocumentTemplateRepository repository, 
        DocumentTemplateMapper mapper, 
        ObjectMapper objectMapper) {
            this.repository = repository;
            this.mapper = mapper;
            this.objectMapper = objectMapper;
    }

    public DocumentTemplateResponseDTO create(DocumentTemplateRequestDTO dto) {
        String json = objectMapper.writeValueAsString(dto.document());
        VariableExtractor.validateNoOverlap(json);
        DocumentTemplate entity = mapper.toEntity(dto);

        List<TemplateVariable> variables = VariableExtractor.extractFromDocument(json).stream()
            .map(name -> { 
                TemplateVariable v = new TemplateVariable();
                v.setTemplate(entity);
                v.setName(name);
                return v;
            }).toList();
        entity.setVariables(variables);
        return mapper.toResponse(repository.save(entity));
    }

    public DocumentTemplateResponseDTO update(Long id, DocumentTemplateRequestDTO dto) {
        DocumentTemplate entity = repository.findById(id)
            .orElseThrow(() -> new TemplateNotFoundException(id));
        String json = objectMapper.writeValueAsString(dto.document());
        VariableExtractor.validateNoOverlap(json);

        entity.setName(dto.name());
        entity.setDocument(objectMapper.writeValueAsString(dto.document()));
        entity.getVariables().clear();
        VariableExtractor.extractFromDocument(entity.getDocument()).stream()
            .map(name -> {
                TemplateVariable v = new TemplateVariable();
                v.setTemplate(entity);
                v.setName(name);
                return v;
            }).forEach(entity.getVariables()::add);
        return mapper.toResponse(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new TemplateNotFoundException(id);
        repository.deleteById(id);
    }

    public List<DocumentTemplateResponseDTO> findAll() {
        List<DocumentTemplateResponseDTO> result = new ArrayList<>();
        for (DocumentTemplate e : repository.findAll()) result.add(mapper.toResponse(e));
        return result;
    }

    public DocumentTemplateResponseDTO findById(Long id) {
        return mapper.toResponse(repository.findById(id)
            .orElseThrow(() -> new TemplateNotFoundException(id)));
    }

}
