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

// Map local js, css, image, icon, and font file paths to the app's virtual paths
app.use("/text", express.static("./public/text"));
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/font", express.static("./public/font"));

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
    // If users not logged in, rediret to login page
    res.redirect("/");
  }
});

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
    // If users not logged in, rediret to login page
    res.redirect("/");
  }

});

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
});

//----------------------------------------------------------------------------------------
// This function is called when a post request is received to receive the private kitchen 
// registration data and insert it into the bby_28_user table in the database.
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

  let updateUser = "use comp2800; UPDATE BBY_28_User SET fName = ?, lName = ?, username = ?, password = ? WHERE id = ?";
  let userInfo = [
    req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.session.userId
  ];
  await db.query(updateUser, userInfo);
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
// Listens to a get routing request and loads the ktichenMap.html page.
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
// Listens to a get request to retrieve registered private kithcen addresses from the 
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

  const [registeredAddresses, fields] = await db.execute("SELECT location FROM BBY_28_User");
  var addresses;
  var addressData = [];

  for (let i = 0; i < registeredAddresses.length; i++) {
    addresses = registeredAddresses[i].location;
    addressData.push(addresses);
  }
  
  console.log(addressData);

  if (addressData.length != 0) {
      res.json(addressData);

  } else {
      // Send format error message for exception
      res.send({ status: "fail", msg: "Wrong data format" });
  }
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
  const [results1, fields1] = await db.execute("SELECT * FROM BBY_28_User WHERE username = ? AND password = ?", [username, password]);

  var dbUsername;
  var dbPassword;
  var dbUserId;

  if (results1.length == 1) {
    dbUsername = results1[0].username;
    dbPassword = results1[0].password;
    dbUserId = results1[0].id;

  }

  if (req.body.username == dbUsername && req.body.password == dbPassword) {
    // user authenticated, create a session
    req.session.loggedIn = true;
    req.session.username = dbUsername;
    req.session.password = dbPassword;
    req.session.userId = dbUserId;
    req.session.save(function (err) {});
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

  var userUsername = req.session.username;
  var userId = req.session.userId;

  const [userResults, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ? AND username = ?", [userId, userUsername]);

  if (userResults.length == 1) {
    res.json(userResults);
  }
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
  let addUser = "use comp2800; insert into BBY_28_User (username, password, fName, lName) values ? ";
  let userInfo = [
    [username, password, firstName, lastName]
  ];
  await db.query(addUser, [userInfo]);

}

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the user sign up data and call the signUpUser() 
// function.
//----------------------------------------------------------------------------------------
app.post("/signing-up", function (req, res) {
  signUpUser(req, res);
});

//----------------------------------------------------------------------------------------
// This function is called when a post request is received to receive the private kitchen 
// registration data and insert it into the bby_28_user table in the database.
//----------------------------------------------------------------------------------------
async function registerPrivateKitchen(req, res) {
  
  res.setHeader("Content-Type", "application/json");
  var kitchenName = req.body.name;
  var kitchenAddress = req.body.street + " " + req.body.city + " " + req.body.postalCode;

  console.log("Name", req.body.kitchenName);
  console.log("Address", req.body.address);

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  let addPrivateKitchen = "use comp2800; insert into BBY_28_User (kitchenName, location) values ? ";
  let privateKitchenInfo = [
    [kitchenName, kitchenAddress]
  ];
  await db.query(addPrivateKitchen, [privateKitchenInfo]);
  db.end();
}

//----------------------------------------------------------------------------------------
// Listens to a post request to receive the user sign up data and call the registerPrivateKitchen() 
// function.
//----------------------------------------------------------------------------------------
app.post('/register-kitchen', function (req, res) {
  registerPrivateKitchen(req, res);
});

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
  console.log("Bite of Home listening on port " + port + "!");
});