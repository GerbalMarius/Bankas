package org.isp.bankas.transactions;

import org.isp.bankas.accounts.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFrom(BankAccount from);
}