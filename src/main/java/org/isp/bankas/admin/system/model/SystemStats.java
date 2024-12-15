package org.isp.bankas.admin.system.model;

import lombok.Data;

@Data
public class SystemStats {
    private long totalMemory;
    private long freeMemory;
    private long maxMemory;
    private int availableProcessors;
    private String osName;
    private String osVersion;
    private String javaVersion;
    private long uptime;
    private String systemLoad;
    private long threadCount;
}
