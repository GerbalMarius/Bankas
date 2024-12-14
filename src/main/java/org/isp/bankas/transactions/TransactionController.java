package org.isp.bankas.transactions;

import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.accounts.BankAccount;
import org.isp.bankas.accounts.BankAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final BankAccountService bankAccountService;

    public TransactionController(TransactionService transactionService, BankAccountService bankAccountService) {
        this.transactionService = transactionService;
        this.bankAccountService = bankAccountService;
    }

    @PostMapping("/commit")
    public ResponseEntity<String> commitTransaction(@Valid @RequestBody TransactionDTO transactionData) {
        try {
            BankAccount from = bankAccountService.findByAccountName(transactionData.getBankAccountFrom());
            BankAccount to = bankAccountService.findByAccountName(transactionData.getAccountNumberTo());
            if (to == null) {
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid account name selected for transfer.");
            }
            Transaction saved = transactionService.saveMadeTransaction(transactionData, from);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Transaction committed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient funds for transfer");
        }

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleTransactionExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);

    }
}
