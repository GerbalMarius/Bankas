package org.isp.bankas.admin;

import org.isp.bankas.BankApplication;
import org.isp.bankas.transactions.Transaction;
import org.isp.bankas.transactions.TransactionRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    private final TransactionRepository transactionRepository;

    public AdminStatisticsController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactionStatistics(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    ) {
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate);
        
        // Calculate statistics
        BigDecimal minAmount = transactions.stream()
                .map(Transaction::getAmount)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal maxAmount = transactions.stream()
                .map(Transaction::getAmount)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        // Get daily totals
        Map<LocalDate, BigDecimal> dailyTotals = transactions.stream()
                .collect(Collectors.groupingBy(
                    Transaction::getDate,
                    Collectors.reducing(BigDecimal.ZERO,
                        Transaction::getAmount,
                        BigDecimal::add)
                ));

        // Get top 5 accounts
        List<Map<String, Object>> topAccounts = transactions.stream()
                .collect(Collectors.groupingBy(
                    t -> t.getFrom().getAccountName(),
                    Collectors.reducing(BigDecimal.ZERO,
                        Transaction::getAmount,
                        BigDecimal::add)))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> account = new HashMap<>();
                    account.put("accountName", entry.getKey());
                    account.put("totalAmount", entry.getValue());
                    return account;
                })
                .collect(Collectors.toList());

        // Get top 5 transactions
        List<Map<String, Object>> topTransactions = transactions.stream()
                .sorted(Comparator.comparing(Transaction::getAmount).reversed())
                .limit(5)
                .map(t -> {
                    Map<String, Object> transaction = new HashMap<>();
                    transaction.put("from", t.getFrom().getAccountName());
                    transaction.put("to", t.getAccountNumberTo());
                    transaction.put("amount", t.getAmount());
                    transaction.put("date", t.getDate());
                    return transaction;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("minAmount", minAmount);
        response.put("maxAmount", maxAmount);
        response.put("dailyTotals", dailyTotals);
        response.put("topAccounts", topAccounts);
        response.put("topTransactions", topTransactions);

        return ResponseEntity.ok(response);
    }
}