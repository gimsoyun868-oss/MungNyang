package com.mungnyang.backend.review.repository;

import com.mungnyang.backend.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPlaceName(String placeName);
}