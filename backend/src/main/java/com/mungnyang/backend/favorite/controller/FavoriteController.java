package com.mungnyang.backend.favorite.controller;

import com.mungnyang.backend.favorite.dto.FavoriteRequest;
import com.mungnyang.backend.favorite.dto.FavoriteResponse;
import com.mungnyang.backend.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<FavoriteResponse> createFavorite(
            @RequestBody FavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.createFavorite(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(
            @RequestParam Long userId
    ) {
        List<FavoriteResponse> response = favoriteService.getFavoritesByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteFavorite(
            @PathVariable Long favoriteId
    ) {
        favoriteService.deleteFavorite(favoriteId);
        return ResponseEntity.noContent().build();
    }
}