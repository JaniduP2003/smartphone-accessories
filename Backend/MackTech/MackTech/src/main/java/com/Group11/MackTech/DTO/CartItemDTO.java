package com.Group11.MackTech.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private String color;
    private double unitPrice;
    private double totalPrice;
    private String imageUrl;
}
