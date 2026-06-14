package com.lucasmunarolo.geradordocumentos.document.parser;

import com.lucasmunarolo.geradordocumentos.document.components.LineBreak;

public class LineBreakHtmlParser {

    public static String parse(LineBreak lineBreak) {
        return "<div style='height:%dpt'></div>".formatted(lineBreak.points());
    }

}
