package org.isp.bankas.admin.system.service;

import org.isp.bankas.admin.system.model.SystemStats;
import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import com.sun.management.OperatingSystemMXBean;

@Service
public class SystemMonitorService {
    
    public SystemStats getSystemStatistics() {
        SystemStats stats = new SystemStats();
        Runtime runtime = Runtime.getRuntime();
        OperatingSystemMXBean osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();

        stats.setTotalMemory(runtime.totalMemory() / 1024 / 1024);
        stats.setFreeMemory(runtime.freeMemory() / 1024 / 1024);
        stats.setMaxMemory(runtime.maxMemory() / 1024 / 1024);
        stats.setAvailableProcessors(runtime.availableProcessors());
        stats.setOsName(System.getProperty("os.name"));
        stats.setOsVersion(System.getProperty("os.version"));
        stats.setJavaVersion(System.getProperty("java.version"));
        stats.setUptime(ManagementFactory.getRuntimeMXBean().getUptime() / 1000);
        stats.setSystemLoad(String.format("%.2f", osBean.getSystemCpuLoad() * 100));
        stats.setThreadCount(ManagementFactory.getThreadMXBean().getThreadCount());

        return stats;
    }
}
