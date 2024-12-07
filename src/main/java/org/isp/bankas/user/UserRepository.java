package org.isp.bankas.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByPinNumber(String pinNumber);

    User findByEmail(String email);

    User findByEmailAndPinNumber(String email, String pinNumber);
}
