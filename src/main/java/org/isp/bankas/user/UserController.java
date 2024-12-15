package org.isp.bankas.user;

import jakarta.servlet.http.HttpSession;
import org.isp.bankas.BankApplication;
import org.isp.bankas.accounts.BankAccount;
import org.isp.bankas.role.Role;
import org.isp.bankas.transactions.Transaction;
import org.isp.bankas.transactions.TransactionDTO;
import org.isp.bankas.transactions.TransactionHistoryDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<UserDTO> getCurrentUser(HttpSession session){
        Object user = session.getAttribute("user");
        if (user instanceof UserDTO currentUser){
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/currentRoles")
    public ResponseEntity<List<String>> getCurrentUserRoles(HttpSession session){
        Object user = session.getAttribute("user");
        if (user instanceof UserDTO currentUser){
            User actual = userService.findByEmail(currentUser.getEmail());
            List<String> names = actual.getRoles().stream().map(Role::getName).toList();
            return ResponseEntity.ok(names);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/currentTransactions")
    public ResponseEntity<List<TransactionHistoryDTO>> getMadeTransactions(HttpSession session){
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User actual = userService.findByEmail(currentUser.getEmail());
        List<BankAccount> bankAccounts = actual.getBankAccounts();
        List<TransactionHistoryDTO> histories = new ArrayList<>();
        for (BankAccount account : bankAccounts) {
            TransactionHistoryDTO transactionHistoryDTO = new TransactionHistoryDTO(
                    account.getAccountName(),
                    account.getTransactions().stream().map(transaction ->
                            new TransactionDTO(
                                    transaction.getDescription(),
                                    transaction.getFrom().getAccountName(),
                                    transaction.getAccountNumberTo(),
                                    transaction.getAmount()
                            )
                    ).toList()
            );
            histories.add(transactionHistoryDTO);
        }
        return ResponseEntity.ok(histories);
    }
}
