package org.isp.bankas.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByPinNumber(String pinNumber);
    User findByEmail(String email);
    User findByEmailOrPinNumber(String email, String pinNumber);
    List<User> findAll(); // Add this line if you need a method to fetch all users
}