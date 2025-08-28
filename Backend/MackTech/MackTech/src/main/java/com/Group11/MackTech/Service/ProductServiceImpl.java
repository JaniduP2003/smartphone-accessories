package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.ProductDTO;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);  // Save the product to the database and return the saved entity
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    @Override
    public Product getProductById(Long pid) { // Use 'pid' instead of 'id'
        return productRepository.findById(pid).orElse(null);
    }

    @Override
    public Product updateProduct(Long pid, ProductDTO updatedProduct) { // Use 'pid' instead of 'id'
        Optional<Product> existingProduct = productRepository.findById(pid);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setPname(updatedProduct.getPname());
            product.setCategory(updatedProduct.getCategory());
            product.setBrand(updatedProduct.getBrand());  
            product.setDescription(updatedProduct.getDescription());
            product.setImageUrl(updatedProduct.getImageUrl());
            product.setQuantity(updatedProduct.getQuantity());
            product.setPrice(updatedProduct.getPrice());
            product.setColour(updatedProduct.getColour());
            return productRepository.save(product);
        }
        return null;  // Return null if product not found
    }

    @Override
    public boolean deleteProduct(Long pid) { // Use 'pid' instead of 'id'
        if (productRepository.existsById(pid)) {
            productRepository.deleteById(pid);
            return true;
        }
        return false;
    }
}
