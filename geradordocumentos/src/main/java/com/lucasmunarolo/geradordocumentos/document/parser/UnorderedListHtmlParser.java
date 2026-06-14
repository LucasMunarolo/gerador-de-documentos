package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lucasmunarolo.geradordocumentos.document.components.UnorderedList;

public class UnorderedListHtmlParser {

    public static String parse(UnorderedList ul, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String items = ul.elements().stream()
            .map(item -> "<li>%s</li>".formatted(TextRunHtmlParser.parse(item.runs(), variables, loopVariables)))
            .collect(Collectors.joining());
        return "<ul>%s</ul>".formatted(items);
    }

}
