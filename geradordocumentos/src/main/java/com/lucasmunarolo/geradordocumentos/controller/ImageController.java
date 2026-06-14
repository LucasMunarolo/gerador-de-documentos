package com.lucasmunarolo.geradordocumentos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lucasmunarolo.geradordocumentos.dto.image.ImageUploadResponseDTO;
import com.lucasmunarolo.geradordocumentos.service.ImageService;

@RestController
@RequestMapping("/images")
public class ImageController {

    private final ImageService service;

    public ImageController(ImageService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<ImageUploadResponseDTO> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(201).body(service.upload(file));
    }
}
