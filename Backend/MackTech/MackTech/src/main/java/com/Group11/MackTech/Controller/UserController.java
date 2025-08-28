package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.*;
import com.Group11.MackTech.Service.UserService;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.Group11.MackTech.Service.AuthenticationService;
import com.Group11.MackTech.Service.JwtService;

//import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody SignupRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody AdminRequest request) {
        return userService.createCoAdmin(request);
    }
        
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        try {
            // Authenticate the user
            UserDetails userDetails = authenticationService.authenticate(request);
            
            // Generate JWT token
            String jwtToken = jwtService.generateToken(userDetails);
            
            // Get user details
            ResponseEntity<?> userResponse = userService.getUserDetails(request.getEmail());
            
            // Prepare response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful");
            responseBody.put("status", true);
            responseBody.put("token", jwtToken);
            responseBody.put("data", userResponse.getBody());
            
            return ResponseEntity.ok(responseBody);
        } catch (UsernameNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "User not found");
            errorResponse.put("status", false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (BadCredentialsException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email or password");
            errorResponse.put("status", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (AuthenticationException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Authentication failed: " + e.getMessage());
            errorResponse.put("status", false);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        return userService.getUserDetails(email);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserDetails(@RequestBody UpdateUserRequest request) {
        return userService.updateUserDetails(request);
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        return userService.deleteUser(email);
    }
}
