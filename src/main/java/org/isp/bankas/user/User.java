package org.isp.bankas.user;

import jakarta.persistence.*;
import lombok.Data;
import org.isp.bankas.accounts.BankAccount;
import org.isp.bankas.loan_request.LoanRequest;
import org.isp.bankas.role.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
@Table(name = "users")
public final class User implements UserDetails {

    @Id
    @Column(name = "pin_number", unique = true, nullable = false, length = 80)
    private String pinNumber;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 80)
    private String address;

    @Column(name = "last_login_date", nullable = false)
    private ZonedDateTime lastLoginDate;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "user_roles",
            joinColumns = {@JoinColumn(name = "user_pin", referencedColumnName = "pin_number")},
            inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "id")}
    )
    private List<Role> roles;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BankAccount> bankAccounts;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoanRequest> loanRequests;

    public User() {
        this("", "", "", "", null);
    }

    public User(String pinNumber,String name, String email, String address, ZonedDateTime lastLoginDate) {
        this.pinNumber = pinNumber;
        this.name = name;
        this.email = email;
        this.address = address;
        this.lastLoginDate = lastLoginDate == null ? ZonedDateTime.now(ZoneId.of("Europe/Vilnius")) : lastLoginDate;
        this.roles = new ArrayList<>();
        this.bankAccounts = new ArrayList<>();
        this.loanRequests = new ArrayList<>();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return  roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

    }

    public UserDTO transferToDTO() {
        return new UserDTO(pinNumber, name, email, address);
    }

    @Override
    public String getPassword() {
        return pinNumber;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public void setRoles(List<Role> roles) {
        this.roles = new ArrayList<>(roles);
    }
    public void setBankAccounts(List<BankAccount> bankAccounts) {
        this.bankAccounts = new ArrayList<>(bankAccounts);
    }
}
