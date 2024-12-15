package org.isp.bankas.loan_request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.isp.bankas.accounts.CurrencyType;

import java.math.BigDecimal;

@Data
public final class LoanRequestDTO {

    @NotEmpty(message = "Please provide a detailed description")
    private String description;

    @NotNull(message = "The requested amount must not be left empty")
    @DecimalMin(value = "1", message = "The requested amount must be larger or equal to 1")
    @DecimalMax(value = "100000", message = "The requested amount must not exceed 100,000")
    private BigDecimal loanAmount;

    @NotEmpty(message = "Bank account must be selected")
    private String bankAccountName;

    @NotEmpty(message = "Currency type must be provided")
    private String currencyType;

    @NotNull(message = "Starting amount is required")
    @DecimalMin(value = "0", message = "Starting amount must be positive")
    @DecimalMax(value = "100000", message = "Starting amount must not exceed 100,000")
    private BigDecimal startingAmount;

    @NotNull(message = "Interest rate must be provided")
    @DecimalMin(value = "0", message = "Interest rate must be positive")
    @DecimalMax(value = "50", message = "Interest rate must not exceed 50")
    private BigDecimal interestRate;

    @NotNull(message = "Duration in months must not be null")
    @DecimalMin(value = "1", message = "Duration in months must be at least 1")
    @DecimalMax(value = "36", message = "Duration in months must not exceed 3 years")
    private int durationMonths;

    // Default constructor
    public LoanRequestDTO() {
        this("", BigDecimal.ZERO, "", "EUR", BigDecimal.ZERO, BigDecimal.ZERO, 0);
    }

    // Parameterized constructor
    public LoanRequestDTO(String description, BigDecimal loanAmount, String bankAccountName,String currencyType, BigDecimal startingAmount, BigDecimal interestRate, int durationMonths) {
        this.description = description;
        this.loanAmount = loanAmount;
        this.bankAccountName = bankAccountName;
        this.currencyType = currencyType;
        this.startingAmount = startingAmount;
        this.interestRate = interestRate;
        this.durationMonths = durationMonths;
    }
}