package org.isp.bankas.transactions;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.isp.bankas.accounts.BankAccount;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "user_transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

     @Column(name = "description", length = 200)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccount from;

    @Column(name = "account_number_to", nullable = false, length = 100)
    private String accountNumberTo;

    @Column(name = "amount", nullable = false, precision = 10, scale = 3)
    private BigDecimal amount;

    public Transaction() {
        this("", null, "", BigDecimal.ZERO);
    }
    public Transaction(String description, BankAccount from, String accountNumberTo, BigDecimal amount) {
        this.description = description;
        this.from = from;
        this.accountNumberTo = accountNumberTo;
        this.amount = amount;
    }
}
