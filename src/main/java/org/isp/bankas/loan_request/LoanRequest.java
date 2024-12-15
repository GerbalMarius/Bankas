package org.isp.bankas.loan_request;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.isp.bankas.accounts.CurrencyType;
import org.isp.bankas.user.User;

import java.math.BigDecimal;

@Entity
@Table(name = "loan_requests")
@Data
public class LoanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "loan_amount", precision = 10, scale = 3)
    private BigDecimal loanAmount;

    @Column(name = "bank_account_for")
    private String bankAccountFor;

    @Enumerated(EnumType.STRING)
    private LoanStatus loanStatus;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

    @Column(name = "starting_amount", precision = 10, scale = 3)
    private BigDecimal startingAmount;

    @Column(name = "interest_rate", precision = 10, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "duration_months")
    private int durationMonths;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    public LoanRequest() {
        this("", BigDecimal.ZERO, "", LoanStatus.SUBMITTED, CurrencyType.EUR, BigDecimal.ZERO, BigDecimal.ZERO, 0);
    }
    public LoanRequest(String description, BigDecimal loanAmount, String bankAccountFor, LoanStatus loanStatus, CurrencyType currencyType, BigDecimal startingAmount, BigDecimal interestRate, int durationMonths) {
        this.description = description;
        this.loanAmount = loanAmount;
        this.bankAccountFor = bankAccountFor;
        this.loanStatus = loanStatus;
        this.currencyType = currencyType;
        this.startingAmount = startingAmount;
        this.interestRate = interestRate;
        this.durationMonths = durationMonths;
    }
}
