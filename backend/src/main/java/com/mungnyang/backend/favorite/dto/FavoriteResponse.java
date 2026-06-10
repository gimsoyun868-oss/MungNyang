package com.mungnyang.backend.favorite.dto;

import com.mungnyang.backend.favorite.entity.Favorite;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FavoriteResponse {

    private Long id;

    private Long userId;

    private String placeName;

    private String address;

    private String category;

    private Double latitude;

    private Double longitude;

    public static FavoriteResponse from(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUserId())
                .placeName(favorite.getPlaceName())
                .address(favorite.getAddress())
                .category(favorite.getCategory())
                .latitude(favorite.getLatitude())
                .longitude(favorite.getLongitude())
                .build();
    }
}