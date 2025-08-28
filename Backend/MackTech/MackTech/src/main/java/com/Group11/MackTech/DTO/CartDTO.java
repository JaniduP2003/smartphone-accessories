package com.Group11.MackTech.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CartDTO {

    private Long id;
    private Long customerId;
    private LocalDateTime createdAt;
    private List<CartItemDTO> items;
    private double total;
}
