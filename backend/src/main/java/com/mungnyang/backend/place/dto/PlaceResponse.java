package com.mungnyang.backend.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlaceResponse {

    private String name;

    private String address;

    private String category;

    private Double latitude;

    private Double longitude;
}