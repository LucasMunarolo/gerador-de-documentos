package com.lucasmunarolo.geradordocumentos.mapper;

import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.entity.TemplateVariable;
import com.lucasmunarolo.geradordocumentos.dto.document_template.DocumentTemplateResponseDTO;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class DocumentTemplateMapperTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DocumentTemplateMapper mapper = new DocumentTemplateMapper(objectMapper);

    private TemplateVariable buildVariable(DocumentTemplate template, String name) {
        TemplateVariable v = new TemplateVariable();
        v.setTemplate(template);
        v.setName(name);
        return v;
    }

    @Test
    void shouldSeparateNormalAndLoopVariables() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"{{nome_devedor}}","marks":[],"loopRun":null}]},
                    {"type":"LOOP","components":[
                        {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"{{nome_avalista}} - {{cpf_avalista}}","marks":[],"loopRun":null}]}
                    ]}
                ]}
                """;

        DocumentTemplate entity = new DocumentTemplate();
        entity.setName("Contrato");
        entity.setDocument(json);
        entity.setVariables(List.of(
                buildVariable(entity, "nome_devedor"),
                buildVariable(entity, "nome_avalista"),
                buildVariable(entity, "cpf_avalista")));

        DocumentTemplateResponseDTO response = mapper.toResponse(entity);

        assertThat(response.variables()).containsExactly("nome_devedor");
        assertThat(response.loopVariables()).containsExactlyInAnyOrder("nome_avalista", "cpf_avalista");
    }

    @Test
    void shouldSeparateLoopRunVariables() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"{{nome_devedor}}","marks":[],"loopRun":null}]},
                    {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"Avalistas: ","marks":[],"loopRun":{
                        "runs":[{"text":"{{nome_avalista}}","marks":[],"loopRun":null}]
                    }}]}
                ]}
                """;

        DocumentTemplate entity = new DocumentTemplate();
        entity.setName("Contrato");
        entity.setDocument(json);
        entity.setVariables(List.of(
                buildVariable(entity, "nome_devedor"),
                buildVariable(entity, "nome_avalista")));

        DocumentTemplateResponseDTO response = mapper.toResponse(entity);

        assertThat(response.variables()).containsExactly("nome_devedor");
        assertThat(response.loopVariables()).containsExactly("nome_avalista");
    }

    @Test
    void shouldReturnEmptyLoopVariablesWhenNoLoop() {
        String json = """
                {"components":[
                    {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"{{nome}}","marks":[],"loopRun":null}]}
                ]}
                """;

        DocumentTemplate entity = new DocumentTemplate();
        entity.setName("Contrato");
        entity.setDocument(json);
        entity.setVariables(List.of(buildVariable(entity, "nome")));

        DocumentTemplateResponseDTO response = mapper.toResponse(entity);

        assertThat(response.variables()).containsExactly("nome");
        assertThat(response.loopVariables()).isEmpty();
    }

    @Test
    void shouldReturnEmptyVariablesWhenAllAreLoopVariables() {
        String json = """
                {"components":[
                    {"type":"LOOP","components":[
                        {"type":"PARAGRAPH","alignment":"LEFT","runs":[{"text":"{{nome_avalista}}","marks":[],"loopRun":null}]}
                    ]}
                ]}
                """;

        DocumentTemplate entity = new DocumentTemplate();
        entity.setName("Contrato");
        entity.setDocument(json);
        entity.setVariables(List.of(buildVariable(entity, "nome_avalista")));

        DocumentTemplateResponseDTO response = mapper.toResponse(entity);

        assertThat(response.variables()).isEmpty();
        assertThat(response.loopVariables()).containsExactly("nome_avalista");
    }
}