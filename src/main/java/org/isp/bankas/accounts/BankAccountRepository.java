package org.isp.bankas.accounts;

import org.isp.bankas.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    BankAccount findByAccountName(String accountName);
    List<BankAccount> findByUser(User user);

    BankAccount findById(long accountId);
}
