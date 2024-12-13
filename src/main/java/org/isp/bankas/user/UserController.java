package org.isp.bankas.user;

import jakarta.servlet.http.HttpSession;
import org.isp.bankas.BankApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
