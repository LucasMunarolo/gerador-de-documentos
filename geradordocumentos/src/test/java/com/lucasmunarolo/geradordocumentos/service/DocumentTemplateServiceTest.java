package com.lucasmunarolo.geradordocumentos.service;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.components.Loop;
import com.lucasmunarolo.geradordocumentos.document.components.Paragraph;
import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateRequestDTO;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.entity.TemplateVariable;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.mapper.DocumentTemplateMapper;
import com.lucasmunarolo.geradordocumentos.repository.DocumentTemplateRepository;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentTemplateServiceTest {

    @Mock
    private DocumentTemplateRepository repository;

    @Mock
    private DocumentTemplateMapper mapper;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DocumentTemplateService service;

    private Document buildDocument(String text) {
        return new Document(List.of(
                new Paragraph(null, Alignment.LEFT, List.of(new TextRun(text, List.of(), null)))));
    }

    private DocumentTemplate buildEntity(Long id, String name) {
        DocumentTemplate entity = new DocumentTemplate();
        entity.setName(name);
        entity.setDocument("{}");
        entity.setVariables(List.of());
        return entity;
    }

    private DocumentTemplateResponseDTO buildResponse(Long id, String name) {
        return new DocumentTemplateResponseDTO(id, name, buildDocument(""), List.of(), List.of(), LocalDateTime.now(),
                LocalDateTime.now());
    }

    @Test
    void shouldCreateTemplateSuccessfully() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("Texto simples"));
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        DocumentTemplateResponseDTO response = buildResponse(1L, "Contrato");

        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        DocumentTemplateResponseDTO result = service.create(dto);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Contrato");
        verify(repository).save(any());
    }

    @Test
    void shouldExtractAndPersistVariablesOnCreate() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato",
                buildDocument("{{nome}} e {{cpf}}"));
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());

        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mapper.toResponse(any())).thenReturn(buildResponse(1L, "Contrato"));

        service.create(dto);

        verify(repository).save(argThat(saved -> saved.getVariables().stream().map(TemplateVariable::getName)
                .toList().containsAll(List.of("nome", "cpf"))));
    }

    @Test
    void shouldNotDuplicateVariablesOnCreate() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato",
                buildDocument("{{nome}} e {{nome}}"));
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());

        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mapper.toResponse(any())).thenReturn(buildResponse(1L, "Contrato"));

        service.create(dto);

        verify(repository).save(argThat(saved -> saved.getVariables().size() == 1 &&
                saved.getVariables().get(0).getName().equals("nome")));
    }

    @Test
    void shouldExtractLoopVariablesOnCreate() {
        var loop = new Loop(
                List.of(new Paragraph(null, Alignment.LEFT,
                        List.of(new TextRun("{{nome_avalista}}", List.of(), null)))));
        Document docWithLoop = new Document(List.of(loop));
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", docWithLoop);
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());

        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mapper.toResponse(any())).thenReturn(buildResponse(1L, "Contrato"));

        service.create(dto);

        verify(repository).save(argThat(saved -> saved.getVariables().stream().map(TemplateVariable::getName)
                .toList().contains("nome_avalista")));
    }

    @Test
    void shouldThrowWhenVariableUsedInsideAndOutsideLoopOnCreate() {
        var loop = new Loop(
                List.of(new Paragraph(null, Alignment.LEFT,
                        List.of(new TextRun("{{nome_avalista}}", List.of(), null)))));
        // mesma variável usada fora do loop também
        Document docWithOverlap = new Document(List.of(
                new Paragraph(null, Alignment.LEFT, List.of(new TextRun("{{nome_avalista}}", List.of(), null))),
                loop));
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", docWithOverlap);

        assertThatThrownBy(() -> service.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("nome_avalista");

        verify(repository, never()).save(any());
    }

    @Test
    void shouldUpdateTemplateSuccessfully() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato Atualizado",
                buildDocument("{{nome}}"));
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());
        DocumentTemplateResponseDTO response = buildResponse(1L, "Contrato Atualizado");

        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        DocumentTemplateResponseDTO result = service.update(1L, dto);

        assertThat(result.name()).isEqualTo("Contrato Atualizado");
        verify(repository).save(entity);
    }

    @Test
    void shouldUpdateVariablesWhenJsonChanges() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("{{novo_campo}}"));
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());

        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mapper.toResponse(any())).thenReturn(buildResponse(1L, "Contrato"));

        service.update(1L, dto);

        verify(repository).save(argThat(saved -> saved.getVariables().stream().map(TemplateVariable::getName)
                .toList().contains("novo_campo")));
    }

    @Test
    void shouldThrowWhenVariableUsedInsideAndOutsideLoopOnUpdate() {
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(new java.util.ArrayList<>());

        var loop = new Loop(
                List.of(new Paragraph(null, Alignment.LEFT,
                        List.of(new TextRun("{{cpf_avalista}}", List.of(), null)))));
        Document docWithOverlap = new Document(List.of(
                new Paragraph(null, Alignment.LEFT, List.of(new TextRun("{{cpf_avalista}}", List.of(), null))),
                loop));
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", docWithOverlap);

        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        assertThatThrownBy(() -> service.update(1L, dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cpf_avalista");

        verify(repository, never()).save(any());
    }

    @Test
    void shouldThrowNotFoundWhenUpdatingNonExistentTemplate() {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("texto"));
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, dto))
                .isInstanceOf(TemplateNotFoundException.class);
    }

    @Test
    void shouldDeleteTemplateSuccessfully() {
        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository).deleteById(1L);
    }

    @Test
    void shouldThrowNotFoundWhenDeletingNonExistentTemplate() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(TemplateNotFoundException.class);
    }

    @Test
    void shouldReturnAllTemplates() {
        DocumentTemplate e1 = buildEntity(1L, "Contrato");
        DocumentTemplate e2 = buildEntity(2L, "Proposta");
        e1.setVariables(List.of());
        e2.setVariables(List.of());

        when(repository.findAll()).thenReturn(List.of(e1, e2));
        when(mapper.toResponse(e1)).thenReturn(buildResponse(1L, "Contrato"));
        when(mapper.toResponse(e2)).thenReturn(buildResponse(2L, "Proposta"));

        List<DocumentTemplateResponseDTO> result = service.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void shouldReturnEmptyListWhenNoTemplates() {
        when(repository.findAll()).thenReturn(List.of());

        List<DocumentTemplateResponseDTO> result = service.findAll();

        assertThat(result).isEmpty();
    }

    @Test
    void shouldFindTemplateById() {
        DocumentTemplate entity = buildEntity(1L, "Contrato");
        entity.setVariables(List.of());

        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(mapper.toResponse(entity)).thenReturn(buildResponse(1L, "Contrato"));

        DocumentTemplateResponseDTO result = service.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Contrato");
    }

    @Test
    void shouldThrowNotFoundWhenTemplateNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(TemplateNotFoundException.class);
    }
}