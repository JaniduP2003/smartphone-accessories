package com.Group11.MackTech.DTO;

public class UpdateUserRequest {
    private String email;
    private String newEmail;
    private String username;
    private String phoneNo;
    private String address;
    private String password;

    // Getters and Setters
    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getNewEmail() {return newEmail;}
    public void setNewEmail(String newEmail) {this.newEmail = newEmail;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public String getPhoneNo() {return phoneNo;}
    public void setPhoneNo(String phoneNo) {this.phoneNo = phoneNo;}

    public String getAddress() {return address;}
    public void setAddress(String address) {this.address = address;}
}