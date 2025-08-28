package com.Group11.MackTech.DTO;

import com.Group11.MackTech.Entity.Customer;

public class UpdateEmailResponse {
    private String message;
    private Customer user;
    private String newEmail;
    private String token;

    public UpdateEmailResponse(String message, String newEmail, Customer user, String token) {
        this.message = message;
        this.newEmail = newEmail;
        this.user = user;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Customer getUser() {
        return user;
    }

    public void setUser(Customer user) {
        this.user = user;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
