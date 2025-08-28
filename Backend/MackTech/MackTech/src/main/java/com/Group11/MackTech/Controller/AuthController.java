package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.AuthResponse;
import com.Group11.MackTech.DTO.LoginRequest;
import com.Group11.MackTech.DTO.RegisterRequest;
import com.Group11.MackTech.Entity.User;
import com.Group11.MackTech.Service.AuthenticationService;
import com.Group11.MackTech.Service.JwtService;
import com.Group11.MackTech.Service.PasswordResetService;
import com.Group11.MackTech.util.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthenticationService authenticationService,
                         JwtService jwtService,
                         PasswordResetService passwordResetService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = authenticationService.register(request);
            
            return ResponseEntity.ok(Map.of(
                "status", true,
                "message", "User registered successfully",
                "userId", registeredUser.getId(),
                "role", registeredUser.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", false,
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserDetails userDetails = authenticationService.authenticate(loginRequest);
            String token = jwtService.generateToken(userDetails);
            
            User user = ((CustomUserDetails) userDetails).getUser();
            Long customerId = null;
            if ("CUSTOMER".equals(user.getRole()) && user.getCustomer() != null) {
                customerId = user.getCustomer().getId();
            }
            
            AuthResponse response = new AuthResponse(
                token,
                user.getRole(),
                user.getId(),
                user.getEmail(),
                customerId
            );
            
            System.out.println("Auth Response - userId: " + response.getUserId() + ", customerId: " + response.getCustomerId());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during authentication"));
        }
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            passwordResetService.initiatePasswordReset(email);
            return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (!passwordResetService.validateResetToken(token)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
            }

            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/password/validate-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateResetToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
}
