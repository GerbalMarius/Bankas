package org.isp.bankas.transactions;

import org.isp.bankas.accounts.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findById(long transactionId);

    Transaction findByFrom(BankAccount from);

}
