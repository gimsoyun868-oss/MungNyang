package com.mungnyang.backend.community.dto;

import com.mungnyang.backend.community.entity.CommunityPost;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityPostResponse {

    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    private LocalDateTime createdAt;

    public static CommunityPostResponse from(CommunityPost post) {
        return CommunityPostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .build();
    }
}