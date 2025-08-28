package com.Group11.MackTech.DTO;

public class CustomerQueryDTO {

    private Long id;
    private String customerName;
    private String email;
    private String subject;
    private String message;

    public CustomerQueryDTO() {
    }

    public CustomerQueryDTO(Long id, String customerName, String email, String subject, String message) {
        this.id = id;
        this.customerName = customerName;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}