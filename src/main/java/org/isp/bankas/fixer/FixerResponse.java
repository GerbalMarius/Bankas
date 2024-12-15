package org.isp.bankas.fixer;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class FixerResponse {
    @JsonProperty("success")
    private boolean success;
    private long timestamp;
    private String base;
    private String date;

    @JsonProperty("rates")
    private Map<String, BigDecimal> rates;
}
