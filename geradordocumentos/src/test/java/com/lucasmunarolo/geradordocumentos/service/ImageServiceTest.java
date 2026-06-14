package com.lucasmunarolo.geradordocumentos.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.lucasmunarolo.geradordocumentos.dto.image.ImageUploadResponseDTO;
import com.lucasmunarolo.geradordocumentos.exception.ImageUploadException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private ImageService service;

    @Test
    void shouldUploadImageSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file", "logo.png", "image/png", new byte[]{1, 2, 3}
        );

        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(), any())).thenReturn(
            Map.of("secure_url", "https://res.cloudinary.com/test/logo.png")
        );

        ImageUploadResponseDTO result = service.upload(file);

        assertThat(result.url()).isEqualTo("https://res.cloudinary.com/test/logo.png");
    }

    @Test
    void shouldThrowImageUploadExceptionOnError() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file", "logo.png", "image/png", new byte[]{1, 2, 3}
        );

        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(), any())).thenThrow(new java.io.IOException("Cloudinary error"));

        assertThatThrownBy(() -> service.upload(file))
            .isInstanceOf(ImageUploadException.class)
            .hasMessageContaining("Cloudinary error");
    }
}