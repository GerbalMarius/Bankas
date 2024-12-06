package org.isp.bankas.user;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "roles")
public final class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "role_name", length = 50, nullable = false)
    private String name;

    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<User> users;

    public Role() {

    }
    public Role(String name, Collection<? extends User> users) {
        this.name = name;
        this.users = new HashSet<>(users);
    }

    public void setUsers(Collection<? extends User> users) {
        this.users = new HashSet<>(users);
    }
}
