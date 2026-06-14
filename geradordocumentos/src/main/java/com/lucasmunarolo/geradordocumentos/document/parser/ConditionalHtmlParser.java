package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.components.Conditional;

public class ConditionalHtmlParser {
    public static String parse(Conditional conditional, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String actual = variables.getOrDefault(conditional.variable(), "");
        if (!actual.equals(conditional.value())) return "";
        return DocumentHtmlParser.parseComponents(conditional.components(), variables, loopVariables);
    }
}
