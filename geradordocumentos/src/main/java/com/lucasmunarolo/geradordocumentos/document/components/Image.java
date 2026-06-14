package com.lucasmunarolo.geradordocumentos.document.components;

import com.lucasmunarolo.geradordocumentos.document.enums.Alignment;

public record Image(
    String url,
    Integer width,  // pt
    Integer height, // pt
    Alignment alignment
) implements DocumentComponent {}