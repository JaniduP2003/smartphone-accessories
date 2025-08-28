package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.CartDTO;
import com.Group11.MackTech.DTO.CartItemDTO;
import com.Group11.MackTech.Entity.Cart;
import com.Group11.MackTech.Entity.CartItem;
import com.Group11.MackTech.Entity.Customer;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Repository.CartItemRepository;
import com.Group11.MackTech.Repository.CartRepository;
import com.Group11.MackTech.Repository.CustomerRepository;
import com.Group11.MackTech.Repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public CartDTO getCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        return mapToDTO(cart);
    }

    public CartDTO addItemToCart(Long customerId, CartItemDTO itemDTO) {
        Cart cart = getOrCreateCart(customerId);
        Product product = productRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(itemDTO.getQuantity());
        item.setColor(itemDTO.getColor());
        cart.addItem(item);

        cartRepository.save(cart);
        return mapToDTO(cart);
    }

    @Transactional
    public void removeItemFromCart(Long customerId, Long itemId) {
        Cart cart = getOrCreateCart(customerId);
        cartItemRepository.deleteByCartIdAndId(cart.getId(), itemId);
    }

    public CartDTO updateCartItem(Long customerId, Long itemId, CartItemDTO itemDTO) {
        cartItemRepository.findById(itemId).ifPresentOrElse(item -> {
            item.setQuantity(itemDTO.getQuantity());
            item.setColor(itemDTO.getColor());
            cartItemRepository.save(item);
        }, () -> {
            throw new RuntimeException("Item not found");
        });
        Cart cart = getOrCreateCart(customerId);
        return mapToDTO(cart);
    }

    public void clearCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Customer not found"));
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
    }

    private CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setCustomerId(cart.getCustomer().getId());
        dto.setCreatedAt(cart.getCreatedAt());

        List<CartItemDTO> itemDTOs = cart.getItems().stream().map(item -> {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getPid());
            itemDTO.setProductName(item.getProduct().getPname());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setColor(item.getColor());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setTotalPrice(item.getUnitPrice() * item.getQuantity());
            itemDTO.setImageUrl(item.getProduct().getImageUrl());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        dto.setTotal(itemDTOs.stream().mapToDouble(CartItemDTO::getTotalPrice).sum());

        return dto;
    }

    // private CartDTO mapToDTO(Cart cart) {
    //     CartDTO dto = new CartDTO();
    //     dto.setId(cart.getId());
    //     dto.setCustomerId(cart.getCustomer().getId());  // assuming Customer has getId()
    //     dto.setCreatedAt(cart.getCreatedAt());
    
    //     List<CartItemDTO> itemDTOs = cart.getItems().stream().map(item -> {
    //         CartItemDTO itemDTO = new CartItemDTO();
    //         itemDTO.setId(item.getId());
    //         itemDTO.setProductId(item.getProduct().getPid());  // Use getPid() based on your class
    //         itemDTO.setProductName(item.getProduct().getPname());  // Use getPname()
    //         itemDTO.setQuantity(item.getQuantity());
    //         itemDTO.setColor(item.getColor());
    //         itemDTO.setUnitPrice(item.getUnitPrice());
    //         itemDTO.setTotalPrice(item.getUnitPrice() * item.getQuantity());
    //         return itemDTO;
    //     }).toList();
    
    //     dto.setItems(itemDTOs);
    //     dto.setTotal(itemDTOs.stream().mapToDouble(CartItemDTO::getTotalPrice).sum());
    
    //     return dto;
    // }
    
}
