package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;

public record Paragraph (
    Integer marginLeft, // Ex: 12pt
    Alignment alignment,
    List<TextRun> runs
) implements DocumentComponent {}
