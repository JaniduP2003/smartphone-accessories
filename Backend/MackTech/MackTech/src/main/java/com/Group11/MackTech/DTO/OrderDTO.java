package com.Group11.MackTech.DTO;


import lombok.Data;
import java.util.List;

@Data
public class OrderDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String paymentMethod; // String to match frontend
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double total;
    private List<Long> productIds;
}


