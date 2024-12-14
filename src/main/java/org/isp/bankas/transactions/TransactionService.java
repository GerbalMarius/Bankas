package org.isp.bankas.transactions;

import org.isp.bankas.accounts.BankAccount;
import org.isp.bankas.accounts.BankAccountRepository;
import org.isp.bankas.fixer.Exchanges;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class TransactionService{
    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;
    public TransactionService(TransactionRepository transactionRepository, BankAccountRepository bankAccountRepository) {
        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Transactional
    public Transaction saveMadeTransaction(TransactionDTO transferredData, BankAccount from){
        Transaction transaction = new Transaction();
        BankAccount saved = calculateDifference(transferredData, from);
        transaction.setAmount(transferredData.getAmount());
        transaction.setDescription(transferredData.getDescription());
        transaction.setAccountNumberTo(transferredData.getAccountNumberTo());
        transaction.setFrom(saved);


        return transactionRepository.save(transaction);
    }

    private  BankAccount calculateDifference(TransactionDTO transferredData, BankAccount from) {
        // Find the target bank account to transfer money to
        BankAccount toTo = bankAccountRepository.findByAccountName(transferredData.getAccountNumberTo());

        if (toTo == null) {
            throw new IllegalArgumentException("Target account not found: " + transferredData.getAccountNumberTo());
        }

        // Get the exchange rate from the source currency to the target currency
        BigDecimal exchangeRate = Exchanges.getRate(from.getCurrencyType().name(), toTo.getCurrencyType().name());

        // Convert the transferred amount to the target currency
        BigDecimal convertedAmount = transferredData.getAmount().multiply(exchangeRate);

        // Deduct the converted amount from the source account's balance
        BigDecimal updatedSourceBalance = from.getBalance().subtract(transferredData.getAmount());
        if (updatedSourceBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Insufficient funds in the source account.");
        }
        from.setBalance(updatedSourceBalance);
        from.setReservedBalance(
                from.getReservedBalance() == null
                        ? transferredData.getAmount()
                        : from.getReservedBalance().add(transferredData.getAmount())
        );

        // Add the converted amount to the target account's balance
        BigDecimal updatedTargetBalance = toTo.getBalance().add(convertedAmount);
        toTo.setBalance(updatedTargetBalance);
        bankAccountRepository.save(from);
        bankAccountRepository.save(toTo);


        return from;
    }
}
