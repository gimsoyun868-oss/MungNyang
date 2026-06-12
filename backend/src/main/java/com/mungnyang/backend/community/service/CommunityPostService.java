package com.mungnyang.backend.community.service;

import com.mungnyang.backend.community.dto.CommunityPostRequest;
import com.mungnyang.backend.community.dto.CommunityPostResponse;
import com.mungnyang.backend.community.entity.CommunityPost;
import com.mungnyang.backend.community.repository.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;

    @Transactional
    public CommunityPostResponse createPost(CommunityPostRequest request) {
        CommunityPost post = CommunityPost.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .createdAt(LocalDateTime.now())
                .build();

        CommunityPost savedPost = communityPostRepository.save(post);

        return CommunityPostResponse.from(savedPost);
    }

    public List<CommunityPostResponse> getPosts(String category) {
        List<CommunityPost> posts;

        if (category == null || category.isBlank() || category.equals("ALL")) {
            posts = communityPostRepository.findAllByOrderByIdDesc();
        } else {
            posts = communityPostRepository.findByCategoryOrderByIdDesc(category);
        }

        return posts.stream()
                .map(CommunityPostResponse::from)
                .toList();
    }

    public CommunityPostResponse getPost(Long postId) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        return CommunityPostResponse.from(post);
    }

    @Transactional
    public void deletePost(Long postId) {
        communityPostRepository.deleteById(postId);
    }
}