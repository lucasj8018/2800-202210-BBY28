// REQUIRES
"use strict";
const express = require("express");
const session = require("express-session");
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
const fs = require("fs");
const {
  JSDOM
} = require('jsdom');
const multer = require("multer");

// Map local js, css, image, icon, and font file paths to the app's virtual paths
app.use("/text", express.static("./public/text"));
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/font", express.static("./public/font"));
app.use("/mp3", express.static("./public/mp3"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Secret text",
  name: "sessionID",
  resave: false,
  saveUninitialized: true
}));

//----------------------------------------------------------------------------------------------
// This get request path loads the profile page if the user is logged in and otherwise redirect
// the user to the login page.
//----------------------------------------------------------------------------------------------
app.get("/", function (req, res) {

  if (req.session.loggedIn) {
    res.redirect("/profile");

  } else {
    let login = fs.readFileSync("./app/html/login.html", "utf8");
    res.send(login);
  }
});

//----------------------------------------------------------------------------------------------
// This get request path loads the mycart page if the user is logged in and otherwise redirect
// the user to the login page.
//----------------------------------------------------------------------------------------------
app.get("/myCart", function (req, res){
  if (req.session.loggedIn){
    let myCart = fs.readFileSync("./app/html/myCart.html", "utf8");
    res.send(myCart);
  } else {
    res.redirect("/");
  }

});

