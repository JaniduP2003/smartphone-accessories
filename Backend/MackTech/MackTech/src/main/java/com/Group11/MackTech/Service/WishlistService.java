package com.Group11.MackTech.Service;

import com.Group11.MackTech.Entity.Wishlist;
import com.Group11.MackTech.Repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public WishlistService(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    public List<Wishlist> getAllItems() {
        return wishlistRepository.findAll();
    }

    public Wishlist addToWishlist(Wishlist item) {
        Optional<Wishlist> existing = wishlistRepository.findByProductName(item.getProductName());
        return existing.orElseGet(() -> wishlistRepository.save(item));
    }

    public void removeFromWishlist(Long id) {
        wishlistRepository.deleteById(id);
    }

    public void clearWishlist() {
        wishlistRepository.deleteAll();
    }
}
