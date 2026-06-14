package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.components.Loop;

public class LoopHtmlParser {
    public static String parse(Loop loop, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        if (loopVariables == null || loopVariables.isEmpty())
            return "";

        int size = loopVariables.values().iterator().next().size();
        StringBuilder html = new StringBuilder();

        for (int i = 0; i < size; i++) {
            Map<String, String> merged = new HashMap<>(variables);
            final int index = i;
            loopVariables.forEach((key, list) -> merged.put(key, list.get(index)));
            html.append(DocumentHtmlParser.parseComponents(loop.components(), merged, loopVariables));
        }
        return html.toString();
    }
}