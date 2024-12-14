package org.isp.bankas.transactions;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_address", nullable = false)
    private String senderAddress;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "receiver_address", nullable = false)
    private String receiverAddress;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "comment")
    private String comment;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "timestamp", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    // Getters, setters, and constructors
}

