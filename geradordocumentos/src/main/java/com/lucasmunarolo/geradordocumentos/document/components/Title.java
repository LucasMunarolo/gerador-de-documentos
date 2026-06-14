package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.TextRun;
import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;

public record Title(
    List<TextRun> runs,
    Alignment alignment
) implements DocumentComponent {

}
