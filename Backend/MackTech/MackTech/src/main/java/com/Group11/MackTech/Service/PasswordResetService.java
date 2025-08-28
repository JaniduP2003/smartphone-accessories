package com.Group11.MackTech.Service;

import com.Group11.MackTech.Entity.User;
import com.Group11.MackTech.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private static final long RESET_TOKEN_EXPIRATION_MINUTES = 30;

    public PasswordResetService(UserRepository userRepository, 
                               EmailService emailService,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = generateResetToken();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRATION_MINUTES));
        userRepository.save(user);

        // Send reset email
        sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (isTokenExpired(user.getResetTokenExpiry())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public boolean validateResetToken(String token) {
        return userRepository.findByResetToken(token)
                .map(user -> !isTokenExpired(user.getResetTokenExpiry()))
                .orElse(false);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private boolean isTokenExpired(LocalDateTime expiryDate) {
        return expiryDate.isBefore(LocalDateTime.now());
    }

    private void sendPasswordResetEmail(String email, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendEmail(
                email,
                "Password Reset Request",
                Map.of(
                        "resetLink", resetLink,
                        "expirationMinutes", RESET_TOKEN_EXPIRATION_MINUTES
                )
        );
    }
}
