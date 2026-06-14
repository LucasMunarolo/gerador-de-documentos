package com.lucasmunarolo.geradordocumentos.document;

import java.util.List;

import com.lucasmunarolo.geradordocumentos.document.components.DocumentComponent;

public record Document(
    List<DocumentComponent> components
) {}
