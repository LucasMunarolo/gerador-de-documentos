package com.lucasmunarolo.geradordocumentos.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lucasmunarolo.geradordocumentos.dto.image.ImageUploadResponseDTO;
import com.lucasmunarolo.geradordocumentos.exception.ImageUploadException;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @SuppressWarnings("unchecked")
    public ImageUploadResponseDTO upload(MultipartFile file) {
        try {
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "geradordocumentos"));
            return new ImageUploadResponseDTO((String) result.get("secure_url"));
        } catch (IOException e) {
            throw new ImageUploadException("Erro ao fazer upload da imagem: " + e.getMessage());
        }
    }
}
