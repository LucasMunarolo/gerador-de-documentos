package com.lucasmunarolo.geradordocumentos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties()
public class GeradordocumentosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GeradordocumentosApplication.class, args);
	}

}
