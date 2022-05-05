// REQUIRES
const express = require("express");
const session = require("express-session");
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
const fs = require("fs");
const { JSDOM } = require('jsdom');

// Map local js, css, image, icon, and font file paths to the app's virtual paths
app.use("/text", express.static("./public/text"));
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
// app.use("/icon", express.static("./public/icon"));
app.use("/font", express.static("./public/font"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  var email = req.body.email;
  var password = req.body.password;
  // res.setHeader("Content-Type", "application/json");
  console.log("What was sent", email, password);

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
    multipleStatements: true
  });

  db.connect();
  const [results1, fields1] = await db.execute("SELECT * FROM BBY_28_User WHERE email = ? AND password = ?", [email, password]);

  console.log(results1);
  var dbEmail = "";
  var dbPassword = "";
  var dbUserId = "";

  if (results1.length == 1) {
    dbEmail = results1[0].email;
    dbPassword = results1[0].password;
    dbUserId = results1[0].id;

  }

  if (req.body.email == dbEmail && req.body.password == dbPassword) {
    // user authenticated, create a session
    req.session.loggedIn = true;
    req.session.email = dbEmail;
    req.session.password = dbPassword;
    req.session.userId = dbUserId;
    req.session.save(function (err) {
    });
    res.send({ status: "success", msg: "Logged in." });
  } else {
    res.send({ status: "fail", msg: "Invalid credentials." });
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

  var userEmail = req.session.email;
  var userPassword = req.session.password;
  var userId = req.session.userId;

  const [regUser, fields] = await db.execute("SELECT * FROM BBY_28_User WHERE id = ? AND email = ?", [userId, userEmail]);
  var msg = "";
  var userFirstName = "";
  var userLastName = "";

  if (regUser.length == 1) {
    userFirstName = regUser[0].fName;
    userLastName = regUser[0].lName;
    if (regUser[0].isAdmin){
      msg = "Admin user: " + userFirstName + " " + userLastName;
    } else {
      msg = "Regular user: " + userFirstName + " " + userLastName;
    }
  }

  await db.end();
  let profile = fs.readFileSync("./app/html/profile.html", "utf8");
  let profileDOM = new JSDOM(profile);

  // Update user data on the porfile page
  profileDOM.window.document.getElementById("profile").innerHTML = msg;
  res.set("Server", "Wazubi Engine");
  res.set("X-Powered-By", "Wazubi");
  res.send(profileDOM.serialize());

}


// Receives ajaxPOST call from the client side. Call the checkAuthetication(req, res)
// function to validate the form entry information from the user.
app.post("/login", function (req, res) {

  checkAuthetication(req, res);
});

// For page not found (i.e., 404)
app.use(function (req, res, next) {
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});


async function connectToMySQL(req, res){
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

async function init(){

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