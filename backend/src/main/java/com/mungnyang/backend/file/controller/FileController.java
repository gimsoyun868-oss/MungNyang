package com.mungnyang.backend.file.controller;

import com.mungnyang.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file")
            MultipartFile file
    ) {

        String url =
                fileService.uploadFile(file);

        return ResponseEntity.ok(
                Map.of("url", url)
        );
    }
}