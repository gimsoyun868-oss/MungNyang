package com.mungnyang.backend.file.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileService {

    private final Path uploadPath = Paths.get("uploads");

    public String uploadFile(MultipartFile file) {

        try {

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();

            String extension = "";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension =
                        originalFilename.substring(
                                originalFilename.lastIndexOf("."));
            }

            String savedFilename =
                    UUID.randomUUID() + extension;

            Path filePath =
                    uploadPath.resolve(savedFilename);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/" + savedFilename;

        } catch (IOException e) {

            throw new RuntimeException(
                    "파일 업로드 실패",
                    e
            );
        }
    }
}