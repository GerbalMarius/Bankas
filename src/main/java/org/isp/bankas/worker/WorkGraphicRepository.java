package org.isp.bankas.worker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkGraphicRepository extends JpaRepository<WorkGraphic, Long> {
    Optional<WorkGraphic> findByYearAndWeekNumber(int year, int weekNumber);
}
