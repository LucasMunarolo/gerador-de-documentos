CREATE SEQUENCE template_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE template_variable_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE document_templates (
    id BIGINT PRIMARY KEY DEFAULT nextval('template_seq'),
    name VARCHAR(255) NOT NULL,
    document TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE template_variables (
    id BIGINT PRIMARY KEY DEFAULT nextval('template_variable_seq'),
    template_id BIGINT NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT uq_template_variable UNIQUE (template_id, name)
);