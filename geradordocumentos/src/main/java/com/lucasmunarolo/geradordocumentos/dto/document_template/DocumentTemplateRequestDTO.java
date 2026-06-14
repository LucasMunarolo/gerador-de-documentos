package com.lucasmunarolo.geradordocumentos.dto.document_template;

import com.lucasmunarolo.geradordocumentos.document.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentTemplateRequestDTO(
    @NotBlank String name,
    @NotNull Document document
) {

}
