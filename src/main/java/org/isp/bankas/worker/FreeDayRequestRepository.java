package org.isp.bankas.worker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface FreeDayRequestRepository extends JpaRepository<FreeDayRequest, Long> {
    boolean existsByDate(LocalDate date);

    @Query("SELECT f FROM FreeDayRequest f WHERE YEAR(f.date) = :year AND FUNCTION('WEEKOFYEAR', f.date) = :week")
    List<FreeDayRequest> findByYearAndWeek(int year, int week);

}
