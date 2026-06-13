package com.mungnyang.backend.community.comment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequest {

    private Long postId;

    private Long userId;

    private String content;
}