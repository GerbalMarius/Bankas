package org.isp.bankas.user;

import org.isp.bankas.role.Role;
import org.isp.bankas.role.RoleRepository;
import org.isp.bankas.utils.Error;
import org.isp.bankas.utils.Strings;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

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

    // Add this method to UserService class
    public User saveAdmin(UserDTO transferedData) {
        User admin = new User(passwordEncoder.encode(transferedData.getPinNumber()), transferedData.getName(), transferedData.getEmail(),
                            transferedData.getAddress(), null);
    
        Role adminRole = roleRepository.findByName("ADMIN");
        if (adminRole == null) {
            adminRole = assingNewRole("ADMIN");
        }
        admin.setRoles(List.of(adminRole));
    
        return userRepository.save(admin);
    }

    /**
     * Helper method for saving setter changes to database.
     * @param user user , whose changes to save.
     */
    public void update(User user){
        userRepository.save(user);
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
    //Gets all clients for admin
     public List<UserDTO> getAllClients() {
        List<User> users = userRepository.findAll();
        return users.stream()
                    .map(User::transferToDTO)
                    .collect(Collectors.toList());
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
