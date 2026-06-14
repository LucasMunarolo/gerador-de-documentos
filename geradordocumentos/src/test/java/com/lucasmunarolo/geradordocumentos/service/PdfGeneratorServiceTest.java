package com.lucasmunarolo.geradordocumentos.service;

import com.lucasmunarolo.geradordocumentos.exception.PdfGenerationException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PdfGeneratorServiceTest {

    private final PdfGeneratorService service = new PdfGeneratorService();

    @Test
    void shouldGeneratePdfFromHtml() {
        String html = "<p>Contrato de teste</p>";

        byte[] result = service.generate(html);

        assertThat(result).isNotEmpty();
        // PDF sempre começa com %PDF
        assertThat(new String(result, 0, 4)).isEqualTo("%PDF");
    }

    @Test
    void shouldGeneratePdfWithFormattedContent() {
        String html = """
            <h1>Título</h1>
            <p><strong>Negrito</strong> e <em>itálico</em></p>
            <ul><li>Item 1</li><li>Item 2</li></ul>
            """;

        byte[] result = service.generate(html);

        assertThat(result).isNotEmpty();
    }

    @Test
    void shouldThrowPdfGenerationExceptionOnInvalidHtml() {
        String invalidHtml = "<<invalid>>&&&";

        assertThatThrownBy(() -> service.generate(invalidHtml))
            .isInstanceOf(PdfGenerationException.class);
    }
}