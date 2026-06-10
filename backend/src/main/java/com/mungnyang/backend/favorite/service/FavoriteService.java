package com.mungnyang.backend.favorite.service;

import com.mungnyang.backend.favorite.dto.FavoriteRequest;
import com.mungnyang.backend.favorite.dto.FavoriteResponse;
import com.mungnyang.backend.favorite.entity.Favorite;
import com.mungnyang.backend.favorite.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Transactional
    public FavoriteResponse createFavorite(FavoriteRequest request) {
        Favorite favorite = Favorite.builder()
                .userId(request.getUserId())
                .placeName(request.getPlaceName())
                .address(request.getAddress())
                .category(request.getCategory())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        Favorite savedFavorite = favoriteRepository.save(favorite);

        return FavoriteResponse.from(savedFavorite);
    }

    public List<FavoriteResponse> getFavoritesByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional
    public void deleteFavorite(Long favoriteId) {
        favoriteRepository.deleteById(favoriteId);
    }
}