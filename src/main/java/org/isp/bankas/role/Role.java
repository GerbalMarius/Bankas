package org.isp.bankas.role;

import jakarta.persistence.*;
import lombok.Data;
import org.isp.bankas.user.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "roles")
public final class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "role_name", length = 50, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;

    public Role() {
        this("", new ArrayList<>());
    }
    public Role(String name) {
        this.name = name;
        this.users = new ArrayList<>();
    }
    public Role(String name, Collection<? extends User> users) {
        this.name = name;
        this.users = new ArrayList<>(users);
    }

    public void setUsers(Collection<? extends User> users) {
        this.users = new ArrayList<>(users);
    }
}
