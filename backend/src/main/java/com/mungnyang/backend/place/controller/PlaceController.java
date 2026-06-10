package com.mungnyang.backend.place.controller;

import com.mungnyang.backend.place.dto.PlaceResponse;
import com.mungnyang.backend.place.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

   @GetMapping("/ping")
    public String ping() {
        return "place ok";
    }

    @GetMapping("/search")
    public List<PlaceResponse> searchPlaces(
            @RequestParam String category,
            @RequestParam Double lat,
            @RequestParam Double lng
    ) {
        return placeService.searchPlaces(category, lat, lng);
    }
}