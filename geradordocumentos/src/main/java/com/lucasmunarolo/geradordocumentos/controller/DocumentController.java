package com.lucasmunarolo.geradordocumentos.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lucasmunarolo.geradordocumentos.dto.document.DocumentGenerateRequestDTO;
import com.lucasmunarolo.geradordocumentos.service.DocumentGeneratorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentGeneratorService service;

    public DocumentController(DocumentGeneratorService service) {
        this.service = service;
    }

    @PostMapping("/{templateId}/generate")
    public ResponseEntity<byte[]> generate(
            @PathVariable Long templateId,
            @RequestBody @Valid DocumentGenerateRequestDTO dto) {

        byte[] pdf = service.generate(templateId, dto.variables(), dto.loopVariables());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"documento_%d.pdf\"".formatted(templateId))
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/{templateId}/preview")
    public ResponseEntity<String> preview(
            @PathVariable Long templateId,
            @RequestBody @Valid DocumentGenerateRequestDTO dto) {

        String html = service.generateHtml(
                templateId,
                dto.variables(),
                dto.loopVariables() != null ? dto.loopVariables() : Map.of());

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
