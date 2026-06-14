package com.lucasmunarolo.geradordocumentos.document;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.enums.MarkType;

public record TextRun (
    String text,
    List<MarkType> marks,
    LoopRun loopRun
) {}
