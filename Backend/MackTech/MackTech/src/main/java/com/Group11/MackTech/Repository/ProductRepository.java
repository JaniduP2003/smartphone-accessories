package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Filter by Category and Brand
    List<Product> findByCategoryAndBrand(String category, String brand);
    List<Product> findByCategory(String category);
    // List<Product> findByBrand(String brand);

    // Get Distinct Brands for a Category
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.category = :category")
    List<String> findDistinctBrandsByCategory(@Param("category") String category);

    // Search by partial name (case insensitive)
    List<Product> findByPnameContainingIgnoreCase(String pname);
    
    List<Product> findByCategoryAndPnameContainingIgnoreCase(String category, String pname);

    Optional<Product> findById(Long productId);
}
