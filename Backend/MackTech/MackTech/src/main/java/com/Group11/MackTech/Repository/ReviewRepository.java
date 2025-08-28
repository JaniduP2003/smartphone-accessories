package com.Group11.MackTech.Repository;

import com.Group11.MackTech.Entity.Customer;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProduct(Product product, Pageable pageable);
    List<Review> findByCustomer(Customer customer);
    boolean existsByCustomerAndProduct(Customer customer, Product product);
}