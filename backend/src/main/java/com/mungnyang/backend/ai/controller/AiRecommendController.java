package com.mungnyang.backend.ai.controller;

import com.mungnyang.backend.ai.dto.AiRecommendRequest;
import com.mungnyang.backend.ai.dto.AiRecommendResponse;
import com.mungnyang.backend.ai.service.AiRecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiRecommendController {

    private final AiRecommendService aiRecommendService;

    @PostMapping("/recommend")
    public AiRecommendResponse recommend(
            @RequestBody AiRecommendRequest request
    ) {
        String answer = aiRecommendService.recommend(
                request.getQuestion(),
                request.getContext(),
                request.getLat(),
                request.getLng()
        );

        return new AiRecommendResponse(answer);
    }
}