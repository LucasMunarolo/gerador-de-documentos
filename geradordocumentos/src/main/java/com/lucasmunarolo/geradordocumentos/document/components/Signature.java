package com.lucasmunarolo.geradordocumentos.document.components;

public record Signature(
    String name,
    String document
) implements DocumentComponent {}
