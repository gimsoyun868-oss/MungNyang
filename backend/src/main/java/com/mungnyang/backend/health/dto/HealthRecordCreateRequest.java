package com.mungnyang.backend.health.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HealthRecordCreateRequest {

    private Long petId;

    private String type;

    private String title;

    private String memo;

    private LocalDate recordDate;

    private LocalDate nextReminderDate;
}