package com.lucasmunarolo.geradordocumentos.dto.document_template;

import java.time.LocalDateTime;
import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.Document;

public record DocumentTemplateResponseDTO(
    Long id,
    String name,
    Document document,
    List<String> variables,
    List<String> loopVariables,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
