package com.mungnyang.backend.missing.controller;

import com.mungnyang.backend.missing.dto.MissingPostRequest;
import com.mungnyang.backend.missing.dto.MissingPostResponse;
import com.mungnyang.backend.missing.service.MissingPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missing-posts")
@RequiredArgsConstructor
public class MissingPostController {

    private final MissingPostService missingPostService;

    @PostMapping
    public ResponseEntity<MissingPostResponse> createMissingPost(
            @RequestBody MissingPostRequest request
    ) {
        MissingPostResponse response = missingPostService.createMissingPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MissingPostResponse>> getMissingPosts() {
        List<MissingPostResponse> response = missingPostService.getMissingPosts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<MissingPostResponse> getMissingPost(
            @PathVariable Long postId
    ) {
        MissingPostResponse response = missingPostService.getMissingPost(postId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{postId}/found")
    public ResponseEntity<MissingPostResponse> markFound(
            @PathVariable Long postId
    ) {
        MissingPostResponse response = missingPostService.markFound(postId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deleteMissingPost(
            @PathVariable Long postId
    ) {
        missingPostService.deleteMissingPost(postId);
        return ResponseEntity.noContent().build();
    }
}