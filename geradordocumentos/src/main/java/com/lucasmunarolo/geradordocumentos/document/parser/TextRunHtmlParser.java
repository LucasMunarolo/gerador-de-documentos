package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lucasmunarolo.geradordocumentos.document.LoopRun;
import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.enums.MarkType;

public class TextRunHtmlParser {

    public static String parse(List<TextRun> runs, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        return runs.stream().map(run -> {
            if (run.loopRun() != null) return parseLoopRun(run.loopRun(), variables, loopVariables);
            String text = resolveVariables(run.text(), variables);
            if (run.marks().contains(MarkType.BOLD)) text = "<strong>%s</strong>".formatted(text);
            if (run.marks().contains(MarkType.ITALIC)) text = "<em>%s</em>".formatted(text);
            if (run.marks().contains(MarkType.UNDERLINE)) text = "<u>%s</u>".formatted(text);
            return text;
        }).collect(Collectors.joining());
    }

    private static String parseLoopRun(LoopRun loopRun, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        if (loopVariables == null || loopVariables.isEmpty()) return "";
        int size = loopVariables.values().iterator().next().size();
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < size; i++) {
            Map<String, String> merged = new HashMap<>(variables);
            final int index = i;
            loopVariables.forEach((key, list) -> merged.put(key, list.get(index)));
            result.append(parse(loopRun.runs(), merged, loopVariables));
        }
        return result.toString();
    }

    private static String resolveVariables(String text, Map<String, String> variables) {
        for (var entry : variables.entrySet()) {
            text = text.replace("{{%s}}".formatted(entry.getKey()), entry.getValue());
        }
        return text;
    }

}
