package org.isp.bankas.loan_request;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
public class LoanRequestController {
    private final LoanRequestService loanRequestService;
    private final UserService userService;
    public LoanRequestController(LoanRequestService loanRequestService, UserService userService) {
        this.loanRequestService = loanRequestService;
        this.userService = userService;
    }

    @PostMapping("/new")
    public ResponseEntity<String> submitNewLoanRequest(@Valid @RequestBody LoanRequestDTO loanRequest, HttpSession session){
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)){
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        loanRequestService.save(loanRequest, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Loan request submitted successfully.");
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
