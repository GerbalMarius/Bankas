package org.isp.bankas.accounts;

import org.isp.bankas.user.User;
import org.springframework.stereotype.Service;

@Service
public class BankAccountService {
    private final BankAccountRepository bankAccountRepository;

    public BankAccountService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    public BankAccount saveBankAccount(BankAccountDTO transferedData, User user){
        BankAccount bankAccount = new BankAccount(
                transferedData.getBalance(), transferedData.getReservedBalance(), transferedData.getDailyLimit(),
                transferedData.getMonthlyLimit(),
                transferedData.getAccountName(), CurrencyType.valueOf(transferedData.getCurrencyType().toUpperCase()));

        bankAccount.setUser(user);
        user.getBankAccounts().add(bankAccount);

        return bankAccountRepository.save(bankAccount);
    }
}
