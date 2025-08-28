package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.LoginRequest;
import com.Group11.MackTech.DTO.RegisterRequest;
import com.Group11.MackTech.Entity.User;
import com.Group11.MackTech.Entity.Admin;
import com.Group11.MackTech.Entity.Customer;
import com.Group11.MackTech.util.CustomUserDetails;
import com.Group11.MackTech.Repository.UserRepository;
import com.Group11.MackTech.Repository.AdminRepository;
import com.Group11.MackTech.Repository.CustomerRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetService passwordResetService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository,
                                AdminRepository adminRepository,
                                CustomerRepository customerRepository,
                                AuthenticationManager authenticationManager,
                                PasswordResetService passwordResetService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
        this.authenticationManager = authenticationManager;
        this.passwordResetService = passwordResetService;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails authenticate(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            return userRepository.findUserByEmail(loginRequest.getEmail())
                    .map(CustomUserDetails::new)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Authentication error: " + e.getMessage());
            throw e;
        }
    }

    @Transactional
    public User register(RegisterRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        // Check if email exists
        if (userRepository.findUserByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "CUSTOMER");

        // Create and save role-specific entity
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            Admin admin = new Admin();
            admin.setEmail(request.getEmail());
            admin.setUsername(request.getUsername());
            admin.setPassword(user.getPassword()); // Use the encoded password
            admin.setPhoneNo(request.getPhoneNo());
            admin.setAddress(request.getAddress());
            admin = adminRepository.save(admin);
            user.setAdmin(admin);
        } else {
            Customer customer = new Customer();
            customer.setEmail(request.getEmail());
            customer.setUsername(request.getUsername());
            customer.setPassword(user.getPassword()); // Use the encoded password
            customer = customerRepository.save(customer);
            user.setCustomer(customer);
        }

        return userRepository.save(user);
    }
    public void initiatePasswordReset(String email) {
        passwordResetService.initiatePasswordReset(email);
    }

    public void resetPassword(String token, String newPassword) {
        // Password will be encoded in the PasswordResetService
        passwordResetService.resetPassword(token, newPassword);
    }

    public boolean validateResetToken(String token) {
        return passwordResetService.validateResetToken(token);
    }
}