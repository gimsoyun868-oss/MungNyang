package com.mungnyang.backend.missing.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MissingPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String petName;

    private String species;

    private String breed;

    private String gender;

    private String missingLocation;

    private LocalDateTime missingTime;

    @Column(length = 1000)
    private String description;

    private String contact;

    private String imageUrl;

    private Boolean found;

    public void markFound() {
        this.found = true;
    }
}