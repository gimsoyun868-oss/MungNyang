package com.mungnyang.backend.favorite.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FavoriteRequest {

    private Long userId;

    private String placeName;

    private String address;

    private String category;

    private Double latitude;

    private Double longitude;
}