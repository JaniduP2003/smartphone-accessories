package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByProductName(String productName);
}
