package com.Group11.MackTech.Controller;

import com.Group11.MackTech.Entity.Wishlist;
import com.Group11.MackTech.Service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<Wishlist> getWishlistItems() {
        return wishlistService.getAllItems();
    }

    @PostMapping
    public Wishlist addWishlistItem(@RequestBody Wishlist wishlistItem) {
        return wishlistService.addToWishlist(wishlistItem);
    }

    @DeleteMapping("/{id}")
    public void removeWishlistItem(@PathVariable Long id) {
        wishlistService.removeFromWishlist(id);
    }

    @DeleteMapping("/clear")
    public void clearWishlist() {
        wishlistService.clearWishlist();
    }
}
