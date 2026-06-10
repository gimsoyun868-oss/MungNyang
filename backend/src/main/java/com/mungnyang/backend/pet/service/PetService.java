package com.mungnyang.backend.pet.service;

import com.mungnyang.backend.pet.dto.PetCreateRequest;
import com.mungnyang.backend.pet.dto.PetResponse;
import com.mungnyang.backend.pet.entity.Pet;
import com.mungnyang.backend.pet.image.entity.PetImage;
import com.mungnyang.backend.pet.image.repository.PetImageRepository;
import com.mungnyang.backend.pet.repository.PetRepository;
import com.mungnyang.backend.user.entity.User;
import com.mungnyang.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetImageRepository petImageRepository;

    @Transactional
    public PetResponse createPet(PetCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        List<String> imageUrls = request.getImageUrls();

        if (imageUrls != null && imageUrls.size() > 5) {
            throw new IllegalArgumentException("대표 이미지는 최대 5장까지 등록할 수 있습니다.");
        }

        String thumbnailUrl = null;

        if (imageUrls != null && !imageUrls.isEmpty()) {
            thumbnailUrl = imageUrls.get(0);
        } else {
            thumbnailUrl = request.getImageUrl();
        }

        Pet pet = Pet.builder()
                .user(user)
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .gender(request.getGender())
                .birthDate(request.getBirthDate())
                .weight(request.getWeight())
                .imageUrl(thumbnailUrl)
                .build();

        Pet savedPet = petRepository.save(pet);

        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (int i = 0; i < imageUrls.size(); i++) {
                PetImage petImage = PetImage.builder()
                        .pet(savedPet)
                        .imageUrl(imageUrls.get(i))
                        .sortOrder(i)
                        .thumbnail(i == 0)
                        .build();

                petImageRepository.save(petImage);
            }
        }

        Pet reloadedPet = petRepository.findById(savedPet.getId())
                .orElseThrow(() -> new IllegalArgumentException("반려동물 조회 실패"));

        return PetResponse.from(reloadedPet);
    }

    public List<PetResponse> getPetsByUserId(Long userId) {
        return petRepository.findByUserId(userId)
                .stream()
                .map(PetResponse::from)
                .toList();
    }

    public PetResponse getPetById(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 반려동물입니다."));

        return PetResponse.from(pet);
    }

    @Transactional
    public PetResponse updatePet(Long petId, PetCreateRequest request) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 반려동물입니다."));

        pet.update(
                request.getName(),
                request.getSpecies(),
                request.getBreed(),
                request.getGender(),
                request.getBirthDate(),
                request.getWeight(),
                request.getImageUrl()
        );

        return PetResponse.from(pet);
    }

    @Transactional
    public void deletePet(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 반려동물입니다."));

        petRepository.delete(pet);
    }
}