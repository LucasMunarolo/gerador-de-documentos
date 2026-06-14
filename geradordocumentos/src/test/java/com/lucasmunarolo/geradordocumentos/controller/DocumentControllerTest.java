package com.lucasmunarolo.geradordocumentos.controller;

import com.lucasmunarolo.geradordocumentos.dto.document.DocumentGenerateRequestDTO;
import com.lucasmunarolo.geradordocumentos.exception.PdfGenerationException;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.service.DocumentGeneratorService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private DocumentGeneratorService service;

    @Test
    void shouldReturn200WithPdfWhenGenerating() throws Exception {
        byte[] pdf = new byte[]{1, 2, 3};
        when(service.generate(eq(1L), any(), any())).thenReturn(pdf);

        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(Map.of("nome", "João"), Map.of());

        mockMvc.perform(post("/documents/1/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void shouldReturnContentDispositionHeader() throws Exception {
        when(service.generate(eq(1L), any(), any())).thenReturn(new byte[]{1});

        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(Map.of(), Map.of());

        mockMvc.perform(post("/documents/1/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(header().string("Content-Disposition", "attachment; filename=\"documento_1.pdf\""));
    }

    @Test
    void shouldReturn404WhenTemplateNotFound() throws Exception {
        when(service.generate(eq(99L), any(), any())).thenThrow(new TemplateNotFoundException(99L));

        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(Map.of(), Map.of());

        mockMvc.perform(post("/documents/99/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturn400WhenVariablesIsNull() throws Exception {
        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(null, null);

        mockMvc.perform(post("/documents/1/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void shouldReturn400WhenLoopVariablesHaveDifferentSizes() throws Exception {
        when(service.generate(eq(1L), any(), any()))
            .thenThrow(new IllegalArgumentException("Todas as listas de loopVariables devem ter o mesmo tamanho"));

        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(
            Map.of(),
            Map.of(
                "nome_avalista", List.of("Lucas", "Marcos"),
                "cpf_avalista", List.of("111.111.111-11")
            )
        );

        mockMvc.perform(post("/documents/1/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn500WhenPdfGenerationFails() throws Exception {
        when(service.generate(eq(1L), any(), any()))
            .thenThrow(new PdfGenerationException("Erro ao gerar PDF"));

        DocumentGenerateRequestDTO dto = new DocumentGenerateRequestDTO(Map.of(), Map.of());

        mockMvc.perform(post("/documents/1/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.status").value(500));
    }
}
