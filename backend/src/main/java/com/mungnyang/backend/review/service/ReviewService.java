package com.mungnyang.backend.review.service;

import com.mungnyang.backend.review.dto.ReviewRequest;
import com.mungnyang.backend.review.dto.ReviewResponse;
import com.mungnyang.backend.review.entity.Review;
import com.mungnyang.backend.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        Review review = Review.builder()
                .userId(request.getUserId())
                .placeName(request.getPlaceName())
                .category(request.getCategory())
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        Review savedReview = reviewRepository.save(review);

        return ReviewResponse.from(savedReview);
    }

    public List<ReviewResponse> getReviewsByPlaceName(String placeName) {
        return reviewRepository.findByPlaceName(placeName)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}