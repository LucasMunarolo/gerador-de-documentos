package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

public record Conditional(
    String variable,
    String value,
    List<DocumentComponent> components
) implements DocumentComponent {}
