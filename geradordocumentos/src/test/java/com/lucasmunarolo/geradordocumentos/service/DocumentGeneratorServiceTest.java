package com.lucasmunarolo.geradordocumentos.service;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.components.Paragraph;
import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;
import com.lucasmunarolo.geradordocumentos.document.parser.DocumentHtmlParser;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.exception.PdfGenerationException;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.repository.DocumentTemplateRepository;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentGeneratorServiceTest {

    @Mock
    private DocumentTemplateRepository repository;

    @Mock
    private DocumentHtmlParser htmlParser;

    @Mock
    private PdfGeneratorService pdfGeneratorService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DocumentGeneratorService service;

    private DocumentTemplate buildTemplate() throws Exception {
        Document document = new Document(List.of(
            new Paragraph(null, Alignment.LEFT, List.of(new TextRun("Olá {{nome}}", List.of(), null)))
        ));
        DocumentTemplate entity = new DocumentTemplate();
        entity.setName("Contrato");
        entity.setDocument(new ObjectMapper().writeValueAsString(document));
        entity.setVariables(List.of());
        return entity;
    }

    @Test
    void shouldGeneratePdfSuccessfully() throws Exception {
        DocumentTemplate template = buildTemplate();
        byte[] expectedPdf = new byte[]{1, 2, 3};

        when(repository.findById(1L)).thenReturn(Optional.of(template));
        when(htmlParser.parse(any(), any(), any())).thenReturn("<p>Olá João</p>");
        when(pdfGeneratorService.generate(anyString())).thenReturn(expectedPdf);

        byte[] result = service.generate(1L, Map.of("nome", "João"), Map.of());

        assertThat(result).isEqualTo(expectedPdf);
    }

    @Test
    void shouldThrowNotFoundWhenTemplateNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generate(99L, Map.of(), Map.of()))
            .isInstanceOf(TemplateNotFoundException.class);
    }

    @Test
    void shouldResolveVariablesBeforeGenerating() throws Exception {
        DocumentTemplate template = buildTemplate();
        Map<String, String> variables = Map.of("nome", "João");
        Map<String, List<String>> loopVariables = Map.of();

        when(repository.findById(1L)).thenReturn(Optional.of(template));
        when(htmlParser.parse(any(), any(), any())).thenReturn("<p>Olá João</p>");
        when(pdfGeneratorService.generate(anyString())).thenReturn(new byte[]{1});

        service.generate(1L, variables, loopVariables);

        verify(htmlParser).parse(any(), eq(variables), eq(loopVariables));
    }

    @Test
    void shouldPassLoopVariablesToParser() throws Exception {
        DocumentTemplate template = buildTemplate();
        Map<String, String> variables = Map.of();
        Map<String, List<String>> loopVariables = Map.of(
            "nome_avalista", List.of("Lucas", "Marcos"),
            "cpf_avalista", List.of("111.111.111-11", "222.222.222-22")
        );

        when(repository.findById(1L)).thenReturn(Optional.of(template));
        when(htmlParser.parse(any(), any(), any())).thenReturn("<p>html</p>");
        when(pdfGeneratorService.generate(anyString())).thenReturn(new byte[]{1});

        service.generate(1L, variables, loopVariables);

        verify(htmlParser).parse(any(), eq(variables), eq(loopVariables));
    }

    @Test
    void shouldThrowWhenLoopVariablesHaveDifferentSizes() {
        Map<String, List<String>> loopVariables = Map.of(
            "nome_avalista", List.of("Lucas", "Marcos"),
            "cpf_avalista", List.of("111.111.111-11")
        );

        assertThatThrownBy(() -> service.generate(1L, Map.of(), loopVariables))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("mesmo tamanho");
    }

    @Test
    void shouldThrowPdfGenerationExceptionOnError() throws Exception {
        DocumentTemplate template = buildTemplate();

        when(repository.findById(1L)).thenReturn(Optional.of(template));
        when(htmlParser.parse(any(), any(), any())).thenReturn("<p>html</p>");
        when(pdfGeneratorService.generate(anyString()))
            .thenThrow(new PdfGenerationException("Erro"));

        assertThatThrownBy(() -> service.generate(1L, Map.of(), Map.of()))
            .isInstanceOf(PdfGenerationException.class);
    }
}