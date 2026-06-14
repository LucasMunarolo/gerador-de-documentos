package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;

public record Header(
    List<DocumentComponent> components,
    Boolean border
) implements DocumentComponent {}