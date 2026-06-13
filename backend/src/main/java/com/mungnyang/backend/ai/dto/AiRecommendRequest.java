package com.mungnyang.backend.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiRecommendRequest {

    private String question;

    private String context;

    private Double lat;

    private Double lng;
}