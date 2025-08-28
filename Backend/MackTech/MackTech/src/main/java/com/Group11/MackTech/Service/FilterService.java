package com.Group11.MackTech.Service;

import com.Group11.MackTech.DTO.ProductDTO02;
import com.Group11.MackTech.Entity.Product;
import com.Group11.MackTech.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilterService {

    private final ProductRepository productRepository;

    public FilterService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Filter by category (mandatory) and brand (optional)
    public List<ProductDTO02> getProductsByFilters(String category, String brand) {
    List<Product> products;

    if (brand != null && !brand.isEmpty()) {
        products = productRepository.findByCategoryAndBrand(category, brand);
    } else {
        products = productRepository.findByCategory(category);
    }

    return products.stream()
            .map(product -> new ProductDTO02(
                    product.getPid(),
                    product.getPname(),
                    product.getPrice(),
                    product.getImageUrl(),
                    product.getCategory(),
                    product.getBrand(),
                    product.getQuantity()
            ))
            .collect(Collectors.toList());
    }

    // Getting Brands dynamically to the filterpane
    public List<String> getBrandsByCategory(String category) {
        List<String> brands = productRepository.findDistinctBrandsByCategory(category);
        Collections.sort(brands);
        return brands;
    }    

    // Search by product name and category
    public List<ProductDTO02> searchProductsByNameAndCategory(String pname, String category) {
        List<Product> products = productRepository.findByCategoryAndPnameContainingIgnoreCase(category, pname);
        
        return products.stream()
                .map(product -> new ProductDTO02(
                        product.getPid(),
                        product.getPname(),
                        product.getPrice(),
                        product.getImageUrl(),
                        product.getCategory(),
                        product.getBrand(),
                        product.getQuantity()
                ))
                .collect(Collectors.toList());
    }
}
