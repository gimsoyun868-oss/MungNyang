package com.mungnyang.backend.health.service;

import com.mungnyang.backend.health.dto.HealthRecordCreateRequest;
import com.mungnyang.backend.health.dto.HealthRecordResponse;
import com.mungnyang.backend.health.entity.HealthRecord;
import com.mungnyang.backend.health.repository.HealthRecordRepository;
import com.mungnyang.backend.pet.entity.Pet;
import com.mungnyang.backend.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final PetRepository petRepository;

    @Transactional
    public HealthRecordResponse createHealthRecord(HealthRecordCreateRequest request) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 반려동물입니다."));

        HealthRecord record = HealthRecord.builder()
                .pet(pet)
                .type(request.getType())
                .title(request.getTitle())
                .memo(request.getMemo())
                .recordDate(request.getRecordDate())
                .nextReminderDate(request.getNextReminderDate())
                .build();

        HealthRecord savedRecord = healthRecordRepository.save(record);

        return HealthRecordResponse.from(savedRecord);
    }

    public List<HealthRecordResponse> getHealthRecordsByPetId(Long petId) {
        return healthRecordRepository.findByPetId(petId)
                .stream()
                .map(HealthRecordResponse::from)
                .toList();
    }

    @Transactional
    public HealthRecordResponse updateHealthRecord(Long recordId, HealthRecordCreateRequest request) {
        HealthRecord record = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 건강기록입니다."));

        record.update(
                request.getType(),
                request.getTitle(),
                request.getMemo(),
                request.getRecordDate(),
                request.getNextReminderDate()
        );

        return HealthRecordResponse.from(record);
    }

    @Transactional
    public void deleteHealthRecord(Long recordId) {
        HealthRecord record = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 건강기록입니다."));

        healthRecordRepository.delete(record);
    }
}