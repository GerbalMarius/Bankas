package org.isp.bankas.user;

import org.isp.bankas.role.Role;
import org.isp.bankas.role.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(UserDTO transferedData) {
        User user = new User(transferedData.getPinNumber(), transferedData.getName(), transferedData.getEmail(),
                            transferedData.getAddress(), null);

        String roleToFind = validateCredentials(transferedData);
        
        Role role = roleRepository.findByName(roleToFind);
        if (role == null) {
            role = assingNewRole(roleToFind);
        }
        if (user.getRoles().isEmpty()) {
            user.setRoles(List.of(role));
        }

        return userRepository.save(user);
    }

    private String validateCredentials(UserDTO userDTO) {
        return "USER"; //TODO : should add other roles for extended functionality
    }

    private Role assingNewRole(String roleName) {
        return roleRepository.save(new Role(roleName));
    }

    //TODO : ADD PIN ENCR
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
}
