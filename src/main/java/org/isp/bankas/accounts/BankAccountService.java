package org.isp.bankas.accounts;

import org.isp.bankas.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public BankAccount findById(long accountId){
        return bankAccountRepository.findById(accountId);
    }
    public BankAccount findByAccountName(String accountName){
        return bankAccountRepository.findByAccountName(accountName);
    }
    public List<BankAccount> findByUser(User user){
        return bankAccountRepository.findByUser(user);
    }
}
