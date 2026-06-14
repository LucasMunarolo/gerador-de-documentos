package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.components.Title;

public class TitleHtmlParser {

    public static String parse(Title title, Map<String, String> variables, Map<String, List<String>> loopVariables){
        String align = "text-align:%s;".formatted(title.alignment().name().toLowerCase());

        return "<h1 style='%s'>%s</h1>".formatted(align, TextRunHtmlParser.parse(title.runs(), variables, loopVariables));
    }
}
