package com.lucasmunarolo.geradordocumentos.service;

import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.lucasmunarolo.geradordocumentos.exception.PdfGenerationException;

@Service
public class PdfGeneratorService {

    public byte[] generate(String html) {
        try {
            String xhtml = wrapHtml(html);
            String[] lines = xhtml.split("\n");

            for (int i = 0; i < lines.length; i++) {
                System.out.printf("%04d %s%n", i + 1, lines[i]);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(xhtml);
            renderer.layout();
            renderer.createPDF(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new PdfGenerationException("Error generating PDF: " + e.getMessage());
        }
    }

    private String wrapHtml(String content) {
        return """
                <?xml version="1.0" encoding="UTF-8"?>
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
                    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="UTF-8"/>
                    <style>
                        @page {
                            size: A4;
                            margin: 2.5cm;
                        }
                        body {
                            font-family: Times New Roman, serif;
                            font-size: 12pt;
                            line-height: 1.6;
                            color: #1a1a1a;
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
                    %s
                </body>
                </html>
                """.formatted(content);
    }
}
