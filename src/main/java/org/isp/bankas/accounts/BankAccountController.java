package org.isp.bankas.accounts;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
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
    @PostMapping("/create")
    public ResponseEntity<String> createNewBankAccount(@Valid @RequestBody BankAccountDTO inputData, HttpSession session){
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User actual = userService.findByEmail(currentUser.getEmail());
        BankAccount newAccount = bankAccountService.saveBankAccount(inputData, actual);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("banck account created successfully.");
    }
    @PostMapping("/currentUser/update")
    public ResponseEntity<String> updateBankAccountFunds(@Valid @RequestBody MoneyDTO input, HttpSession session){
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User actual = userService.findByEmail(currentUser.getEmail());
        BankAccount to = bankAccountService.findByAccountName(input.getBankAccountNumber());
        if (to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldn't find the registered bank account.");
        }
        to.setBalance(to.getBalance().add(input.getAmount()));
        bankAccountService.update(to);
        return ResponseEntity.ok("Funds updated successfully.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
