package com.mungnyang.backend.community.repository;

import com.mungnyang.backend.community.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findAllByOrderByIdDesc();

    List<CommunityPost> findByCategoryOrderByIdDesc(String category);
}