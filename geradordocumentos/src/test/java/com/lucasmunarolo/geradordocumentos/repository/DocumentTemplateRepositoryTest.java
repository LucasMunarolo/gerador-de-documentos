package com.lucasmunarolo.geradordocumentos.repository;

import com.lucasmunarolo.geradordocumentos.config.JpaAuditingConfig;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;
import com.lucasmunarolo.geradordocumentos.entity.TemplateVariable;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import(JpaAuditingConfig.class)
class DocumentTemplateRepositoryTest {

    @Autowired
    private DocumentTemplateRepository repository;

    private DocumentTemplate buildTemplate(String name) {
        DocumentTemplate entity = new DocumentTemplate();
        entity.setName(name);
        entity.setDocument("{\"components\":[]}");
        entity.setVariables(new ArrayList<>());
        return entity;
    }

    private TemplateVariable buildVariable(DocumentTemplate template, String name) {
        TemplateVariable v = new TemplateVariable();
        v.setTemplate(template);
        v.setName(name);
        return v;
    }

    @Test
    void shouldSaveTemplate() {
        DocumentTemplate entity = buildTemplate("Contrato");
        DocumentTemplate saved = repository.save(entity);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Contrato");
    }

    @Test
    void shouldFindById() {
        DocumentTemplate saved = repository.save(buildTemplate("Contrato"));

        Optional<DocumentTemplate> found = repository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Contrato");
    }

    @Test
    void shouldReturnEmptyWhenNotFound() {
        Optional<DocumentTemplate> found = repository.findById(999L);
        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindAll() {
        repository.save(buildTemplate("Contrato"));
        repository.save(buildTemplate("Proposta"));

        List<DocumentTemplate> all = repository.findAll();

        assertThat(all).hasSize(2);
    }

    @Test
    void shouldDeleteById() {
        DocumentTemplate saved = repository.save(buildTemplate("Contrato"));
        repository.deleteById(saved.getId());

        assertThat(repository.findById(saved.getId())).isEmpty();
    }

    @Test
    void shouldPersistVariablesWithTemplate() {
        DocumentTemplate entity = buildTemplate("Contrato");
        entity.getVariables().add(buildVariable(entity, "nome"));
        entity.getVariables().add(buildVariable(entity, "cpf"));

        DocumentTemplate saved = repository.save(entity);

        assertThat(saved.getVariables()).hasSize(2);
        assertThat(saved.getVariables().stream().map(TemplateVariable::getName).toList())
            .containsExactlyInAnyOrder("nome", "cpf");
    }

    @Test
    void shouldDeleteVariablesWhenTemplateIsDeleted() {
        DocumentTemplate entity = buildTemplate("Contrato");
        entity.getVariables().add(buildVariable(entity, "nome"));
        DocumentTemplate saved = repository.save(entity);

        repository.deleteById(saved.getId());

        assertThat(repository.findById(saved.getId())).isEmpty();
    }

    @Test
    void shouldEnforceUniqueVariablePerTemplate() {
        DocumentTemplate entity = buildTemplate("Contrato");
        entity.getVariables().add(buildVariable(entity, "nome"));
        entity.getVariables().add(buildVariable(entity, "nome")); // duplicada

        assertThatThrownBy(() -> repository.saveAndFlush(entity))
            .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void shouldAllowSameVariableNameInDifferentTemplates() {
        DocumentTemplate t1 = buildTemplate("Contrato");
        t1.getVariables().add(buildVariable(t1, "nome"));

        DocumentTemplate t2 = buildTemplate("Proposta");
        t2.getVariables().add(buildVariable(t2, "nome"));

        repository.save(t1);
        repository.save(t2);

        assertThat(repository.findAll()).hasSize(2);
    }
}