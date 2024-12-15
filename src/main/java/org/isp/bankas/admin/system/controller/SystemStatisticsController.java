package org.isp.bankas.admin.system.controller;

import org.isp.bankas.BankApplication;
import org.isp.bankas.admin.system.model.SystemStats;
import org.isp.bankas.admin.system.service.SystemMonitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/admin/system")
public class SystemStatisticsController {

    private final SystemMonitorService systemMonitorService;

    public SystemStatisticsController(SystemMonitorService systemMonitorService) {
        this.systemMonitorService = systemMonitorService;
    }

    @GetMapping("/stats")
    public ResponseEntity<SystemStats> getSystemStats() {
        return ResponseEntity.ok(systemMonitorService.getSystemStatistics());
    }
}
