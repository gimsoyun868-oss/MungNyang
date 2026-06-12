package com.mungnyang.backend.community.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommunityPostRequest {

    private Long userId;

    private String title;

    private String content;

    private String imageUrl;

    private String category;
}