package com.mungnyang.backend.health.controller;

import com.mungnyang.backend.health.dto.HealthRecordCreateRequest;
import com.mungnyang.backend.health.dto.HealthRecordResponse;
import com.mungnyang.backend.health.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    @PostMapping
    public ResponseEntity<HealthRecordResponse> createHealthRecord(
            @RequestBody HealthRecordCreateRequest request
    ) {
        HealthRecordResponse response = healthRecordService.createHealthRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<HealthRecordResponse>> getHealthRecordsByPetId(
            @RequestParam Long petId
    ) {
        List<HealthRecordResponse> response = healthRecordService.getHealthRecordsByPetId(petId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<HealthRecordResponse> updateHealthRecord(
            @PathVariable Long recordId,
            @RequestBody HealthRecordCreateRequest request
    ) {
        HealthRecordResponse response = healthRecordService.updateHealthRecord(recordId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteHealthRecord(
            @PathVariable Long recordId
    ) {
        healthRecordService.deleteHealthRecord(recordId);
        return ResponseEntity.noContent().build();
    }
}