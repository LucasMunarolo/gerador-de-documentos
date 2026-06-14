package com.lucasmunarolo.geradordocumentos.dto.document;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotNull;

public record DocumentGenerateRequestDTO(
    @NotNull Map<String, String> variables,
    Map<String, List<String>> loopVariables
) {}
