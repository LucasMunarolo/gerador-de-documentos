package com.lucasmunarolo.geradordocumentos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateRequestDTO;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;
import com.lucasmunarolo.geradordocumentos.service.DocumentTemplateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/templates")
public class DocumentTemplateController {

    private final DocumentTemplateService service;

    public DocumentTemplateController(DocumentTemplateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DocumentTemplateResponseDTO> create(@RequestBody @Valid DocumentTemplateRequestDTO dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentTemplateResponseDTO> update(@PathVariable Long id, @RequestBody @Valid DocumentTemplateRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DocumentTemplateResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentTemplateResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}
