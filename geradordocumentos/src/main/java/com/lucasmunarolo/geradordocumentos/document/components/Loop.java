package com.lucasmunarolo.geradordocumentos.document.components;

import java.util.List;  

public record Loop(
    List<DocumentComponent> components
) implements DocumentComponent {}
