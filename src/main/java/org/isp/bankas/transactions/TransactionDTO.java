package org.isp.bankas.transactions;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionDTO {
    @NotEmpty(message = "Please fill out the description.")
    private String description;

    @NotEmpty(message = "Please fill out the account number to send from.")
    private String bankAccountFrom;

    @NotEmpty(message = "Please fill out the account number to send to.")
    private String accountNumberTo;

    @NotNull(message = "Please fill out the amount to send.")
    @DecimalMin(value = "1", message = "There is no use to initiate a transaction less than 1.")
    @DecimalMax(value = "100000", message = "The amount cannot exceed 100,000.")
    private BigDecimal amount;

    public TransactionDTO() {
        this("", "", "", BigDecimal.ONE);
    }
    public TransactionDTO(String description, String bankAccountFrom, String accountNumberTo, BigDecimal amount) {
        this.description = description;
        this.bankAccountFrom = bankAccountFrom;
        this.accountNumberTo = accountNumberTo;
        this.amount = amount;
    }
}
