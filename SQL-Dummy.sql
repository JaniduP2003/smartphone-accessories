SHOW DATABASES;
USE SEProject;

SHOW TABLES;
DESCRIBE users;

Select * from admins;
SELECT * FROM customers;
select * from users;
select * from products;
select * from cart_items;
select * from carts;
select * from order_products;
select * from orders;
select * from reviews;
select * from review_replies;

drop table users;
drop table customers;
drop table products;
drop table cart_items;
drop table carts;
drop table order_products;
drop table orders;

DELETE FROM users WHERE id = 6;
DELETE FROM customers WHERE id = 6;

############################################################

INSERT INTO products (pname, description, price, image_Url, category, brand, quantity, colour) 
VALUES 
('iPhone 14', 'Latest Apple smartphone', 212990, 'https://techcrunch.com/wp-content/uploads/2013/10/iphone-5s-5c.png?resize=1200', 'Smartphones', 'Apple', 50, 'Black, White, Blue'),

('Samsung Galaxy S23', 'New Samsung flagship phone', 204500, 'https://m-cdn.phonearena.com/images/phones/84042-350/Samsung-Galaxy-Z-Fold-5.jpg?w=1', 'Smartphones', 'Samsung', 30, 'Phantom Black, Green, Cream'),

('Sony WH-1000XM6', 'Noise Cancelling Wireless Headphones', 14390, 'https://wonderfulengineering.com/wp-content/uploads/2020/11/10-best-Wireless-Earbuds-8.jpg', 'Earphones', 'Sony', 20, 'Black, Silver'),

('MacBook Pro M2', 'Apple MacBook Pro with M2 chip', 149900, 'https://th.bing.com/th/id/OIP.Ht8aApbCF142fhb1JRzYXQHaE7?w=250&h=180&c=7&r=0&o=5&cb=iwc1&dpr=1.1&pid=1.7', 'Laptops', 'Apple', 15, 'Space Gray, Silver'),

('Logitech MX Master 3', 'Advanced wireless mouse', 1090, 'https://th.bing.com/th/id/OIP.xqSTeTS0AnBF6546xmd3EQHaHa?w=213&h=213&c=7&r=0&o=5&cb=iwc1&dpr=1.1&pid=1.7', 'Accessories', 'Logitech', 15, 'Graphite, Mid Gray'),

('Logitech MX Master 5', 'Advanced wireless mouse', 1890, 'https://th.bing.com/th/id/OIP.QCjSsnf_LZxV4YDJIeYf_QHaHa?w=197&h=197&c=7&r=0&o=5&cb=iwc1&dpr=1.1&pid=1.7', 'Accessories', 'Logitech', 10, 'Graphite, Mid Gray'),

('Dell XPS 15', 'High-performance Dell laptop', 189990, 'https://th.bing.com/th/id/OIP.3-gnsUPAVPugc62QeeoNDgHaDl?w=343&h=169&c=7&r=0&o=5&cb=iwc1&dpr=1.1&pid=1.7', 'Laptops', 'Dell', 10, 'Silver, Black'),

('Apple WH-1000XM5', 'Noise Cancelling Wireless Headphones', 11290, 'https://th.bing.com/th/id/R.258b91e7720d40a1e33d0d8e2e64209c?rik=eGdhJVxA6C1Nsg&pid=ImgRaw&r=0', 'Earphones', 'Apple', 20, 'Black, Silver'),

('Apple Wv-100tXM7', 'Noise Cancelling Wireless Headphones', 14200, 'https://tse2.mm.bing.net/th?id=OIP.PH21GspnPRFbmynFOV1tNwHaFb&cb=iwc1&pid=ImgDet&w=207&h=151&c=7', 'Earphones', 'Apple', 10, 'Blue, Silver'),

('Apple WH-1000XM11', 'Wireless Headphones', 25350, 'https://th.bing.com/th/id/R.6c20c03ae6492eba2cb36915bf586a27?rik=D97sjnv%2f3lmNCA&pid=ImgRaw&r=0', 'Earphones', 'Apple', 04, 'Black, Silver'),

('Joyroom Jbuds BC1', 'Wireless Headphones', 11350, 'https://th.bing.com/th/id/OIP.W45ohCr8PoFv3qhWmZxtegHaHa?cb=iwc1&rs=1&pid=ImgDetMain', 'Earphones', 'Joyroom', 08, 'Black, White'),

('iPhone 14', 'Latest Apple smartphone', 190920, 'https://techcrunch.com/wp-content/uploads/2013/10/iphone-5s-5c.png?resize=1200', 'Smartphones', 'Apple', 50, 'Black, White, Blue'),

('ApplePhone 14', 'Latest Apple smartphone', 190920, 'https://techcrunch.com/wp-content/uploads/2013/10/iphone-5s-5c.png?resize=1200', 'Smartphones', 'Apple', 50, 'Black, White, Blue'),

('Sony 14', 'Latest Sony smartphone', 150000, 'https://th.bing.com/th/id/OIP.LyeGpaVK_lEYfbVHFxtEsQHaHa?cb=iwc1&rs=1&pid=ImgDetMain', 'Smartphones', 'Sony', 50, 'Black, White, Blue');

Delete from products where pid = 13;
Delete from products where pid = 11;
Delete from products where pid = 9;


CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    description VARCHAR(1000),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    reply VARCHAR(1000),
    reply_date DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(pid),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);