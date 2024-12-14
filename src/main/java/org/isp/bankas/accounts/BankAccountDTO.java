package org.isp.bankas.accounts;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BankAccountDTO {

    @NotNull(message = "Initial balance must not be empty, enter 0 if that's the case")
    @DecimalMax(value = "5000000", message = "Can't process initial sums of upwards 5,000,000")
    @DecimalMin(value = "0", message = "Initial balance must be at least 0.")
    private BigDecimal balance;

    @NotNull(message = "Reserved balance must not be empty, enter 0 if that's the case")
    @DecimalMin(value = "0", message = "Reserved balance must be at least 0.")
    private BigDecimal reservedBalance;

    @NotNull(message = "Daily limit must not be empty, enter 0 if that's the case")
    @DecimalMin(value = "0", message = "Daily limit must be at least 0.")
    @DecimalMax(value = "100000", message = "Daily limit cannot exceed 100,000.")
    private BigDecimal dailyLimit;

    @NotNull(message = "Monthly limit must not be empty, enter 0 if that's the case")
    @DecimalMin(value = "0", message = "Monthly limit must be at least 0.")
    @DecimalMax(value = "3000000", message = "Monthly limit cannot exceed 3,000,000.")
    private BigDecimal monthlyLimit;

    @NotEmpty(message = "Account name must not be empty.")
    private String accountName;

    @NotEmpty(message = "Currency type must be selected.")
    private String currencyType;

    public BankAccountDTO() {
        this(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, "", "EUR");
    }

    public BankAccountDTO(BigDecimal balance, BigDecimal reservedBalance, BigDecimal dailyLimit, BigDecimal monthlyLimit, String accountName, String currencyType) {
        this.balance = balance;
        this.reservedBalance = reservedBalance;
        this.dailyLimit = dailyLimit;
        this.monthlyLimit = monthlyLimit;
        this.accountName = accountName;
        this.currencyType = currencyType;
    }
}