package com.mungnyang.backend.missing.repository;

import com.mungnyang.backend.missing.entity.MissingPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MissingPostRepository extends JpaRepository<MissingPost, Long> {

    List<MissingPost> findAllByOrderByIdDesc();
}