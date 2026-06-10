package com.mungnyang.backend.pet.image.repository;

import com.mungnyang.backend.pet.image.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetImageRepository extends JpaRepository<PetImage, Long> {

    List<PetImage> findByPetIdOrderBySortOrderAsc(Long petId);
}