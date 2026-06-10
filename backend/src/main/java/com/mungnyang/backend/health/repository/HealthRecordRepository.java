package com.mungnyang.backend.health.repository;

import com.mungnyang.backend.health.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    List<HealthRecord> findByPetId(Long petId);
}