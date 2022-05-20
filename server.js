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

app.get("/", function (req, res) {

  if (req.session.loggedIn) {
    res.redirect("/profile");

  } else {
    // retrieve and send the index.html document from the file system
    let login = fs.readFileSync("./app/html/login.html", "utf8");
    res.send(login);
  }

});

app.get("/myCart", function (req, res){
  if (req.session.loggedIn){
    let myCart = fs.readFileSync("./app/html/myCart.html", "utf8");
    res.send(myCart);
  } else {
    // If users not logged in, redirecte to login page
    res.redirect("/");
  }

});

app.get("/kitchenOrders", function (req, res){
  if (req.session.loggedIn){
    let kitchenOrders = fs.readFileSync("./app/html/kitchenOrders.html", "utf8");
    res.send(kitchenOrders);
  } else {
    // If users not logged in, redirecte to login page
    res.redirect("/");
  }

});

app.get("/signUp", function (req, res) {
  let signUp = fs.readFileSync("./app/html/signUp.html", "utf8");
  res.send(signUp);
});

// Directing to home page
app.get("/login", function (req, res) {

  if (req.session.loggedIn) {
    res.redirect("/profile");
    connectToMySQL(req, res);

  } else {
    // If users not logged in, redirect to login page
    res.redirect("/");
  }
});

app.get("/contact", function (req, res) {
  let contact = fs.readFileSync("./app/html/contact.html", "utf8");
  res.send(contact);
})

app.get("/profile", function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    let userProfile = fs.readFileSync("./app/html/profile.html", "utf8");
    res.send(userProfile);

  } else {
    // If users not logged in, rediret to login page
    res.redirect("/");
  }

});

app.get("/display-profile", function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    checkUsers(req, res);

  } else {
    // If users not logged in, redirect to login page
    res.redirect("/");
  }
});

// Multer to upload user avatar photos
const avatarStorage = multer.diskStorage({
  destination: function (req, file, callbackFunc) {
    callbackFunc(null, "./public/img/")
  },
  filename: function (req, file, callbackFunc) {
    callbackFunc(null, req.session.userId + "_avatar_" + file.originalname.split('/').pop().trim());
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

//----------------------------------------------------------------------------------------
// This post request is called to receive the updated user profile picture and update it
// on the bby_28_user table in the database.
//----------------------------------------------------------------------------------------
app.post('/upload-avatar', uploadAvatar.array("files"), async function (req, res) {

  await updateUserAvatar(req, res);
  res.redirect("/profile");

});

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

}

app.get("/kitchenRegistration", function (req, res) {
  if (req.session.loggedIn) {
    res.send(fs.readFileSync("./app/html/kitchenRegistration.html", "utf8"));
  } else {
    // If user's not logged in, redirect to login page
    res.redirect("/");
  }
});

app.get("/kitchenDetails", async function (req, res) {

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  if (req.session.loggedIn) {

    db.connect();

    const [results, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ?", [req.session.userId]);
    if (results.length == 1) {
      if (results[0].isPrivateKitchenOwner) {
        let kitchenDetails = fs.readFileSync("./app/html/kitchenDetails.html", "utf8");
        res.send(kitchenDetails);

      } else {
        res.redirect("/kitchenRegistration");
      }
    }

  } else {
    // If users not logged in, redirect to login page
    res.redirect("/");
  }

  db.end();
})

app.get("/addToCart", function(req, res) {
  if (req.session.loggedIn) {
    res.send(fs.readFileSync("./app/html/addToCart.html", "utf8"));
  } else {
    res.redirect("/");
  }
})

app.get("/upload", function (req, res) {

  if (req.session.loggedIn) {
    let upload = fs.readFileSync("./app/html/upload.html", "utf8");
    res.send(upload);

  } else {
    // If users not logged in, redirect to login page
    res.redirect("/");
  }
})

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
    // Send format error message for exception
    res.send({ status: "fail", msg: "Wrong data format" });
  }

  db.end();
});

//----------------------------------------------------------------------------------------
// This function is called when a post request is called to receive the updated user 
// profile data and update it on the bby_28_user table in the database.
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the user sign up data and call the registerPrivateKitchen() 
// function.
//----------------------------------------------------------------------------------------
app.post('/update-profile', function (req, res) {
  updateUserProfile(req, res);
});

//----------------------------------------------------------------------------------------
// Listens to a get routing request and loads the kitchenMap.html page.
//----------------------------------------------------------------------------------------
app.get("/map", function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    let kitchenMap = fs.readFileSync("./app/html/kitchenMap.html", "utf8");
    res.send(kitchenMap);

  } else {
    // If users not logged in, rediret to login page
    res.redirect("/");
  }

});

//----------------------------------------------------------------------------------------
// Listens to a get request to retrieve registered private kitchen addresses from the 
// bby_28_user table and send to the client-side kitchenMap.js
//----------------------------------------------------------------------------------------
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

// Log out and redirect to login page
app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Fail to log out")
      } else {
        // session deleted, redirect to login page
        res.redirect("/");
      }
    });
  }
});



