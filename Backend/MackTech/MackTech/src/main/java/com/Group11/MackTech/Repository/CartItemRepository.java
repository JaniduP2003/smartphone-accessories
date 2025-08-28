package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCartIdAndId(Long cartId, Long itemId);
}
