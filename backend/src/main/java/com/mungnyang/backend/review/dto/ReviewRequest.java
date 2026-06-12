package com.mungnyang.backend.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewRequest {

    private Long userId;

    private String placeName;

    private String category;

    private Integer rating;

    private String content;
}