package com.mungnyang.backend.naver.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NaverPlaceResponse {

    private String title;
    private String address;
    private String roadAddress;
    private String category;
    private String link;
    private String description;
    private String mapx;
    private String mapy;
}