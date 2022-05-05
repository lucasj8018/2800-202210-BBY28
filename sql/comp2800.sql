CREATE DATABASE IF NOT EXISTS COMP2800;
use COMP2800;

CREATE TABLE IF NOT EXISTS BBY_28_User(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email varchar(100) UNIQUE,
    password varchar(100) NOT NULL,
    fName varchar(100),
    lName varchar(100),
    location varchar(100),
    isPrivateKitchenOwner boolean DEFAULT false,
    isAdmin boolean DEFAULT false
);
CREATE TABLE IF NOT EXISTS BBY_28_Recipe(
	id int NOT NULL AUTO_INCREMENT,
    userID int NOT NULL,
    name varchar(100),
    description text,
    purchaseable boolean DEFAULT false,
    price int DEFAULT 0,
    CONSTRAINT FK_RecipeUser FOREIGN KEY (userID)
    REFERENCES BBY_28_User(id),
    CONSTRAINT UC_Recipe UNIQUE (id, userID)
);

CREATE TABLE IF NOT EXISTS BBY_28_RecipeIngredients(
	recipeID int NOT NULL,
    recipeUserID int NOT NULL,
    ingredient varchar(100),
    CONSTRAINT FK_IngredientRecipeID FOREIGN KEY (recipeID)
    REFERENCES BBY_28_Recipe(id),
    CONSTRAINT FK_IngredientRecipeUserID FOREIGN KEY (recipeUserID)
    REFERENCES BBY_28_Recipe(userID),
    CONSTRAINT UC_RecipeIngredients UNIQUE (recipeID, recipeUserID)
);

CREATE TABLE IF NOT EXISTS BBY_28_ShoppingCart(
	customerID int NOT NULL,
    cookID int NOT NULL,
    recipeID int NOT NULL,
    quantity int DEFAULT 1,
    CONSTRAINT FK_ShoppingCartCustomer FOREIGN KEY (customerID)
    REFERENCES BBY_28_User(id),
    CONSTRAINT FK_ShoppingCartCook FOREIGN KEY (cookID)
    REFERENCES BBY_28_Recipe(userID),
    CONSTRAINT FK_ShoppingCartRecipe FOREIGN KEY (recipeID)
    REFERENCES BBY_28_Recipe(id),
    CONSTRAINT UC_ShoppingCart UNIQUE (customerID, cookID, recipeID)
);
