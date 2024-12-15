package org.isp.bankas.transactions;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TransactionHistoryDTO {
    private String bankAccountFrom;

    private List<TransactionDTO> transactions;
    public TransactionHistoryDTO(String bankAccountFrom, List<TransactionDTO> transactions) {
        this.bankAccountFrom = bankAccountFrom;
        this.transactions = new ArrayList<>(transactions);
    }

    public void setTransactions(List<TransactionDTO> transactions) {
        this.transactions = new ArrayList<>(transactions);
    }
}
