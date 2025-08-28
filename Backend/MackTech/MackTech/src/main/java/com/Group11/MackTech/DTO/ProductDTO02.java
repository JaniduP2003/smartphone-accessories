package com.Group11.MackTech.DTO;

public class ProductDTO02 {
    private Long pid;
    private String pname;
    private double price;
    private String imageUrl;
    private String category;
    private String brand;
    private int quantity;

    public ProductDTO02(Long pid, String pname, double price, String imageUrl, String category, String brand, int quantity) {
        this.pid = pid;
        this.pname = pname;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.brand = brand;
        this.quantity = quantity;
    }

    public ProductDTO02() {
    }


// Getters and Setters
    public Long getPid() { return pid; }
    public void setPid(Long pid) { this.pid = pid; }

    public String getPname() { return pname; }
    public void setPname(String pname) { this.pname = pname; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
