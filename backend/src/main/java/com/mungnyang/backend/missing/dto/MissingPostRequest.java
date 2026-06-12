package com.mungnyang.backend.missing.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class MissingPostRequest {

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
}