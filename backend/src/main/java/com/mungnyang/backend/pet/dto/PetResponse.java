package com.mungnyang.backend.pet.dto;

import com.mungnyang.backend.pet.entity.Pet;
import com.mungnyang.backend.pet.image.entity.PetImage;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class PetResponse {

    private Long id;
    private Long userId;
    private String name;
    private String species;
    private String breed;
    private String gender;
    private LocalDate birthDate;
    private Double weight;
    private String imageUrl;
    private List<String> imageUrls;

    public static PetResponse from(Pet pet) {
        List<String> imageUrls = pet.getImages() == null
                ? List.of()
                : pet.getImages()
                        .stream()
                        .map(PetImage::getImageUrl)
                        .toList();

        String thumbnailUrl = imageUrls.isEmpty()
                ? pet.getImageUrl()
                : imageUrls.get(0);

        return PetResponse.builder()
                .id(pet.getId())
                .userId(pet.getUser().getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .gender(pet.getGender())
                .birthDate(pet.getBirthDate())
                .weight(pet.getWeight())
                .imageUrl(thumbnailUrl)
                .imageUrls(imageUrls)
                .build();
    }
}