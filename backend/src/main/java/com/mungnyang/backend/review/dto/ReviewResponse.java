package com.mungnyang.backend.review.dto;

import com.mungnyang.backend.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponse {

    private Long id;
    private Long userId;
    private String placeName;
    private String category;
    private Integer rating;
    private String content;

    public static ReviewResponse from(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .placeName(review.getPlaceName())
                .category(review.getCategory())
                .rating(review.getRating())
                .content(review.getContent())
                .build();
    }
}