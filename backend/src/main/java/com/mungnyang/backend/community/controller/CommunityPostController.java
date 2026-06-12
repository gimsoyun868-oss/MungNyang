package com.mungnyang.backend.community.controller;

import com.mungnyang.backend.community.dto.CommunityPostRequest;
import com.mungnyang.backend.community.dto.CommunityPostResponse;
import com.mungnyang.backend.community.service.CommunityPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community-posts")
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    @PostMapping
    public ResponseEntity<CommunityPostResponse> createPost(
            @RequestBody CommunityPostRequest request
    ) {
        CommunityPostResponse response = communityPostService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CommunityPostResponse>> getPosts(
            @RequestParam(required = false) String category
    ) {
        List<CommunityPostResponse> response = communityPostService.getPosts(category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<CommunityPostResponse> getPost(
            @PathVariable Long postId
    ) {
        CommunityPostResponse response = communityPostService.getPost(postId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId
    ) {
        communityPostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}