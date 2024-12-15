package org.isp.bankas.accounts;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MoneyDTO {
    @NotNull(message = "Input amount must not be left empty.")
    @DecimalMin(value = "1", message = "Input amount must be at least non less than 1.")
    @DecimalMax(value = "100000", message = "Input amount can't exceed 100,000.")
    private BigDecimal amount;

    @NotEmpty(message = "Bank account must be selected")
    private String bankAccountNumber;

}
