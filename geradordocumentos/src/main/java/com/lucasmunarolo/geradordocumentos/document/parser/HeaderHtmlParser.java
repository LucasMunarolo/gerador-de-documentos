package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.components.Header;

public class HeaderHtmlParser {
    public static String parse(Header header, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String content = DocumentHtmlParser.parseComponents(header.components(), variables, loopVariables);
        String style = Boolean.TRUE.equals(header.border())
            ? "border-bottom:1px solid black;margin-bottom:24pt;padding-bottom:12pt;"
            : "margin-bottom:24pt;";
        return "<div style='%s'>%s</div>".formatted(style, content);
    }
}