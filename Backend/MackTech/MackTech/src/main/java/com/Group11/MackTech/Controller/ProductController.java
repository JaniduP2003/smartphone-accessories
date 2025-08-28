package com.Group11.MackTech.Controller;

import com.Group11.MackTech.DTO.ProductDTO02;
//import com.Group11.MackTech.Service.ProductService;
import org.springframework.web.bind.annotation.*;
import com.Group11.MackTech.Service.FilterService;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    private final FilterService filterService;

    public ProductController(FilterService filterService) {
        this.filterService = filterService;
    }

    // Filter Endpoint
    @GetMapping("/filter")
    public List<ProductDTO02> getProductsByFilters(@RequestParam String category,
                                                   @RequestParam(required = false) String brand) {
        return filterService.getProductsByFilters(category, brand);
    }

    @GetMapping("/brands")
    public List<String> getBrandsByCategory(@RequestParam String category) {
    return filterService.getBrandsByCategory(category);
    }

    // Search Endpoint
    @GetMapping("/search")
    public List<ProductDTO02> searchProducts(
        @RequestParam String pname,
        @RequestParam String category
    ) {
        return filterService.searchProductsByNameAndCategory(pname, category);
    }
}
