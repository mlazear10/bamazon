var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "bamazon"
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connection successful");
    promptManager();
})

var promptManager = function(res) {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: "What would you like to do? [Quit with Q]",
        default: 'View Products for Sale',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(answer) {
        console.log(answer.choice);
        switch(answer.choice) {
        case 'View Products for Sale' :
            saleableProducts();
            break;
        case 'View Low Inventory' :
            lowInventory();
            break;
        case 'Add to Inventory' :
            addInventory();
            break;
        case 'Add New Product' :
            newProduct();
        }
    });      
}

var saleableProducts = function() {
    connection.query("SELECT * FROM products", function(err, res){
        console.log("PRODUCTS FOR SALE:");
        for(var i=0; i< res.length; i++) {      
            console.log(res[i].itemid+" || "+res[i].productName+" || "+res[i].departmentName+" || "+res[i].stockQuantity+" || "+res[i].price);
        }
    promptManager(res);
    })
}

// Low inventory for items that are below 50 items
var lowInventory = function() {
    inquirer.prompt({
        name: "inventoryCheck",
        type: 'input',
        message: "Search for products with inventory below what numeric value?? (example 50)",
        validate: function(value) {
            if(isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }).then(function(answer){
        connection.query("SELECT * FROM products WHERE stockQuantity < 50", function(err, res) {
            if (err) throw err;
            console.log("LOW INVENTORY below quantity of 50: ");
            for(var i = 0; i < res.length; i++) {
                var parseNum = parseInt(i) + 1;
                console.log("ItemID: " + res[i].itemid + " - Product Name: " + res[i].productName + " | " + "Department Name: " +  res[i].departmentName + " | " + "Price: $"+  res[i].price + " | " + "Stock Quantity: " + res[i].stockQuantity);
            }
            promptManager();
        });
    })
}

// add inventory function
var products = [];
var addInventory = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            var parseNum = parseInt(i) + 1;       
            products.push(res[i].productName);
        }
        askInventory();
        function askInventory() { 
            console.log(products);
            inquirer.prompt([{
                type: 'list',
                name: 'productChoice',
                message: "What products would you like to add?",
                choices: products
            }, {
                type: 'input',
                name: 'howMuch',
                message: 'How much inventory should we add?',
                validate: function(value) {
                    if (isNaN(value)) {
                        return false 
                    } else {
                        return true
                    }
                }
            }]).then(function(answer) {
                for (var i = 0; i < res.length; i++) {
                    if (answer.productChoice == res[i].productName) {
                        var id = i;
                        console.log(answer);
                        console.log(res[id]);
                        console.log(res[id].stockQuantity + parseInt(answer.howMuch));
                        // var prodQuant = answer.push(res[i].stockQuantity);
                        connection.query("UPDATE products SET stockQuantity='"+(res[id].stockQuantity + parseInt(answer.howMuch)+"' WHERE productName='"+answer.productChoice+"'"), function(err , res) {
                            console.log("Product Added");
                        })
                        console.log("Cost $" + res[id].price * answer.howMuch);
                        promptManager();
                    }
                }
            });
        }   
    })
}

// adds a new product to the database
var newProduct = function() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What new product are we adding?",
    }, {
        name: "category",
        type: "input",
        message: "What category do you want to place the item in?",
    }, {
        name: "price",
        type: "input",
        message: "How much will the product sell for?",
        validate: function(value) {
            if(isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
    name: "quantity",
    type: "input",
    message: "What is the quantity of the new product?",
    validate: function(value) {
        if(isNaN(value) == false) {
            return true;
        } else {
            return false;
        }
    }
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            productName: answer.item,
            departmentName: answer.category,
            price: answer.price,
            stockQuantity: answer.quantity
        }, function(err,res) {
            console.log("Your products were succcessfully added to the inventory");
            promptManager();
        })
    })
}
