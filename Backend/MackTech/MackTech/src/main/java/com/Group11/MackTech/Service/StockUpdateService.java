package com.Group11.MackTech.Service;

import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StockUpdateService {

    @Autowired
    private ProductRepository productRepository;

    public Product reduceStock(Long pid, int quantityPurchased) {
        Optional<Product> productOptional = productRepository.findById(pid);

        if (productOptional.isPresent()) {

            // Create a new product object to update
            Product updatedProduct = new Product();
            updatedProduct.setPid(productOptional.get().getPid());  // Copy the ID of the original product
            updatedProduct.setPname(productOptional.get().getPname());  // Copy other properties if needed
            updatedProduct.setDescription(productOptional.get().getDescription());
            updatedProduct.setBrand(productOptional.get().getBrand());
            updatedProduct.setColour(productOptional.get().getColour());
            updatedProduct.setCategory(productOptional.get().getCategory());
            updatedProduct.setPrice(productOptional.get().getPrice());
            updatedProduct.setImageUrl(productOptional.get().getImageUrl());


            // Set the new stock quantity
            updatedProduct.setQuantity(productOptional.get().getQuantity() - quantityPurchased);

            // Ensure stock is sufficient before reducing
            if (updatedProduct.getQuantity() >= 0) {
                return productRepository.save(updatedProduct);  // Save the updated product back to the repository
            } else {
                throw new RuntimeException("Not enough stock available!");  // If stock is insufficient
            }
        } else {
            throw new RuntimeException("Product not found!");  // If the product is not found
        }
    }


}
