package com.Group11.MackTech.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    private String color;

    @Column(nullable = false)
    private double unitPrice;

    @PrePersist
    @PreUpdate
    private void calculatePrice() {
        if (product != null && unitPrice == 0) {
            unitPrice = product.getPrice();
        }
    }
}
