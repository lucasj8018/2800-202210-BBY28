// REQUIRES
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
// app.use("/icon", express.static("./public/icon"));
app.use("/font", express.static("./public/font"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: "extra text that no one will guess",
  name: "wazaSessionID",
  // Create a new session for every request to the server
  resave: false,
  // create a unique identifier for that client
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

  // check for a session first
  if (req.session.loggedIn) {
    checkUsers(req, res);

  } else {
    // not logged in - no session and no access, redirect to login page
    res.redirect("/");
  }

});

// Log out and redirect to login page
app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out")
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
  // res.setHeader("Content-Type", "application/json");
  console.log("What was sent", username, password);

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  const [results1, fields1] = await db.execute("SELECT * FROM BBY_28_User WHERE username = ? AND password = ?", [username, password]);

  console.log(results1);
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

  const [regUser, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ? AND username = ?", [userId, userUsername]);
  var userProfile = "";
  var userFirstName = "";
  var userLastName = "";

  if (regUser.length == 1) {
    userFirstName = regUser[0].fName;
    userLastName = regUser[0].lName;
    userPassword = regUser[0].password;
    if (regUser[0].isAdmin) {
      msg = "Admin user: " + userFirstName + " " + userLastName;

      const [results, fields] = await db.execute("SELECT * FROM BBY_28_user");

      // Creating table
      let table = "<br/><br/><table class='table table-light table-striped' id='userTable'><tr><th scope='col'>Username</th><th scope='col'>Password</th><th scope='col'>Avatar</th><th scope ='col'></th></tr>"

      // For loops that appends to the table the users username, password and their avatar
      for (let i = 0; i < results.length; i++) {
        table += "</td><td>" + results[i].username +
          "</td><td>" + results[i].password +
          "</td><td><img src='./img/" + results[i].avatarPath + "' width ='50%', height ='50%'>" +
          "</td><td><button type ='submit' name='" + results[i].id + "'>Delete</button></td></tr>"
      }
      table += "</table>";
      userProfile += table;
    } else {

      userProfile = `<div class="card" style="width: 18rem;">
    <img src="`+ "./img/" + regUser[0].avatarPath+ `" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Your Profile</h5>
      <h5 class="firstName">` + userFirstName + `</h5>
      <h5 class="lastName">` + userLastName + `</h5>
      <h5 class="username">` + userUsername + `</h5>
      <h5 class="password">` + userPassword + `</h5>
      <a href="#" class="btn btn-primary">Edit</a>
    </div>
    </div>`;
    }
  }

  await db.end();
  let profile = fs.readFileSync("./app/html/profile.html", "utf8");
  let profileDOM = new JSDOM(profile);

  // Update user data on the porfile page
  profileDOM.window.document.getElementById("profile").innerHTML = userProfile;
  res.set("Server", "Wazubi Engine");
  res.set("X-Powered-By", "Wazubi");
  res.send(profileDOM.serialize());

}


// Receives ajaxPOST call from the client side. Call the checkAuthetication(req, res)
// function to validate the form entry information from the user.
app.post("/login", function (req, res) {

  checkAuthetication(req, res);
});


//------------------------------------------------------------------------------------
// This function is called when user trys to sign up an account on the signUp page.  The
// function reads the input values and save to the bby_28_user table in the database.
//------------------------------------------------------------------------------------
async function signUpUser(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  // res.setHeader("Content-Type", "application/json");
  console.log("What was sent", username, password, firstName, lastName);

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  // await db.query("use comp2800");
  let addUser = "use comp2800; insert into BBY_28_User (username, password, fName, lName) values ? ";
  let userInfo = [
    [username, password, firstName, lastName]
  ];
  await db.query(addUser, [userInfo]);

}

app.post("/signing-up", function (req, res) {

  signUpUser(req, res);
});






// For page not found (i.e., 404)
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

async function init() {

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true
  });

  // Sql file containing the code to create the database and tables.
  const createDBAndTables = fs.readFileSync("./sql/comp2800.sql").toString();

  await connection.query(createDBAndTables);

  // Sql file containing the code to add user to the database
  const addUsers = fs.readFileSync("./sql/addUsers.sql").toString();

  await connection.query(addUsers);

  connection.end();
}
// Run the local server on port 8000
let port = 8000;
app.listen(port, function () {
  console.log("Bite of Home listening on port " + port + "!");
  init();
});