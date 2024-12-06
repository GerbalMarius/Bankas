package org.isp.bankas.user;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public final class User implements UserDetails {

    @Id
    @Column(name = "pin_number", unique = true, nullable = false)
    private String pinNumber;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 80)
    private String password;

    @Column(nullable = false, length = 80)
    private String address;

    @Column(name = "last_login_date", nullable = false)
    private ZonedDateTime lastLoginDate;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    public User() {

    }

    public User(String pinNumber,String name, String email, String address, ZonedDateTime lastLoginDate) {
        this.pinNumber = pinNumber;
        this.name = name;
        this.email = email;
        this.address = address;
        this.lastLoginDate = lastLoginDate == null ? ZonedDateTime.now(ZoneId.of("Europe/Vilnius")) : lastLoginDate;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var auth  = new SimpleGrantedAuthority(role.getName());

        return List.of(auth);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
