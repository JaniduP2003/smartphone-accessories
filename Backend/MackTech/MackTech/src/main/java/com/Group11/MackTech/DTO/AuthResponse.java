package com.Group11.MackTech.DTO;

public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private Long customerId;

    public AuthResponse(String token, String role, Long userId, String email, Long customerId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.email = email;
        this.customerId = customerId;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
