package org.isp.bankas.admin;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.isp.bankas.BankApplication;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.isp.bankas.utils.Error;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody UserDTO transferredData, HttpSession session) {
        Error validationError = userService.validateLoginCredentials(transferredData);
        if (validationError != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(validationError.getMessage());
        }
        User actualUser = userService.findByEmail(transferredData.getEmail());
        if (!actualUser.getRoles().stream().anyMatch(role -> role.getName().equals("ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("User is not an admin");
        }
        session.setAttribute("user", actualUser.transferToDTO());
        session.setAttribute("roles", actualUser.getRoles());
        return ResponseEntity.ok("Admin login successful");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerNewAdmin(@Valid @RequestBody UserDTO transferredData) {
        try {
            User alreadyRegistered = userService.findByEmailOrPinNumber(transferredData.getEmail(), transferredData.getPinNumber());
            if(alreadyRegistered != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Admin already registered");
            }

            User savedAdmin = userService.saveAdmin(transferredData);

            return ResponseEntity.status(HttpStatus.CREATED).body("Admin %s registered successfully".formatted(savedAdmin.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Admin registration failed: " + e.getMessage());
        }
    }
}