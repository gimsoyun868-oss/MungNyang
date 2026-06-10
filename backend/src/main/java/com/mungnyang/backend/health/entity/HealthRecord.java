package com.mungnyang.backend.health.entity;

import com.mungnyang.backend.pet.entity.Pet;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    private String type;

    private String title;

    @Column(length = 1000)
    private String memo;

    private LocalDate recordDate;

    private LocalDate nextReminderDate;

    public void update(
            String type,
            String title,
            String memo,
            LocalDate recordDate,
            LocalDate nextReminderDate
    ) {
        this.type = type;
        this.title = title;
        this.memo = memo;
        this.recordDate = recordDate;
        this.nextReminderDate = nextReminderDate;
    }
}