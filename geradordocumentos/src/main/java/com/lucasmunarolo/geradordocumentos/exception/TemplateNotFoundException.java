package com.lucasmunarolo.geradordocumentos.exception;

public class TemplateNotFoundException extends RuntimeException {
    public TemplateNotFoundException(Long id) {
        super("Document Template not found: " + id);
    }
}
