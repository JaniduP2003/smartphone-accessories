package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    void deleteByCustomerId(Long customerId);
    void deleteByAdminId(Long adminId);
    Optional<User> findUserByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
}