package com.Group11.MackTech.DTO;

public class ProductDTO {

    private Long productId; // Add the productId field to match 'pid' in the database
    private String pname;
    private String category;
    private String brand;
    private String description;
    private String imageUrl;
    private int quantity;
    private double price;
    private String colour;

    public ProductDTO() {}

    // Parameterized constructor, including 'productId'
    public ProductDTO(Long productId, String pname, String category, String brand, String description,
                      String imageUrl, int quantity, double price, String colour) {
        this.productId = productId;
        this.pname = pname;
        this.category = category;
        this.brand = brand;
        this.description = description;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.price = price;
        this.colour = colour;
    }

    // ADD Getters and setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getPname() { return pname; }
    public void setPname(String pname) { this.pname = pname; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getColour() { return colour; }
    public void setColour(String colour) { this.colour = colour; }
}
