package com.mungnyang.backend.pet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class PetCreateRequest {

    @NotNull(message = "사용자 ID는 필수입니다.")
    private Long userId;

    @NotBlank(message = "반려동물 이름은 필수입니다.")
    private String name;

    @NotBlank(message = "종류는 필수입니다.")
    private String species;

    private String breed;

    private String gender;

    private LocalDate birthDate;

    private Double weight;

    private String imageUrl;

    private List<String> imageUrls;
}