package org.isp.bankas.auth;

import org.isp.bankas.user.User;
import org.isp.bankas.user.UserService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class UserAuthProvider implements AuthenticationProvider  {
    private final UserService userService;

    public UserAuthProvider(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String pinNumber = authentication.getCredentials().toString();

        if (email == null || email.isEmpty()) {
            throw new BadCredentialsException("Please enter your email.");
        }
        if (pinNumber == null || pinNumber.isEmpty()) {
            throw new BadCredentialsException("Please enter your PIN number.");
        }

        User actualUser = userService.findByEmail(email);
        if (actualUser == null) {
            throw new BadCredentialsException("Invalid email.");
        }
        if (!actualUser.getPinNumber().equals(pinNumber)) {
            throw new BadCredentialsException("Invalid PIN number.");
        }

        return new UsernamePasswordAuthenticationToken(email, pinNumber, actualUser.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
