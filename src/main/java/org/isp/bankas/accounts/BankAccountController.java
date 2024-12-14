package org.isp.bankas.accounts;

import jakarta.servlet.http.HttpSession;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class BankAccountController {
    private final BankAccountService bankAccountService;

    private final UserService userService;

    public BankAccountController(BankAccountService bankAccountService, UserService userService) {
        this.bankAccountService = bankAccountService;
        this.userService = userService;
    }

    @GetMapping("/currentUser")
    public ResponseEntity<List<BankAccount>> currentUserBankAccounts(HttpSession session){
        Object user = session.getAttribute("user");
        if (user instanceof UserDTO currentUser){
            User actual = userService.findByEmail(currentUser.getEmail());
            return ResponseEntity.ok(actual.getBankAccounts());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
