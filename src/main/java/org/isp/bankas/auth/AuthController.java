package org.isp.bankas.auth;

import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.role.RoleRepository;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.isp.bankas.utils.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, RoleRepository roleRepository, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.authenticationManager = authenticationManager;
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
    public ResponseEntity<String> loginUser(@RequestBody UserDTO transferredData) {
        try {
            if (Strings.isNullOrEmpty(transferredData.getEmail()) ||
                    Strings.isNullOrEmpty(transferredData.getPinNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and PIN number are required.");
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(transferredData.getEmail(), transferredData.getPinNumber())
            );

            if (authentication.isAuthenticated()) {
                return ResponseEntity.ok("Logged in successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed.");
            }
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred during login");
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
