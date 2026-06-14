package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lucasmunarolo.geradordocumentos.document.components.Clause;

public class ClauseHtmlParser {

    public static String parse(Clause clause, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String prefix = clause.number().stream()
            .map(String::valueOf)
            .collect(Collectors.joining(".")) + ".";

        return "<p><strong>%s %s</strong></p>".formatted(prefix, TextRunHtmlParser.parse(clause.runs(), variables, loopVariables));
    }

}
