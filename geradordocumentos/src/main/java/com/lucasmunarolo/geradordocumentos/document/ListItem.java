package com.lucasmunarolo.geradordocumentos.document;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;

public record ListItem(
    Integer marginLeft,
    Alignment alignment,
    List<TextRun> runs
) {}