package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.ProductDTO;
import com.Group11.MackTech.Entity.Product;
import java.util.List;


/**
 * Service interface for managing product operations.
 */

public interface ProductService {
    Product createProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(Long pid);
    Product updateProduct(Long pid, ProductDTO updatedProduct);
    boolean deleteProduct(Long pid);
}
