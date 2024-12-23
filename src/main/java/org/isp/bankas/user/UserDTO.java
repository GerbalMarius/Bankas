package org.isp.bankas.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Used for transfering user data between the display and service layers
 * For jakarta validation constraints to work use @Valid annotation in method parameters
 * Not marked final, could provide an extension for other types of users.
 */
@Data
public  class UserDTO {
    @NotEmpty(message = "Pin number should not be empty.")
    @Pattern(regexp = "^\\d*$", message = "Only numbers for pin are allowed.")
    private String pinNumber;

    @NotEmpty(message = "Name should not be empty")
    private String name;

    @Email( regexp = "^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*([A-Za-z]{2,})$", message = "Please provide a valid email address.")
    private String email;

    @NotEmpty(message = "Your address should not be empty.")
    private String address;

    public UserDTO() {}

    public UserDTO(String pinNumber, String name, String email, String address) {
        this.pinNumber = pinNumber;
        this.name = name;
        this.email = email;
        this.address = address;
    }

}
