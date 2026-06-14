package com.lucasmunarolo.geradordocumentos.document.parser;

import java.util.List;
import java.util.Map;

import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.components.Image;

public class ImageHtmlParser {
    public static String parse(Image image, Map<String, String> variables, Map<String, List<String>> loopVariables) {
        String url = TextRunHtmlParser.parse(List.of(new TextRun(image.url(), List.of(), null)), variables, loopVariables);
        String align = image.alignment() != null ? image.alignment().name().toLowerCase() : "left";
        return "<div style='text-align:%s;'><img src='%s' style='width:%dpt;height:%dpt;'/></div>"
            .formatted(align, url, image.width(), image.height());
    }
}
