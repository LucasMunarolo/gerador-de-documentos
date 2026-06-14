package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.TextRun;

public record Clause (
    List<Integer> number, 
    List<TextRun> runs   
) implements DocumentComponent {}
