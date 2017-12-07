drop database bamazon;
create database bamazon;
use bamazon;

create table products(
	itemid integer auto_increment not null,
    productName varchar(50) not null,
    departmentName varchar(50) not null,
    price decimal(10,4) not null,
    stockQuantity integer(10) not null,
    primary key (itemid)
)
    
INSERT INTO products(productName, departmentName, price, stockQuantity)
VALUES ("Gears of War", "video games", 30.99, 56),
 ("apples", "food", 0.49, 1000), 
 ("coffee mug", "kitchenware", 7.85, 500),
 ("bikes", "sporting goods", 350.50, 40),
 ("monopoly", "board game", 10.4, 45),
 ("Mad Max", "film", 20, 100);
 
 
INSERT INTO products(productName, departmentName, price, stockQuantity)
values ("Ray Ban Sunglasses", "apparel", 150, 20100),
 ("Sunflowers","garden",5, 43534);
 
 select * from bamazon.products;