package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.components.Paragraph;

public class ParagraphHtmlParser {

    public static String parse(Paragraph paragraph, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String marginLeft = paragraph.marginLeft() != null ? "margin-left:%dpt;".formatted(paragraph.marginLeft()) : "";
        String align = "text-align:%s;".formatted(paragraph.alignment().name().toLowerCase());

        return "<p style='%s%s'>%s</p>".formatted(marginLeft, align, TextRunHtmlParser.parse(paragraph.runs(), variables, loopVariables));
    }

}
