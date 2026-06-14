package com.lucasmunarolo.geradordocumentos.controller;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.components.Paragraph;
import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateRequestDTO;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.service.DocumentTemplateService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DocumentTemplateController.class)
class DocumentTemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private DocumentTemplateService service;

    private Document buildDocument(String text) {
        return new Document(List.of(
                new Paragraph(null, Alignment.LEFT, List.of(new TextRun(text, List.of(), null)))));
    }

    private DocumentTemplateResponseDTO buildResponse(Long id, String name) {
        return new DocumentTemplateResponseDTO(id, name, buildDocument(""), List.of(), List.of(), LocalDateTime.now(),
                LocalDateTime.now());
    }

    @Test
    void shouldReturn201WhenCreatingTemplate() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("{{nome}}"));
        DocumentTemplateResponseDTO response = buildResponse(1L, "Contrato");

        when(service.create(any())).thenReturn(response);

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Contrato"));
    }

    @Test
    void shouldReturn400WhenNameIsBlank() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("", buildDocument("texto"));

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void shouldReturn400WhenDocumentIsNull() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", null);

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void shouldReturn400WhenVariableUsedInsideAndOutsideLoop() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("{{nome}}"));

        when(service.create(any())).thenThrow(
                new IllegalArgumentException(
                        "As variáveis [nome_avalista] não podem ser usadas dentro e fora de um LOOP ou loopRun no mesmo template"));

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void shouldReturn200WhenUpdatingTemplate() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato Atualizado",
                buildDocument("{{nome}}"));
        DocumentTemplateResponseDTO response = buildResponse(1L, "Contrato Atualizado");

        when(service.update(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/templates/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Contrato Atualizado"));
    }

    @Test
    void shouldReturn404WhenUpdatingNonExistentTemplate() throws Exception {
        DocumentTemplateRequestDTO dto = new DocumentTemplateRequestDTO("Contrato", buildDocument("texto"));

        when(service.update(eq(99L), any())).thenThrow(new TemplateNotFoundException(99L));

        mockMvc.perform(put("/templates/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturn204WhenDeletingTemplate() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/templates/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeletingNonExistentTemplate() throws Exception {
        doThrow(new TemplateNotFoundException(99L)).when(service).delete(99L);

        mockMvc.perform(delete("/templates/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturn200WithListOfTemplates() throws Exception {
        when(service.findAll()).thenReturn(List.of(
                buildResponse(1L, "Contrato"),
                buildResponse(2L, "Proposta")));

        mockMvc.perform(get("/templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturn200WithEmptyList() throws Exception {
        when(service.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldReturn200WithTemplateById() throws Exception {
        when(service.findById(1L)).thenReturn(buildResponse(1L, "Contrato"));

        mockMvc.perform(get("/templates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Contrato"));
    }

    @Test
    void shouldReturn404WhenTemplateNotFound() throws Exception {
        when(service.findById(99L)).thenThrow(new TemplateNotFoundException(99L));

        mockMvc.perform(get("/templates/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturnVariablesAndLoopVariablesSeparately() throws Exception {
        DocumentTemplateResponseDTO response = new DocumentTemplateResponseDTO(
                1L, "Contrato", buildDocument(""),
                List.of("nome_devedor"),
                List.of("nome_avalista", "cpf_avalista"),
                LocalDateTime.now(), LocalDateTime.now());

        when(service.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/templates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variables[0]").value("nome_devedor"))
                .andExpect(jsonPath("$.loopVariables.length()").value(2))
                .andExpect(
                        jsonPath("$.loopVariables", org.hamcrest.Matchers.hasItems("nome_avalista", "cpf_avalista")));
    }
}