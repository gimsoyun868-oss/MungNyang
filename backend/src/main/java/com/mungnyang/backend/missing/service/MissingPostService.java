package com.mungnyang.backend.missing.service;

import com.mungnyang.backend.missing.dto.MissingPostRequest;
import com.mungnyang.backend.missing.dto.MissingPostResponse;
import com.mungnyang.backend.missing.entity.MissingPost;
import com.mungnyang.backend.missing.repository.MissingPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissingPostService {

    private final MissingPostRepository missingPostRepository;

    @Transactional
    public MissingPostResponse createMissingPost(MissingPostRequest request) {
        MissingPost post = MissingPost.builder()
                .userId(request.getUserId())
                .petName(request.getPetName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .gender(request.getGender())
                .missingLocation(request.getMissingLocation())
                .missingTime(request.getMissingTime())
                .description(request.getDescription())
                .contact(request.getContact())
                .imageUrl(request.getImageUrl())
                .found(false)
                .build();

        MissingPost savedPost = missingPostRepository.save(post);

        return MissingPostResponse.from(savedPost);
    }

    public List<MissingPostResponse> getMissingPosts() {
        return missingPostRepository.findAllByOrderByIdDesc()
                .stream()
                .map(MissingPostResponse::from)
                .toList();
    }

    public MissingPostResponse getMissingPost(Long postId) {
        MissingPost post = missingPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 실종신고입니다."));

        return MissingPostResponse.from(post);
    }

    @Transactional
    public MissingPostResponse markFound(Long postId) {
        MissingPost post = missingPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 실종신고입니다."));

        post.markFound();

        return MissingPostResponse.from(post);
    }

    @Transactional
    public void deleteMissingPost(Long postId) {
        missingPostRepository.deleteById(postId);
    }
}