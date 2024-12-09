package org.isp.bankas.auth;

import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.role.RoleRepository;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(@Valid @RequestBody UserDTO transferredData) {
        try{

            User alreadyRegistered = userService.findByEmailOrPinNumber(transferredData.getEmail(), transferredData.getPinNumber());
            if(alreadyRegistered != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already registered");
            }

            User savedUser = userService.saveUser(transferredData);

            return ResponseEntity.status(HttpStatus.CREATED).body("User %s registered successfully".formatted(savedUser.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + " " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser( @RequestBody UserDTO transferredData) {
        try {
            if (transferredData.getEmail().isEmpty() || transferredData.getPinNumber().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or PIN is mandatory");
            }

            User foundUser = userService.findByEmail(transferredData.getEmail());
            if(foundUser == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User %s not found".formatted(transferredData.getEmail()));
            }
            if (!Objects.equals(transferredData.getPinNumber(), foundUser.getPinNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("PIN number does not match");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Logged in successfully");
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Login failed: " + " " + e.getMessage());
        }
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