//----------------------------------------------------------------------------------------------
// This get request path loads the kitchen order page if the user is logged in and otherwise 
// redirects the user to the login page.
//----------------------------------------------------------------------------------------------
app.get("/kitchenOrders", async function (req, res){
  if (req.session.loggedIn) {

    let idOfResponse = req.query["id"];

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });
    db.connect();

    const [results, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [req.session.userId]);
    if (results.length == 1) {
      if (!results[0].isPrivateKitchenOwner) {
        res.redirect("/kitchenRegistration");

      } else {
        let kitchenOrders = fs.readFileSync("./app/html/kitchenOrders.html", "utf8");
        res.send(kitchenOrders);
      }
    }
    db.end();

  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path loads the sign up page.
//----------------------------------------------------------------------------------------------
app.get("/signUp", function (req, res) {
  let signUp = fs.readFileSync("./app/html/signUp.html", "utf8");
  res.send(signUp);
});

//----------------------------------------------------------------------------------------------
// This get request path loads the contact page.
//----------------------------------------------------------------------------------------------
app.get("/contact", function (req, res) {
  let contact = fs.readFileSync("./app/html/contact.html", "utf8");
  res.send(contact);
})

//----------------------------------------------------------------------------------------------
// This get request path loads the profile page after the user is logged in.
//----------------------------------------------------------------------------------------------
app.get("/profile", function (req, res) {

  if (req.session.loggedIn) {
    let userProfile = fs.readFileSync("./app/html/profile.html", "utf8");
    res.send(userProfile);

  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path calls the checkUser(req, res) function when a user is logged in and 
// redirects to the profile page.
//----------------------------------------------------------------------------------------------
app.get("/display-profile", function (req, res) {

  if (req.session.loggedIn) {
    checkUsers(req, res);

  } else {
    res.redirect("/");
  }
});

// Set up multer to upload user avatar photos
const avatarStorage = multer.diskStorage({
  destination: function (req, file, callbackFunc) {
    callbackFunc(null, "./public/img/")
  },
  filename: function (req, file, callbackFunc) {
    callbackFunc(null, req.session.userId + "_avatar_" + file.originalname.split('/').pop().trim());
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

//----------------------------------------------------------------------------------------------
// This post request is called to receive the updated user profile picture and update it
// on the bby_28_user table in the database.
//----------------------------------------------------------------------------------------------
app.post('/upload-avatar', uploadAvatar.array("files"), async function (req, res) {

  await updateUserAvatar(req, res);
});

//----------------------------------------------------------------------------------------------
// This function is called when a post request is called to receive the updated user 
// profile data and update it on the bby_28_user table in the database.
//----------------------------------------------------------------------------------------------
async function updateUserAvatar(req, res) {

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  let updateAvatar = "use comp2800; UPDATE BBY_28_User SET avatarPath = ? WHERE id = ?";
  let avatarInfo = [
    req.files[0].filename, req.session.userId
  ];
  await db.query(updateAvatar, avatarInfo);
  db.end();

  res.send({ status: "success", msg: "Photo uploaded" });
}

//----------------------------------------------------------------------------------------------
// This get request path loads the kithcen registration page if the user is logged in.
//----------------------------------------------------------------------------------------------
app.get("/kitchenRegistration", function (req, res) {
  if (req.session.loggedIn) {
    res.send(fs.readFileSync("./app/html/kitchenRegistration.html", "utf8"));
  } else {
    // If user's not logged in, redirect to login page
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path reads and send the kitchen detail data if the logged-in user has a 
// registered kitchen.  Otherwise redirect to the kitchen registration page.
//----------------------------------------------------------------------------------------------
app.get("/kitchenDetails", async function (req, res) {

  if (req.session.loggedIn) {

    let idOfResponse = req.query["id"];

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });
    db.connect();

    const [results, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [req.session.userId]);
    if (results.length == 1) {
      if (!results[0].isPrivateKitchenOwner && idOfResponse == "loggedinUser") {
        res.redirect("/kitchenRegistration");

      } else {
        let kitchenDetails = fs.readFileSync("./app/html/kitchenDetails.html", "utf8");
        res.send(kitchenDetails);
      }
    }
    db.end();

  } else {
    res.redirect("/");
  }
})

//----------------------------------------------------------------------------------------------
// This get request path loads the add to cart page if the user is logged in.
//----------------------------------------------------------------------------------------------
app.get("/addToCart", function(req, res) {
  if (req.session.loggedIn) {
    res.send(fs.readFileSync("./app/html/addToCart.html", "utf8"));
  } else {
    res.redirect("/");
  }
})

//----------------------------------------------------------------------------------------------
// This get request path loads the recipe/dish upload page if the user is logged in.
//----------------------------------------------------------------------------------------------
app.get("/upload", async function (req, res) {

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  if (req.session.loggedIn) {

    const [results, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [req.session.userId]);
    if (results.length == 1) {
      if (results[0].isPrivateKitchenOwner) {
        let upload = fs.readFileSync("./app/html/upload.html", "utf8");
        res.send(upload);
      }
    }

  } else {
    res.redirect("/");
  }
})

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the user data from the BBY_28_User table to the user
// dashboard.
//----------------------------------------------------------------------------------------------
app.get("/user-dashboard", async function (req, res) {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  const [results, fields] = await db.execute("SELECT * FROM BBY_28_user");
  if (results.length != 0) {
    res.json(results);

  } else {
    res.send({ status: "fail", msg: "Fail to send data" });
  }
  db.end();
});

//----------------------------------------------------------------------------------------------
// This function is called when the post request path /update-profile is triggered to receive 
// the updated user profile data and update it on the bby_28_user table in the database.
//----------------------------------------------------------------------------------------------
async function updateUserProfile(req, res) {

  res.setHeader("Content-Type", "application/json");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  if (req.body.password != "●●●●●●●●") {
    let updateUser = "use comp2800; UPDATE BBY_28_User SET fName = ?, lName = ?, username = ?, password = ? WHERE id = ?";
    let passwordHash = "SELECT SHA1('" + req.body.password + "') as hash";
    const [hashed, hashedFields] = await db.query(passwordHash);
    let password = hashed[0].hash;
    let userInfo = [
      req.body.firstName, req.body.lastName, req.body.username, password, req.session.userId
    ];
    await db.query(updateUser, userInfo);
  } else {
    let updateNotPassword = "use comp2800; UPDATE BBY_28_User SET fName = ?, lName = ?, username = ? WHERE id = ?"
    let userInfo = [
      req.body.firstName, req.body.lastName, req.body.username, req.session.userId
    ];
    await db.query(updateNotPassword, userInfo);

  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the updateUserProfile(req, res) function.
//----------------------------------------------------------------------------------------------
app.post('/update-profile', function (req, res) {
  updateUserProfile(req, res);
});

//----------------------------------------------------------------------------------------------
// This get request path loads the kitchen map page if the user is logged in.
//----------------------------------------------------------------------------------------------
app.get("/map", function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    let kitchenMap = fs.readFileSync("./app/html/kitchenMap.html", "utf8");
    res.send(kitchenMap);

  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the registered private kitchen data from the BBY_28_User
// table.
//----------------------------------------------------------------------------------------------
app.get("/map-data", async function (req, res) {

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  const [registeredAddresses, fields] = await db.execute("SELECT id, location, kitchenName FROM BBY_28_User");

  if (registeredAddresses.length != 0) {
    res.json(registeredAddresses);

  } else {
    // Send format error message for exception
    res.send({ status: "fail", msg: "Wrong data format" });
  }
  db.end();
});

//----------------------------------------------------------------------------------------------
// This get request path ends the session of the logged in user and redirect to the login page.
//----------------------------------------------------------------------------------------------
app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Fail to log out")
      } else {
        res.redirect("/");
      }
    });
  }
});

//----------------------------------------------------------------------------------------------
// This function is called when the user trys to log in to the profile(home) page. It autheticates
// the user recod in the BBY_28_User table and creates a seesion if a matched user is found.
//----------------------------------------------------------------------------------------------
async function checkAuthetication(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  const [results1, fields1] = await db.execute("SELECT * FROM BBY_28_User WHERE username = ?", [username]);
  var dbUsername;
  var dbPassword;
  var dbUserId;

  if (results1.length == 1) {
    dbUsername = results1[0].username;
    dbPassword = results1[0].password;
    dbUserId = results1[0].id;

  }
  const [hashInput, inputFields] = await db.query("SELECT SHA1('" + req.body.password + "') as hash");
  req.body.password = hashInput[0].hash;
  if (req.body.username == dbUsername && req.body.password == dbPassword) {
    // user authenticated, create a session
    req.session.loggedIn = true;
    req.session.username = dbUsername;
    req.session.password = dbPassword;
    req.session.userId = dbUserId;
    req.session.save(function (err) { });
    res.send({
      status: "success",
      msg: "Logged in."
    });
  } else {
    res.send({
      status: "fail",
      msg: "Invalid credentials."
    });
  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This function is called when the user trys to redirect to the profile page.  It chekcs whether
// the logged-in user is a regular or admin user and loads the content accordingly on the profile
// page.
//----------------------------------------------------------------------------------------------
async function checkUsers(req, res) {

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  var userId = req.session.userId;

  const [userResults, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [userId]);

  if (userResults.length == 1) {
    res.json(userResults);
  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the checkAuthetication(req, res) function.
//----------------------------------------------------------------------------------------------
app.post("/login", function (req, res) {
  checkAuthetication(req, res);
});

//----------------------------------------------------------------------------------------------
// This function is called when the user trys to signup an account on the sigh-up page.  It reads
// the input field values and save to the BBY_28_User table.
//----------------------------------------------------------------------------------------------
async function signUpUser(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  let checkDuplicateUser = "use comp2800; SELECT username from bby_28_user where username = ?";
  let usernameValue = [
    [username]
  ];
  const [duplicateUser, dupeFields] = await db.query(checkDuplicateUser, [usernameValue]);

  if (duplicateUser[1][0]) {
    res.send({ status: "fail", msg: "Account already created" });
  } else {
    let addUser = "use comp2800; insert ignore into BBY_28_User (username, password, fName, lName) values ? ";
    let passwordHash = "SELECT SHA1('" + password + "') as hash";
    const [hashed, hashedFields] = await db.query(passwordHash);
    password = hashed[0].hash;
    let userInfo = [
      [username, password, firstName, lastName]
    ];
    await db.query(addUser, [userInfo]);
    res.send({ status: "success", msg: "Account  created" });

  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the signUpUser(req, res) function.
//----------------------------------------------------------------------------------------------
app.post("/signing-up", function (req, res) {
  signUpUser(req, res);
});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the private kitchen registration data in the BBY_28_User 
// table.
//----------------------------------------------------------------------------------------------
app.get("/check-kitchen-registration", async function (req, res) {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  const [results, fields] = await db.execute("SELECT * FROM BBY_28_user WHERE id = ?", [req.session.userId]);
  if (results.length != 0) {
    res.json(results);

  } else {
    res.send({ status: "fail", msg: "Fail to read data" });
  }
  db.end();
});

//----------------------------------------------------------------------------------------------
// This function is called with a post request path /register-kitchen to insert the private 
// kitchen registration data into the BBY_28_User table.
//----------------------------------------------------------------------------------------------
async function registerPrivateKitchen(req, res) {

  res.setHeader("Content-Type", "application/json");
  var kitchenName = req.body.name;
  var kitchenAddress = req.body.street + " " + req.body.city + " " + req.body.postalCode;

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });
  db.connect();

  let addPrivateKitchen = "use comp2800; UPDATE BBY_28_User SET kitchenName = ?, location = ?, isPrivateKitchenOwner = ? WHERE id = ?";
  let privateKitchenInfo = [
    kitchenName, kitchenAddress, 1, req.session.userId
  ];
  await db.query(addPrivateKitchen, privateKitchenInfo);
  db.end();
}

//---------------------------------------------------------------------------------------------- 
// This post request path calls the registerPrivateKitchen(req, res) function.
//----------------------------------------------------------------------------------------------
app.post('/register-kitchen', function (req, res) {
  registerPrivateKitchen(req, res);

});

//----------------------------------------------------------------------------------------------
// This post request path calls the adminAddUser(req, res) function.
//----------------------------------------------------------------------------------------------
app.post('/addUser', function (req, res) {
  adminAddUser(req, res);
});

//----------------------------------------------------------------------------------------------
// This function adds a new user to the BBY_28_User table with an admin user account.  It hashes
// the added user password.  This function is called by the post request path /addUser.
//----------------------------------------------------------------------------------------------
async function adminAddUser(req, res) {
  res.setHeader("Content-Type", "application/json");
  var userUsername = req.body.username;
  var userPassword = req.body.password;
  var userFirst = req.body.fName;
  var userLast = req.body.lName;
  var isAdmin = req.body.isAdmin;

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  let passwordHash = "SELECT SHA1('" + userPassword + "') as hash";
  const [hashed, hashedFields] = await db.query(passwordHash);
  userPassword = hashed[0].hash;

  let addUser = "use comp2800; insert ignore into BBY_28_User (username, password, fName, lName, isAdmin) values ? ";
  let userInfo = [
    [userUsername, userPassword, userFirst, userLast, isAdmin]
  ];
  await db.query(addUser, [userInfo]);
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the deleteUser(req, res) function.
//----------------------------------------------------------------------------------------------
app.post('/deleteUser', function (req, res) {
  deleteUser(req, res);
});

//----------------------------------------------------------------------------------------------
// This function deletes a user in the BBY_28_User table with an admin user account. It also 
// ensure at least one admin account is remained in the table and the logged-in user cannot 
// delete itself. This function is called by the post request path /deleteUser.
//----------------------------------------------------------------------------------------------
async function deleteUser(req, res) {
  res.setHeader("Content-Type", "application/json");
  var userID = req.body.id;
  var currentUser = req.body.user;
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();

  let checkAdmin = "SELECT * FROM BBY_28_user where isAdmin = 1";
  const [admins, adminFields] = await db.query(checkAdmin);
  let adminCount = admins.length;
  let adminID = admins[0].id;

  let checkUser = "SELECT id from bby_28_user where username = ?";
  let user = [
    [currentUser]
  ];
  let [currentDeleted, currentFields] = await db.query(checkUser, [user]);


  if (currentDeleted[0].id == userID) {
    res.send({
      status: "fail",
      msg: "Cannot delete current user"
    });
  } else if (adminCount == 1 && adminID == userID) {
    res.send({
      status: "fail",
      msg: "Cannot delete last admin"
    });
  } else {
    res.send({
      status: "success"
    });
    let deleteUser = "use comp2800; delete from bby_28_user where id = ?"
    let userInfo = [
      [userID]
    ];
    await db.query(deleteUser, [userInfo]);
  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the updateUserDashboard(req, res) function.
//----------------------------------------------------------------------------------------------
app.post("/updateUserDashboard", function (req, res) {
  updateUserDashboard(req, res);
});

//----------------------------------------------------------------------------------------------
// This function insert the added new user to the dasboard list.  This function is called by the 
// post request path /updateUserDashboard.
//----------------------------------------------------------------------------------------------
async function updateUserDashboard(req, res) {
  res.setHeader("Content-Type", "application/json");
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  if (req.body.password != "●●●●●●●●") {
    let updateUser = "use comp2800; UPDATE BBY_28_User SET username = ?, password = ? WHERE id = ?";
    let passwordHash = "SELECT SHA1('" + req.body.password + "') as hash";
    const [hashed, hashedFields] = await db.query(passwordHash);
    let password = hashed[0].hash;
    let userInfo = [
      req.body.username, password, req.body.id
    ];
    await db.query(updateUser, userInfo);
  } else {
    let updateNotPassword = "use comp2800; UPDATE BBY_28_User SET username = ? WHERE id = ?"
    let userInfo = [
      req.body.username, req.body.id
    ];
    await db.query(updateNotPassword, userInfo);

  }

  db.end();
}

// Set up multer to upload recipe/dish image file path the the BBY_28_User table for the logged-in user.
const recipeDishStorage = multer.diskStorage({
  destination: function (req, file, callbackFunc) {
    callbackFunc(null, "./public/img/")
  },
  filename: function (req, file, callbackFunc) {
    callbackFunc(null, req.session.userId + "_recipe_dish_" + file.originalname.split('/').pop().trim());
  }
});
const uploadRecipeDish = multer({ storage: recipeDishStorage });
var RecipeDishPhoto = "";

//----------------------------------------------------------------------------------------------
// This post request path stores the uploaded image filename path in the RecipeDishPhoto 
// variable.
//----------------------------------------------------------------------------------------------
app.post('/upload-recipe-dish-photo', uploadRecipeDish.array("files"), async function (req, res) {
  RecipeDishPhoto = req.files[0].filename;
  res.send({ status: "success", msg: "Photo uploaded" });

});

//----------------------------------------------------------------------------------------------
// This post request path saves the recipe/dish form data to the BBY_28_Recipe table for th
// logged-in user.
//----------------------------------------------------------------------------------------------
app.post('/upload-recipe-dish', async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });
  db.connect();

  if (req.body.recipeOrDish == "recipe") {
    var addRecipeOrDish = "use comp2800; insert ignore into BBY_28_Recipe (userID, name, description, recipePath) values ? ";
    var recipeOrDishInfo = [[req.session.userId, req.body.name, req.body.description, RecipeDishPhoto]];

  } else if (req.body.recipeOrDish == "dish") {
    addRecipeOrDish = "use comp2800; insert ignore into BBY_28_Recipe (userID, name, description, purchaseable, price, recipePath) values ? ";
    recipeOrDishInfo = [[req.session.userId, req.body.name, req.body.description, 1, req.body.price, RecipeDishPhoto]];
  }

  await db.query(addRecipeOrDish, [recipeOrDishInfo]);
  RecipeDishPhoto = "";
  db.end();
});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the kitchen name and recipe&dish data from the BBY_28_User
// and BBY_28_Recipe tables respectively.
//----------------------------------------------------------------------------------------------
app.get("/kitchen-details", async function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });

    db.connect();

    let idOfResponse = req.query["id"];
    if (idOfResponse == "loggedinUser") {
      idOfResponse = req.session.userId;
    }

    const [recipeResults, fields] = await db.execute("SELECT * FROM BBY_28_Recipe WHERE userID = ?", [idOfResponse]);
    const [userResults, fields2] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [idOfResponse]);
    recipeResults.push({ loggedinId: req.session.userId, kitchenName: userResults[0].kitchenName})
  
    if (recipeResults.length != 0) {
      res.json(recipeResults);
    }

    db.end();

  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the shopping cart data from the BBY_28_ShoppingCart 
// table.  It is triggered when the shopping cart page is loaded.
//----------------------------------------------------------------------------------------------
app.get("/displayShoppingCart", async function (req, res) {
  if (req.session.loggedIn) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    })
    db.connect();

    let shoppingCartQuery = `
      SELECT recipePath, name, price, quantity, cookID, recipeID
      FROM BBY_28_recipe, BBY_28_ShoppingCart
      WHERE recipeID = id
      AND cookID = userID
      AND customerID = ?
    `;
    const [shoppingCartResults, cartFields] = await db.query(shoppingCartQuery, [req.session.userId]);
    if (shoppingCartResults.length != 0) {
      res.json(shoppingCartResults);
    } else {
      res.json([{ recipePath: "EmptyShoppingCart" }]);
    }
    db.end();
  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This post request path calls the deleteCartItem(req, res) function. It is triggered when the
// delete button is clicked on the item list of the shopping cart page.
//----------------------------------------------------------------------------------------------
app.post("/deleteCartItem", function (req, res) {
  deleteCartItem(req, res);
})

//----------------------------------------------------------------------------------------------
// This function deletes an item data on the BBY_28_Shoppingcart table.  It is called by the 
// post request path /deleteCartItem.
//----------------------------------------------------------------------------------------------
async function deleteCartItem(req, res) {
  res.setHeader("Content-Type", "application/json");
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  if (req.body.cookID == -1 && req.body.recipeID == -1) {
    let deleteQuery = "DELETE FROM bby_28_shoppingcart where customerID = ?";
    let deleteValues = [
      req.session.userId
    ];
    await db.query(deleteQuery, deleteValues);
    res.send({ status: "success", msg: "Item deleted" });
  } else {
    let deleteQuery = "DELETE FROM bby_28_shoppingcart WHERE customerID = ? AND cookID = ? AND recipeID = ?";
    let deleteValues = [
      req.session.userId, req.body.cookID, req.body.recipeID
    ];
    await db.query(deleteQuery, deleteValues);
    res.send({ status: "success", msg: "Item deleted" });
  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the subQuantity(req, res) function. It is triggered when the
// the user clicks on the minus button the item row.
//----------------------------------------------------------------------------------------------
app.post("/subQuantity", function (req, res) {
  subQuantity(req, res);
})

//----------------------------------------------------------------------------------------------
// This function update the quantity of the item on the BBY_28_Shoppingcart table.  It is called 
// by the post request path /subQuantity.
//----------------------------------------------------------------------------------------------
async function subQuantity(req, res) {
  res.setHeader("Content-Type", "application/json");
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  let checkItemCount = "SELECT quantity from bby_28_shoppingcart where customerID = ? and cookID = ? and recipeID = ?";
  let checkValues = [
    req.session.userId, req.body.cookID, req.body.recipeID
  ];
  let [itemQuantity, fields] = await db.query(checkItemCount, checkValues);
  if (itemQuantity[0].quantity == 1) {
    let errorDivID = req.body.cookID + "_" + req.body.recipeID + "_sub";
    res.send({ status: "fail", id: errorDivID });
  } else {
    let subQuery = "update bby_28_shoppingcart set quantity = quantity - 1 where customerID = ? and cookID = ? and recipeID = ?";
    let subValues = [
      req.session.userId, req.body.cookID, req.body.recipeID
    ];
    await db.query(subQuery, subValues);
    res.send({ status: "success", msg: "Quantity decreased" });
  }
  db.end();
}

//----------------------------------------------------------------------------------------------
// This post request path calls the addQuantity(req, res) function. It is triggered when the
// the user clicks on the plus button the item row.
//----------------------------------------------------------------------------------------------
app.post("/addQuantity", function (req, res) {
  addQuantity(req, res);
})

//----------------------------------------------------------------------------------------------
// This function update the quantity of the item on the BBY_28_Shoppingcart table.  It is called 
// by the post request path /addQuantity.
//----------------------------------------------------------------------------------------------
async function addQuantity(req, res) {
  res.setHeader("Content-Type", "application/json");
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  let addQuery = "update bby_28_shoppingcart set quantity = quantity + 1 where customerID = ? and cookID = ? and recipeID = ?";
  let addValues = [
    req.session.userId, req.body.cookID, req.body.recipeID
  ];
  await db.query(addQuery, addValues);
  res.send({ status: "success", msg: "Quantity increased" });
  db.end();
}

//----------------------------------------------------------------------------------------------
// This get request path reads the user's input from their current shopping cart and inserts it
// into bby_28_prevcart. It then deletes the user's current shopping cart.
//----------------------------------------------------------------------------------------------
app.get("/checkoutCart", async function (req, res){
  if (req.session.loggedIn){
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });

    db.connect();
    let checkoutQuery = "SELECT * FROM bby_28_shoppingcart where customerID = ?";
    let [checkoutValues, fields] = await db.query(checkoutQuery, [req.session.userId]);

    let cooks = "";
    for (let i = 0; i < checkoutValues.length; i++){
      cooks += checkoutValues[i].cookID + "/";
    }
    cooks = cooks.slice(0, -1);

    let recipes = "";
    for (let i = 0; i < checkoutValues.length; i++){
      recipes += checkoutValues[i].recipeID + "/";
    }
    recipes = recipes.slice(0, -1);

    let quantities = "";
    for (let i = 0; i < checkoutValues.length; i++){
      quantities += checkoutValues[i].quantity + "/";
    }
    quantities = quantities.slice(0, -1);

    let historyQuery = "insert into bby_28_prevcart (customerID, cookIDs, recipeIDs, quantities, timestamp) values ?";
    let today = new Date().toISOString().slice(0, 10)
    let historyValues = [
      [req.session.userId, cooks, recipes, quantities, today]
    ];
    await db.query(historyQuery, [historyValues]);

    let deleteCurrentCart = "delete from bby_28_shoppingcart where customerID = ?"
    await db.query(deleteCurrentCart, [req.session.userId]);
    db.end();
    res.redirect("/myCart");
  } else {
    res.redirect("/");
  }


})

//----------------------------------------------------------------------------------------------
// This get request path loads the add to cart page.
//----------------------------------------------------------------------------------------------
app.get("/recipe-dish", function (req, res) {

  if (req.session.loggedIn) {
    let dishDetail = fs.readFileSync("./app/html/addToCart.html", "utf8");
    res.send(dishDetail);

  } else {
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the recipe/dish data from the BBY_28_Recipe table.  It 
// is trigggered when the user clicks the item view button of the recipe/dish list.
//----------------------------------------------------------------------------------------------
app.get("/recipe-dish-data", async function (req, res) {

  if (req.session.loggedIn) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });

    db.connect();
    const idOfResponse = req.query["id"].split("/");
    let userId = idOfResponse[0];
    let recipeDishId = idOfResponse[1];
  
    const [results, fields] = await db.execute("SELECT * FROM BBY_28_Recipe WHERE userID = ? AND id = ?", [userId, recipeDishId]);
  
    if (results.length != 0) {
      res.json(results);
    }
    db.end();
  }
});

//----------------------------------------------------------------------------------------------
// This post request path saves the dish data to the BBY_28_Shoppingcart table.  It is triggered
// when the user clicks the add to cart button on the dish detail page.
//----------------------------------------------------------------------------------------------
app.post('/add-to-shoppingcart', async function (req, res) {
  res.setHeader("Content-Type", "application/json");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });
  db.connect();

  var addItem = "use comp2800; insert ignore into BBY_28_Shoppingcart (customerID, cookID, recipeID, quantity) values ? ";
  var addItemInfo = [[req.session.userId, req.body.cookId, req.body.recipeId, req.body.qty]];

  await db.query(addItem, [addItemInfo]);
  db.end();

});

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the history order data from the BBY_28_Prevcart table.
// It is triggered when the shopping cart page is loaded.
//----------------------------------------------------------------------------------------------
app.get("/displayPreviousCarts", async function (req, res){
  if (req.session.loggedIn) {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    })
    db.connect();

    let prevCartQuery = `
      SELECT *
      FROM bby_28_prevcart
      WHERE customerID = ?
    `;
    const [prevCartResults, cartFields] = await db.query(prevCartQuery, [req.session.userId]);
    if (prevCartResults.length != 0) {
      res.json(prevCartResults);
    }
    db.end();
  } else {
    res.redirect("/");
  }
})

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the order detail data from both the BBY_28_Prevcart and 
// BBY_28_Recipe tables.  It is triggered when the user clicks the view button of the order in the
// history order list.
//----------------------------------------------------------------------------------------------
app.get("/displayPreviousOrder", async function (req, res){
  if (req.session.loggedIn){
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });

    db.connect();

    let orderId = req.query.id;
    let orderQuery = "SELECT * FROM bby_28_prevcart where historyID = ?";
    let [orderResults, fields] = await db.query(orderQuery, [orderId]);

    let recipeIdArray = orderResults[0].recipeIDs.split("/");
    let qtyArray = orderResults[0].quantities.split("/");
    let resultsArray = [];

    let dishQuery = "SELECT * FROM bby_28_Recipe where id = ?";

    for (let i = 0; i < recipeIdArray.length; i++) {
      let [dishResults, fields2] = await db.query(dishQuery, recipeIdArray[i])
      dishResults[0].quantity = qtyArray[i];
      dishResults[0].orderId = orderResults[0].historyID;
      resultsArray = resultsArray.concat(dishResults[0]);
    }

    res.json(resultsArray);
    db.end();

  } else {
    res.redirect("/");
  }
})

//----------------------------------------------------------------------------------------------
// This get request path reads and sends the kitchen orders data from BBY_28_prevcart and
// bby_28_recipe and bby_28_user tables. It is triggered when the user loads the kitchen
// orders page.
//----------------------------------------------------------------------------------------------
app.get("/displayKitchenOrders", async function (req, res){
  if (req.session.loggedIn){
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
      multipleStatements: true
    });

    db.connect();

    let query = "SELECT * FROM BBY_28_prevcart";
    let [resultsArray, fields] = await db.query(query);

    let customerOrders = [];
    let recipeOrders = [];
    let quantityOrders = []

    for (let i = 0; i < resultsArray.length; i++){
      let customer = resultsArray[i].customerID;
      let cooks = (resultsArray[i].cookIDs).split("/");
      let recipes = (resultsArray[i].recipeIDs).split("/");
      let quantities = (resultsArray[i].quantities).split("/");

      for (let j = 0; j < cooks.length; j++){
        if (cooks[j] == req.session.userId){
          customerOrders[customerOrders.length] = customer;
          recipeOrders[recipeOrders.length] = parseInt(recipes[j]);
          quantityOrders[quantityOrders.length] = parseInt(quantities[j]);
        }
      }
    }

    let results = [];

    for (let i = 0; i < customerOrders.length; i++){
      let query = "SELECT name from bby_28_recipe where id = ? and userID = ?";
      let values = [
        recipeOrders[i], req.session.userId
      ];
      let [queryResults, queryFields] = await db.query(query, values);
      let [customerResults, customerFields] = await db.query("SELECT username from bby_28_user where id = ?", customerOrders[i]);
      results[results.length] = {
        customer: customerResults[0].username,
        recipe: queryResults[0].name,
        quantity: quantityOrders[i]
      }
    }
    res.json(results);
    db.end();

  } else {
    res.redirect("/");
  }
})



//----------------------------------------------------------------------------------------------
// Display the page not found 404 error
//----------------------------------------------------------------------------------------------
app.use(function (req, res, next) {
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});


//----------------------------------------------------------------------------------------------
// Run the local server on port 8000
//----------------------------------------------------------------------------------------------
let port = 8000;
app.listen(port, function () {
  console.log("A Bite of Home listening on port " + port + "!");
});