//------------------------------------------------------------------------------------
// This function is called when user trys to log in to the home page. It autheticates
// the user record in the database and creates a session if a signed up user is found.
//------------------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------------------
// This function is called when user trys to redirect to the profile page. It checks 
// whether the logged-in user is a regular or admin user and loads the contents accordingly
// on the profile page.
//-----------------------------------------------------------------------------------------
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

// Receives ajaxPOST call from the client side. Call the checkAuthetication(req, res)
// function to validate the form entry information from the user.
app.post("/login", function (req, res) {

  checkAuthetication(req, res);
});


//----------------------------------------------------------------------------------------
// This function is called when user trys to sign up an account on the signUp page.  The
// function reads the input values and save to the bby_28_user table in the database.
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the user sign up data and call the signUpUser() 
// function.
//----------------------------------------------------------------------------------------
app.post("/signing-up", function (req, res) {
  signUpUser(req, res);
});

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
    // Send format error message for exception
    res.send({ status: "fail", msg: "Wrong data format" });
  }

  db.end();
});

//----------------------------------------------------------------------------------------
// This function is called when a post request is received to receive the private kitchen 
// registration data and insert it into the bby_28_user table in the database.
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the user sign up data and call the registerPrivateKitchen() 
// function.
//----------------------------------------------------------------------------------------
app.post('/register-kitchen', function (req, res) {
  registerPrivateKitchen(req, res);

});

app.post('/addUser', function (req, res) {
  adminAddUser(req, res);
});

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

app.post('/deleteUser', function (req, res) {
  deleteUser(req, res);
});

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

app.post("/updateUserDashboard", function (req, res) {
  updateUserDashboard(req, res);
});

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

// Multer to upload recipe or dish pictures of the user's private kitchen menu
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

//----------------------------------------------------------------------------------------
// This post request is called to receive the uploaded recipe or dish picture and update it
// in the BBY_28_Recipe table.
//----------------------------------------------------------------------------------------
app.post('/upload-recipe-dish-photo', uploadRecipeDish.array("files"), async function (req, res) {
  console.log(req.files);
  RecipeDishPhoto = req.files[0].filename;
  console.log(RecipeDishPhoto);

});


//----------------------------------------------------------------------------------------
// Listens to a post request to receive the upload recipe or dish form data and save it to 
// the bby_28_recipe table
//----------------------------------------------------------------------------------------
app.post('/upload-recipe-dish', async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);

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
    console.log("recipe added");

  } else if (req.body.recipeOrDish == "dish") {
    addRecipeOrDish = "use comp2800; insert ignore into BBY_28_Recipe (userID, name, description, purchaseable, price, recipePath) values ? ";
    recipeOrDishInfo = [[req.session.userId, req.body.name, req.body.description, 1, req.body.price, RecipeDishPhoto]];
    console.log("dish added")
  }

  await db.query(addRecipeOrDish, [recipeOrDishInfo]);
  db.end();

});


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

}

//-----------------------------------------------------------------------------------------
// Listens to a get request and checks the id of the user on the path.  It then reads the 
// recipe and dish data from the BBY_28_Recipe table and send to the client-side kitchenDetails.js.
//-----------------------------------------------------------------------------------------
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
    // If users not logged in, redirect to login page
    res.redirect("/");
  }
});

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

app.post("/deleteCartItem", function (req, res) {
  deleteCartItem(req, res);
})

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

app.post("/subQuantity", function (req, res) {
  subQuantity(req, res);
})

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

app.post("/addQuantity", function (req, res) {
  addQuantity(req, res);
})

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
    console.log(checkoutValues);

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


//----------------------------------------------------------------------------------------
// Listens to a get routing request and loads the addToCart.html page.
//----------------------------------------------------------------------------------------
app.get("/recipe-dish", function (req, res) {

  // check for a session 
  if (req.session.loggedIn) {
    let dishDetail = fs.readFileSync("./app/html/addToCart.html", "utf8");
    res.send(dishDetail);

  } else {
    // If users not logged in, rediret to login page
    res.redirect("/");
  }
});

//----------------------------------------------------------------------------------------
// Listens to a get request and reads data from the database for the requested recipe or dish.
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the add-to-shoppingcart dish data and save it to 
// the bby_28_Shoppingcart table
//----------------------------------------------------------------------------------------
app.post('/add-to-shoppingcart', async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);

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
  console.log("recipe added");

  await db.query(addItem, [addItemInfo]);
  db.end();

});

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
      console.log(prevCartResults);
      res.json(prevCartResults);
    }
    db.end();
  } else {
    res.redirect("/");
  }
})


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
    console.log(orderId);
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




// For page not found 404 error
app.use(function (req, res, next) {
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

async function connectToMySQL(req, res) {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });
  connection.connect();
  await connection.end();
}


// Run the local server on port 8000
let port = 8000;

app.listen(port, function () {
  console.log("A Bite of Home listening on port " + port + "!");
});
