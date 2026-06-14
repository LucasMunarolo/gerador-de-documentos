package com.lucasmunarolo.geradordocumentos.utils;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class VariableExtractorTest {

    @Test
    void shouldExtractSingleVariable() {
        Set<String> variables = VariableExtractor.extract("Olá {{nome}}");
        assertThat(variables).containsExactly("nome");
    }

    @Test
    void shouldExtractMultipleVariables() {
        Set<String> variables = VariableExtractor.extract("{{nome}} e {{cpf}}");
        assertThat(variables).containsExactlyInAnyOrder("nome", "cpf");
    }

    @Test
    void shouldDeduplicateVariables() {
        Set<String> variables = VariableExtractor.extract("{{nome}} e {{nome}} novamente");
        assertThat(variables).containsExactly("nome");
        assertThat(variables).hasSize(1);
    }

    @Test
    void shouldReturnEmptyWhenNoVariables() {
        Set<String> variables = VariableExtractor.extract("Texto sem variáveis");
        assertThat(variables).isEmpty();
    }

    @Test
    void shouldExtractFromNestedJson() {
        String json = """
                {"components":[{"type":"PARAGRAPH","runs":[{"text":"{{nome}} e {{cpf}}"}]}]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactlyInAnyOrder("nome", "cpf");
    }

    @Test
    void shouldExtractFromLoop() {
        String json = """
                {"components":[{"type":"LOOP","components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]}
                ]}]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactly("nome_avalista");
    }

    @Test
    void shouldExtractFromLoopRun() {
        String json = """
                {"runs":[{"text":"Os avalistas são: ","marks":[],"loopRun":{
                    "runs":[{"text":"{{nome_avalista}} ({{cpf_avalista}})","marks":[]}]
                }}]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactlyInAnyOrder("nome_avalista", "cpf_avalista");
    }

    @Test
    void shouldExtractFromConditional() {
        String json = """
                {"components":[{"type":"CONDITIONAL","variable":"tipo_pessoa","value":"PF","components":[
                    {"type":"PARAGRAPH","runs":[{"text":"CPF: {{cpf}}"}]}
                ]}]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactlyInAnyOrder("tipo_pessoa", "cpf");
    }

    @Test
    void shouldExtractFromSignature() {
        String json = """
                {"components":[{"type":"SIGNATURE","name":"{{nome_assinante}}","document":"{{cpf_assinante}}"}]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactlyInAnyOrder("nome_assinante", "cpf_assinante");
    }

    @Test
    void shouldDeduplicateAcrossMultipleComponents() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome}}"}]},
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome}} e {{cpf}}"}]}
                ]}
                """;
        Set<String> variables = VariableExtractor.extractFromDocument(json);
        assertThat(variables).containsExactlyInAnyOrder("nome", "cpf");
        assertThat(variables).hasSize(2);
    }

    // ---- extractLoopVariablesFromDocument ----

    @Test
    void shouldExtractLoopVariablesFromLoopComponent() {
        String json = """
                {"components":[{"type":"LOOP","components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}} - {{cpf_avalista}}"}]}
                ]}]}
                """;
        Set<String> loopVariables = VariableExtractor.extractLoopVariablesFromDocument(json);
        assertThat(loopVariables).containsExactlyInAnyOrder("nome_avalista", "cpf_avalista");
    }

    @Test
    void shouldExtractLoopVariablesFromLoopRun() {
        String json = """
                {"runs":[{"text":"Avalistas: ","marks":[],"loopRun":{
                    "runs":[{"text":"{{nome_avalista}} ({{cpf_avalista}})","marks":[]}]
                }}]}
                """;
        Set<String> loopVariables = VariableExtractor.extractLoopVariablesFromDocument(json);
        assertThat(loopVariables).containsExactlyInAnyOrder("nome_avalista", "cpf_avalista");
    }

    @Test
    void shouldReturnEmptyLoopVariablesWhenNoLoop() {
        String json = """
                {"components":[{"type":"PARAGRAPH","runs":[{"text":"{{nome}}"}]}]}
                """;
        Set<String> loopVariables = VariableExtractor.extractLoopVariablesFromDocument(json);
        assertThat(loopVariables).isEmpty();
    }

    @Test
    void shouldNotConfuseNormalVariablesWithLoopVariables() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_devedor}}"}]},
                    {"type":"LOOP","components":[
                        {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]}
                    ]}
                ]}
                """;
        Set<String> all = VariableExtractor.extractFromDocument(json);
        Set<String> loopVariables = VariableExtractor.extractLoopVariablesFromDocument(json);

        assertThat(all).containsExactlyInAnyOrder("nome_devedor", "nome_avalista");
        assertThat(loopVariables).containsExactly("nome_avalista");
    }

    // ---- validateNoOverlap ----

    @Test
    void shouldNotThrowWhenNoOverlapBetweenLoopAndNormalVariables() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_devedor}}"}]},
                    {"type":"LOOP","components":[
                        {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]}
                    ]}
                ]}
                """;

        VariableExtractor.validateNoOverlap(json);
        // não deve lançar exceção
    }

    @Test
    void shouldThrowWhenVariableUsedInsideAndOutsideLoopComponent() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]},
                    {"type":"LOOP","components":[
                        {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]}
                    ]}
                ]}
                """;

        assertThatThrownBy(() -> VariableExtractor.validateNoOverlap(json))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("nome_avalista");
    }

    @Test
    void shouldThrowWhenVariableUsedInsideAndOutsideLoopRun() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_avalista}}"}]},
                    {"type":"PARAGRAPH","runs":[{"text":"Lista: ","marks":[],"loopRun":{
                        "runs":[{"text":"{{nome_avalista}}","marks":[]}]
                    }}]}
                ]}
                """;

        assertThatThrownBy(() -> VariableExtractor.validateNoOverlap(json))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("nome_avalista");
    }

    @Test
    void shouldNotThrowWhenDifferentVariablesInsideAndOutsideLoop() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","runs":[{"text":"{{nome_devedor}}"}]},
                    {"type":"PARAGRAPH","runs":[{"text":"Lista: ","marks":[],"loopRun":{
                        "runs":[{"text":"{{nome_avalista}}","marks":[]}]
                    }}]}
                ]}
                """;

        VariableExtractor.validateNoOverlap(json);
        // não deve lançar exceção
    }
}
