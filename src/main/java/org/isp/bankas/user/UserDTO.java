package org.isp.bankas.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public final class UserDTO {
    @NotEmpty(message = "Your pin number should not be empty.")
    @Pattern(regexp = "^\\d+$", message = "Only numbers for pin are allowed.")
    private String pinNumber;

    @NotEmpty(message = "Name should not be empty")
    private String name;

    @NotEmpty(message = "Your password should not be empty.")
    @Email(message = "Please provide a valid email address.")
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
