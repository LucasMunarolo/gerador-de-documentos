package com.lucasmunarolo.geradordocumentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lucasmunarolo.geradordocumentos.entity.DocumentTemplate;

public interface DocumentTemplateRepository extends JpaRepository<DocumentTemplate, Long> {

}
