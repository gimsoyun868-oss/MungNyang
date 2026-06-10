package com.mungnyang.backend.health.dto;

import com.mungnyang.backend.health.entity.HealthRecord;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class HealthRecordResponse {

    private Long id;

    private Long petId;

    private String type;

    private String title;

    private String memo;

    private LocalDate recordDate;

    private LocalDate nextReminderDate;

    public static HealthRecordResponse from(HealthRecord record) {
        return HealthRecordResponse.builder()
                .id(record.getId())
                .petId(record.getPet().getId())
                .type(record.getType())
                .title(record.getTitle())
                .memo(record.getMemo())
                .recordDate(record.getRecordDate())
                .nextReminderDate(record.getNextReminderDate())
                .build();
    }
}