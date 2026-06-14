package com.lucasmunarolo.geradordocumentos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "template_variables", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"template_id", "name"})
})
public class TemplateVariable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "template_variable_seq")
    @SequenceGenerator(name = "template_variable_seq", sequenceName = "template_variable_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private DocumentTemplate template;

    @Column(nullable = false)
    private String name;

    public TemplateVariable() {
    }

    public Long getId() {
        return id;
    }

    public DocumentTemplate getTemplate() {
        return template;
    }

    public String getName() {
        return name;
    }

    public void setTemplate(DocumentTemplate template) {
        this.template = template;
    }

    public void setName(String name) {
        this.name = name;
    }

    

}
