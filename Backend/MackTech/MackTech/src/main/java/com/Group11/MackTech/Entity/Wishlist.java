package com.Group11.MackTech.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;

    private String brand;

    private String image;

    private double price;

    private String selectedColor;

    // Constructors
    public Wishlist() {}

    public Wishlist(String productName, String brand, String image, double price, String selectedColor) {
        this.productName = productName;
        this.brand = brand;
        this.image = image;
        this.price = price;
        this.selectedColor = selectedColor;
    }

}
