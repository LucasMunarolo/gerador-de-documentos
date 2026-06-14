package com.lucasmunarolo.geradordocumentos.utils;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VariableExtractor {

    private static final Pattern TEMPLATE_VAR_PATTERN = Pattern.compile("\\{\\{(\\w+)\\}\\}");
    private static final Pattern CONDITIONAL_VAR_PATTERN = Pattern.compile("\"variable\"\\s*:\\s*\"(\\w+)\"");

    public static Set<String> extract(String text) {
        Set<String> variables = new LinkedHashSet<>();
        Matcher matcher = TEMPLATE_VAR_PATTERN.matcher(text);
        while (matcher.find()) {
            variables.add(matcher.group(1));
        }
        return variables;
    }

    public static Set<String> extractFromDocument(String json) {
        Set<String> variables = new LinkedHashSet<>();
        variables.addAll(extract(json));

        Matcher matcher = CONDITIONAL_VAR_PATTERN.matcher(json);
        while (matcher.find()) {
            variables.add(matcher.group(1));
        }
        return variables;
    }

    public static Set<String> extractLoopVariablesFromDocument(String json) {
        Set<String> loopVars = new LinkedHashSet<>();
        loopVars.addAll(extractFromBlocks(json, "\"type\"\\s*:\\s*\"LOOP\"", "\"components\""));
        loopVars.addAll(extractFromBlocks(json, "\"loopRun\"\\s*:\\s*\\{", "\"runs\""));
        return loopVars;
    }

    private static Set<String> extractFromBlocks(String json, String startPatternStr, String arrayKey) {
        Set<String> vars = new LinkedHashSet<>();
        Pattern startPattern = Pattern.compile(startPatternStr);
        Matcher matcher = startPattern.matcher(json);

        int searchFrom = 0;
        while (matcher.find(searchFrom)) {
            int arrayKeyIdx = json.indexOf(arrayKey, matcher.end());
            if (arrayKeyIdx == -1) {
                searchFrom = matcher.end();
                continue;
            }

            int arrayStart = json.indexOf("[", arrayKeyIdx);
            if (arrayStart == -1) {
                searchFrom = matcher.end();
                continue;
            }

            int depth = 0, i = arrayStart;
            for (; i < json.length(); i++) {
                char c = json.charAt(i);
                if (c == '[')
                    depth++;
                else if (c == ']') {
                    depth--;
                    if (depth == 0)
                        break;
                }
            }
            vars.addAll(extract(json.substring(arrayStart, i + 1)));
            searchFrom = i + 1;
        }
        return vars;
    }

    public static void validateNoOverlap(String json) {
        Set<String> loopVars = extractLoopVariablesFromDocument(json);

        String withoutLoops = removeLoopBlocks(json, "\"type\"\\s*:\\s*\"LOOP\"", "\"components\"");
        String withoutAnyLoop = removeLoopBlocks(withoutLoops, "\"loopRun\"\\s*:\\s*\\{", "\"runs\"");

        Set<String> outsideLoop = extract(withoutAnyLoop);
        outsideLoop.retainAll(loopVars);

        if (!outsideLoop.isEmpty()) {
            throw new IllegalArgumentException(
                    "As variáveis %s não podem ser usadas dentro e fora de um LOOP ou loopRun no mesmo template"
                            .formatted(outsideLoop));
        }
    }

    private static String removeLoopBlocks(String json, String startPatternStr, String arrayKey) {
        StringBuilder result = new StringBuilder(json);
        Pattern startPattern = Pattern.compile(startPatternStr);

        int searchFrom = 0;
        while (true) {
            Matcher matcher = startPattern.matcher(result);
            if (!matcher.find(searchFrom))
                break;

            int arrayKeyIdx = result.indexOf(arrayKey, matcher.end());
            if (arrayKeyIdx == -1) {
                searchFrom = matcher.end();
                continue;
            }

            int arrayStart = result.indexOf("[", arrayKeyIdx);
            if (arrayStart == -1) {
                searchFrom = matcher.end();
                continue;
            }

            int depth = 0, i = arrayStart;
            for (; i < result.length(); i++) {
                char c = result.charAt(i);
                if (c == '[')
                    depth++;
                else if (c == ']') {
                    depth--;
                    if (depth == 0)
                        break;
                }
            }
            result.replace(arrayStart, i + 1, "[]");
            searchFrom = arrayStart + 2; // avança após o "[]"
        }
        return result.toString();
    }

}
