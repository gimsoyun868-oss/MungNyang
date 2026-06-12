package com.mungnyang.backend.missing.dto;

import com.mungnyang.backend.missing.entity.MissingPost;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MissingPostResponse {

    private Long id;

    private Long userId;

    private String petName;

    private String species;

    private String breed;

    private String gender;

    private String missingLocation;

    private LocalDateTime missingTime;

    private String description;

    private String contact;

    private String imageUrl;

    private Boolean found;

    public static MissingPostResponse from(MissingPost post) {
        return MissingPostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .petName(post.getPetName())
                .species(post.getSpecies())
                .breed(post.getBreed())
                .gender(post.getGender())
                .missingLocation(post.getMissingLocation())
                .missingTime(post.getMissingTime())
                .description(post.getDescription())
                .contact(post.getContact())
                .imageUrl(post.getImageUrl())
                .found(post.getFound())
                .build();
    }
}