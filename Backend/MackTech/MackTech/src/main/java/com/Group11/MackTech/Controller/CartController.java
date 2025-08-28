package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.CartDTO;
import com.Group11.MackTech.DTO.CartItemDTO;
import com.Group11.MackTech.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@RequestParam Long customerId) {
        return ResponseEntity.ok(cartService.getCart(customerId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(
            @RequestParam Long customerId,
            @RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.addItemToCart(customerId, itemDTO));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(
            @RequestParam Long customerId,
            @PathVariable Long itemId) {
        cartService.removeItemFromCart(customerId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateItem(
            @RequestParam Long customerId,
            @PathVariable Long itemId,
            @RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.updateCartItem(customerId, itemId, itemDTO));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestParam Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.noContent().build();
    }
}
