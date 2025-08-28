package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.*;
import com.Group11.MackTech.Entity.*;
import com.Group11.MackTech.Repository.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import com.Group11.MackTech.DTO.UpdateEmailResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                      CustomerRepository customerRepository,
                      AdminRepository adminRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ResponseEntity<?> registerUser(SignupRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
        request.getEmail() == null || request.getEmail().trim().isEmpty() ||
        request.getPassword() == null || request.getPassword().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("All fields (username, email, password) must be filled");
        }

        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password
        customerRepository.save(customer);

        User user = new User();
        user.setRole("CUSTOMER");
        user.setCustomer(customer);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Customer registered successfully!");
    }

    public ResponseEntity<?> createCoAdmin(AdminRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password
        admin.setPhoneNo(request.getPhoneNo());
        admin.setAddress(request.getAddress());
        adminRepository.save(admin);

        User user = new User();
        user.setRole("ADMIN");
        user.setAdmin(admin);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Co-Admin registered successfully!");
    }

    public ResponseEntity<?> updateUserDetails(UpdateUserRequest request) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(request.getEmail());
        Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            
            // Handle email update
            if (request.getNewEmail() != null && !request.getNewEmail().isEmpty()) {
                // Check if new email already exists
                if (customerRepository.findByEmail(request.getNewEmail()).isPresent() ||
                    adminRepository.findByEmail(request.getNewEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists");
                }
                try {
                    // Update email in both Customer and User tables
                    Optional<User> userOpt = userRepository.findUserByEmail(request.getEmail());
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        user.setEmail(request.getNewEmail());
                        userRepository.save(user);
                        customer.setEmail(request.getNewEmail());
                        Customer updatedCustomer = customerRepository.save(customer);
                        
                        // First save all updates to ensure consistency
                        user.setEmail(request.getNewEmail());
                        User savedUser = userRepository.save(user);
                        customer.setEmail(request.getNewEmail());
                        Customer savedCustomer = customerRepository.save(customer);
                        
                        // Generate new JWT token with updated email
                        Map<String, Object> extraClaims = new HashMap<>();
                        extraClaims.put("role", savedUser.getRole());
                        String newToken = jwtService.generateToken(extraClaims, new org.springframework.security.core.userdetails.User(
                            savedUser.getEmail(),
                            savedUser.getPassword(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole()))
                        ));
                        
                        // Create response with updated data and new token
                        UpdateEmailResponse response = new UpdateEmailResponse(
                            "Email updated successfully",
                            savedUser.getEmail(),
                            savedCustomer,
                            newToken
                        );
                        return ResponseEntity.ok(response);
                    }
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Failed to update email: " + e.getMessage());
                }
            }
            
            // Handle password update
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                customer.setPassword(passwordEncoder.encode(request.getPassword()));
                Optional<User> userOpt = userRepository.findUserByEmail(request.getEmail());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    userRepository.save(user);
                }
                customerRepository.save(customer);
                return ResponseEntity.ok().body("Password updated successfully");
            }
            
            // Update other fields
            if (request.getUsername() != null && !request.getUsername().isEmpty()) {
                customer.setUsername(request.getUsername());
            }
            if (request.getPhoneNo() != null && !request.getPhoneNo().isEmpty()) {
                customer.setPhoneNo(request.getPhoneNo());
            }
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                customer.setAddress(request.getAddress());
            }
            
            Customer updatedCustomer = customerRepository.save(customer);
            return ResponseEntity.ok(updatedCustomer);
            
        } else if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            
            // Handle email update
            if (request.getNewEmail() != null && !request.getNewEmail().isEmpty()) {
                // Check if new email already exists
                if (customerRepository.findByEmail(request.getNewEmail()).isPresent() ||
                    adminRepository.findByEmail(request.getNewEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already exists");
                }
                try {
                    // Update email in both Admin and User tables
                    Optional<User> userOpt = userRepository.findUserByEmail(request.getEmail());
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        user.setEmail(request.getNewEmail());
                        userRepository.save(user);
                        admin.setEmail(request.getNewEmail());
                        Admin updatedAdmin = adminRepository.save(admin);
                        
                        // Generate new JWT token with updated email
                        Map<String, Object> extraClaims = new HashMap<>();
                        extraClaims.put("role", user.getRole());
                        String newToken = jwtService.generateToken(extraClaims, new org.springframework.security.core.userdetails.User(
                            request.getNewEmail(), // Use new email for token
                            user.getPassword(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                        ));
                        
                        // Create response with updated data and token
                        UpdateEmailResponse response = new UpdateEmailResponse(
                            "Email updated successfully",
                            request.getNewEmail(),
                            null, // Since this is an admin update
                            newToken
                        );
                        
                        return ResponseEntity.ok(response);
                    }
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Failed to update email: " + e.getMessage());
                }
            }
            
            // Handle password update
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                admin.setPassword(passwordEncoder.encode(request.getPassword()));
                Optional<User> userOpt = userRepository.findUserByEmail(request.getEmail());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    userRepository.save(user);
                }
                adminRepository.save(admin);
                return ResponseEntity.ok().body("Password updated successfully");
            }
            
            // Update other fields
            if (request.getUsername() != null && !request.getUsername().isEmpty()) {
                admin.setUsername(request.getUsername());
            }
            if (request.getPhoneNo() != null && !request.getPhoneNo().isEmpty()) {
                admin.setPhoneNo(request.getPhoneNo());
            }
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                admin.setAddress(request.getAddress());
            }
            
            Admin updatedAdmin = adminRepository.save(admin);
            return ResponseEntity.ok(updatedAdmin);
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    public ResponseEntity<?> getUserDetails(String email) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);

        if (customerOpt.isPresent()) {
            return ResponseEntity.ok(customerOpt.get());
        } else if (adminOpt.isPresent()) {
            return ResponseEntity.ok(adminOpt.get());
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    // CHANGE THE DELETING ORDER IF NOT DELETING, CASCADE PROBLEM
    public ResponseEntity<?> deleteUser(String email) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);

        if (customerOpt.isPresent()) {
            customerRepository.delete(customerOpt.get());
            userRepository.deleteByCustomerId(customerOpt.get().getId());
            return ResponseEntity.ok("Customer deleted successfully");
        } else if (adminOpt.isPresent()) {
            adminRepository.delete(adminOpt.get());
            userRepository.deleteByAdminId(adminOpt.get().getId());
            return ResponseEntity.ok("Admin deleted successfully");
        }
        return ResponseEntity.badRequest().body("User not found");
    }
}