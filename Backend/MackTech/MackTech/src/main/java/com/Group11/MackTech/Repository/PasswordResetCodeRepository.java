package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.PasswordResetCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode,Integer> {
    Optional<PasswordResetCode> findByVerificationCode(String verificationCode);

}
