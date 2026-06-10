package com.mungnyang.backend.pet.entity;

import com.mungnyang.backend.global.entity.BaseEntity;
import com.mungnyang.backend.pet.image.entity.PetImage;
import com.mungnyang.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pets")
public class Pet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String species;

    private String breed;

    private String gender;

    private LocalDate birthDate;

    private Double weight;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(
            mappedBy = "pet",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<PetImage> images = new ArrayList<>();

    /**
     * 반려동물 정보 수정
     */
    public void update(
            String name,
            String species,
            String breed,
            String gender,
            LocalDate birthDate,
            Double weight,
            String imageUrl
    ) {
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.gender = gender;
        this.birthDate = birthDate;
        this.weight = weight;
        this.imageUrl = imageUrl;
    }
}