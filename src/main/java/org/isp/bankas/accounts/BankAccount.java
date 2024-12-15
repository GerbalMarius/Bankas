package org.isp.bankas.accounts;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.isp.bankas.transactions.Transaction;
import org.isp.bankas.user.User;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "bank_accounts")
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "balance", nullable = false, precision = 10, scale = 3)
    private BigDecimal balance;

    @Column(name = "reserved_balance", precision = 10, scale = 3)
    private BigDecimal reservedBalance;
    
    @Column(name = "daily_limit",nullable = false, precision = 10, scale = 3)
    private BigDecimal dailyLimit;
    
    @Column(name = "monthly_limit", nullable = false, precision = 10, scale = 3)
    private BigDecimal monthlyLimit;

    @Column(name = "account_name", nullable = false, length = 100)
    private String accountName;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "from", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    public BankAccount() {
        this(BigDecimal.ZERO, null, BigDecimal.ZERO, BigDecimal.ZERO, "", CurrencyType.EUR);
    }
    public BankAccount(BigDecimal balance, BigDecimal reservedBalance, BigDecimal dailyLimit, BigDecimal monthlyLimit, String accountName, CurrencyType currencyType) {
        this.balance = balance;
        this.reservedBalance = reservedBalance;
        this.dailyLimit = dailyLimit;
        this.monthlyLimit = monthlyLimit;
        this.accountName = accountName;
        this.currencyType = currencyType;
        this.transactions = new ArrayList<>();
    }
}
