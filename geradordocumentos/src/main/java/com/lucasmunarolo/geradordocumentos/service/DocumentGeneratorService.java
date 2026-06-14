package com.lucasmunarolo.geradordocumentos.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lucasmunarolo.geradordocumentos.document.Document;
import com.lucasmunarolo.geradordocumentos.document.parser.DocumentHtmlParser;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.exception.TemplateNotFoundException;
import com.lucasmunarolo.geradordocumentos.repository.DocumentTemplateRepository;

import tools.jackson.databind.ObjectMapper;

@Service
public class DocumentGeneratorService {

    private final DocumentTemplateRepository repository;
    private final DocumentHtmlParser htmlParser;
    private final PdfGeneratorService pdfGeneratorService;
    private final ObjectMapper objectMapper;

    public DocumentGeneratorService(
            DocumentTemplateRepository repository,
            DocumentHtmlParser htmlParser,
            PdfGeneratorService pdfGeneratorService,
            ObjectMapper objectMapper) {
        this.repository = repository;
        this.htmlParser = htmlParser;
        this.pdfGeneratorService = pdfGeneratorService;
        this.objectMapper = objectMapper;
    }

    private String parseContent(Long templateId, Map<String, String> variables,
            Map<String, List<String>> loopVariables) {
        if (loopVariables != null && !loopVariables.isEmpty()) {
            int size = loopVariables.values().iterator().next().size();
            boolean invalidSize = loopVariables.values().stream().anyMatch(l -> l.size() != size);
            if (invalidSize)
                throw new IllegalArgumentException("Todas as listas de loopVariables devem ter o mesmo tamanho");
        }
        DocumentTemplate template = repository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException(templateId));

        Document document = objectMapper.readValue(template.getDocument(), Document.class);
        return htmlParser.parse(document, variables, loopVariables != null ? loopVariables : Map.of());
    }

    public byte[] generate(Long templateId, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String content = parseContent(templateId, variables, loopVariables);
        return pdfGeneratorService.generate(content);
    }

    public String generateHtml(Long templateId, Map<String, String> variables,
            Map<String, List<String>> loopVariables) {
        String content = parseContent(templateId, variables, loopVariables);
        return wrapPreviewHtml(content);
    }

    private String wrapPreviewHtml(String content) {
        String template = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8"/>
                    <style>
                        body {
                            font-family: 'Times New Roman', serif;
                            font-size: 12pt;
                            line-height: 1.6;
                            color: #1a1a1a;
                            background: #e5e5e5;
                            margin: 0;
                            padding: 24px 0;
                        }
                        .page {
                            background: white;
                            width: 21cm;
                            min-height: 29.7cm;
                            margin: 0 auto;
                            padding: 2.5cm;
                            box-shadow: 0 0 8px rgba(0,0,0,0.15);
                            box-sizing: border-box;
                        }
                        h1 { font-size: 16pt; }
                        p { margin: 4pt 0; text-align: justify; }
                        ul { margin: 4pt 0; padding-left: 20pt; }
                        li { margin: 2pt 0; }
                        strong { font-weight: bold; }
                        em { font-style: italic; }
                        u { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="page">
                        ###CONTENT###
                    </div>
                </body>
                </html>
                """;
        return template.replace("###CONTENT###", content);
    }
}
