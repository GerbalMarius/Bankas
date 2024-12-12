package org.isp.bankas.user;

import lombok.Getter;
import org.isp.bankas.role.Role;
import org.isp.bankas.role.RoleRepository;
import org.isp.bankas.utils.Error;
import org.isp.bankas.utils.Strings;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Getter
    private Optional<User> currentUser = Optional.empty();

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(UserDTO transferedData) {
        User user = new User(passwordEncoder.encode(transferedData.getPinNumber()), transferedData.getName(), transferedData.getEmail(),
                            transferedData.getAddress(), null);

        String roleToFind = assignUserRole(transferedData);
        
        Role role = roleRepository.findByName(roleToFind);
        if (role == null) {
            role = assingNewRole(roleToFind);
        }
        if (user.getRoles().isEmpty()) {
            user.setRoles(List.of(role));
        }

        return userRepository.save(user);
    }

    public void setCurrentUser(User user) {
        this.currentUser = Optional.ofNullable(user);
    }

    private String assignUserRole(UserDTO userDTO) {
        return "USER"; //TODO : should add other roles for extended functionality
    }

    private Role assingNewRole(String roleName) {
        return roleRepository.save(new Role(roleName));
    }

    public boolean pinMatches(UserDTO formData, User actualUser) {
        return passwordEncoder.matches(formData.getPinNumber(), actualUser.getPinNumber());
    }

    public User findByPinNumber(String pinNumber) {
        return userRepository.findByPinNumber(pinNumber);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findByEmailOrPinNumber(String email, String pinNumber) {
        return userRepository.findByEmailOrPinNumber(email, pinNumber);
    }

    public Error validateLoginCredentials(UserDTO formData) {
        if (Strings.isNullOrEmpty(formData.getEmail()) && Strings.isNullOrEmpty(formData.getPinNumber())) {
            return Error.EMAIL_AND_PIN_REQUIRED;
        }
        if (Strings.isNullOrEmpty(formData.getEmail())) {
            return Error.EMAIL_REQUIRED;
        }
        if (Strings.isNullOrEmpty(formData.getPinNumber())) {
            return Error.PIN_REQUIRED;
        }
        User actualUser = findByEmail(formData.getEmail());
        if (actualUser == null) {
            return Error.USER_NOT_FOUND;
        }
        if (!pinMatches(formData, actualUser)){
            return Error.INVALID_PIN;
        }
        return null;
    }
}
