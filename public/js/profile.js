//-----------------------------------------------------------------------------------
// This function is called when the profile page first loads. It gets the user data 
// and populate on the profile card.  It displays the user list dashboard if it logged
// in as an admin user.  It also listens to post request to send updated profile data
// or dashboard updates to the server and save to the database.
//-----------------------------------------------------------------------------------
"use strict";
ready(async function () {
  var userData;

  fetch("/display-profile")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      userData = data;
      document.getElementById("profileTitle").innerHTML = userData[0].username + "'s Profile";
      document.getElementById("avatarPath").src = "./img/" + userData[0].avatarPath;
      document.getElementById("firstNameInput").value = userData[0].fName;
      document.getElementById("lastNameInput").value = userData[0].lName;
      document.getElementById("usernameInput").value = userData[0].username;
      document.getElementById("passwordInput").value = "●●●●●●●●";

      // Customizes the welcome on the profile page with the user's username
      document.getElementById("welcomeUsername").innerHTML = userData[0].username;

      // Creates an Add User div
      if (userData[0].isAdmin) {
        document.getElementById("title").innerHTML = "Admin User Profile";
        document.getElementById("adminAdd").innerHTML = `
        <div id="addUser" class="card">
        <div class="input-group mb-3" id="usernameCardInput">
          <div class="input-group-prepend">
            <span class="input-group-text">Username</span>
          </div>
          <input type="text" class="form-control" id="addUsername">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Password</span>
          </div>
          <input type="text" class="form-control" id="addPassword">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">First Name</span>
          </div>
          <input type="text" class="form-control" id="addFirst">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Last Name</span>
          </div>
          <input type="text" class="form-control" id="addLast">
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="isAdminSlider">
          <label class="form-check-label" for="flexSwitchCheckDefault">Admin user?</label>
        </div>
          <button id="addUserButton" class='btn btn-primary' id="addUserLabel">Add User</button>
          <div id="incorrectInput"></div>
        </div>
        
        `;

      } else {
        document.getElementById("buttonMenu").innerHTML = `
        <p id="question"><b>I would like to...</b></p>
        <a href="/map" class="buttonLabel" id="viewKitchens">Find Recipes/Dishes</a>
        <a href="/myCart" class="buttonLabel" id="myCart">View My Cart</a>
        <a href="/kitchenRegistration" class="buttonLabel" id="registerKitchen">Register My Private Kitchen</a>
        <a href="/kitchenOrders" class="buttonLabel" id="kitchenOrders">View My Private Kitchen's Orders</a>
        <a href="/kitchenDetails?id=loggedinUser" class="buttonLabel" id="viewMyKitchen">View My Private Kitchen's Details</a>

        `;

      }

    })
    .catch(function (error) {
      console.log(error);
    })

  //-----------------------------------------------------------------------------------
  // This is a get response to populate the profile card with the user's last name, first
  // name, username, and password data in the BBY28_Users table.
  //-----------------------------------------------------------------------------------
  await fetch("/user-dashboard")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var dashboardData;
      dashboardData = data;

      if (userData[0].isAdmin) {
        //Creating table
        var dashboard = "";
        let table = "<br/><br/><div id='incorrectDelete'> </div><br/><br/><div><table class='table table-light table-striped' id='userTable'><tr id='userTableHeader'>" +
          "<th scope='col'>Username</th><th scope='col'>Password</th><th scope='col'>Avatar</th><th scope ='col'></th></tr>"

        // For loops that appends to the table the users username, password and their avatar
        for (let i = 0; i < dashboardData.length; i++) {
          table += "</td><td><input type='text' value='" + dashboardData[i].username + "'id='inputUsernameID" + dashboardData[i].id + "'  disabled style='max-width: 50%'>" +
            "</td><td><input type='text' value='" + "●●●●●●●●" + "'id='inputPasswordID" + dashboardData[i].id + "' disabled style='max-width: 50%'>" +
            "</td><td><img src='./img/" + dashboardData[i].avatarPath + "' width ='100px', height ='100px'>" +
            "</td><td><button type='button' class='btn btn-outline-info' onclick='deleteClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Delete</a><br>" +
            "<button type='button' class='btn btn-outline-info' onclick='editClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Edit</a><br>" +
            "<button type='button' class='btn btn-outline-info' onclick='saveClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Save</a></td>" +
            "</tr>"
        }
        table += "</table></div>";
        dashboard += table;

        document.getElementById("dashboard").innerHTML = dashboard;
        addUserButtonListener();

      }

    })
    .catch(function (error) {
      location.reload();
    })

  //-----------------------------------------------------------------------------------
  // This function is called when the save button of the user profile template is pressed.
  // It gets the unpdated profile info and post to the server.
  //-----------------------------------------------------------------------------------
  async function postData(data) {
    try {
      let resObject = await fetch("/update-profile", {
        method: 'POST',
        headers: {
          "Accept": 'application/json',
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
      let parsedData = await resObject.json();
    } catch (error) {
      console.log(error);
    }
  }

  // Feedback message for missing input data
  document.getElementById("updateUserInfo").disabled = true;

  document.getElementById("editUserInfo").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("personalInfoFields").disabled = false;
    document.getElementById("updateUserInfo").disabled = false;
    document.getElementById("editUserInfo").disabled = true;
  })

  document.getElementById("updateUserInfo").addEventListener("click", function (e) {
    e.preventDefault();
    postData({
      firstName: document.getElementById("firstNameInput").value,
      lastName: document.getElementById("lastNameInput").value,
      username: document.getElementById("usernameInput").value,
      password: document.getElementById("passwordInput").value
    })

    document.getElementById("personalInfoFields").disabled = true;
    document.getElementById("editUserInfo").disabled = false;
    document.getElementById("updateUserInfo").disabled = true;
    document.getElementById("status").innerHTML = "Profile Updated";
  })



});

  //-----------------------------------------------------------------------------------
  // This is a post request to send new user information added by the admin to the
  // server.
  //-----------------------------------------------------------------------------------
async function postDataUser(data) {
  try {
    let resObject = await fetch("/addUser", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();
  } catch (error) {
    console.log(error);
  }
}

//-----------------------------------------------------------------------------------
// This function is called when the an admin user is logged in and the user dashboard
// loads. It then adds a listener to the add user button and calls the postDataUser()
// function.
//-----------------------------------------------------------------------------------
function addUserButtonListener() {
  if (document.getElementById("addUserButton")) {
    document.getElementById("addUserButton").addEventListener("click", function (e) {
      if (document.getElementById("addUsername").value == '' || document.getElementById("addPassword").value == '' ||
        document.getElementById("addFirst").value == '' || document.getElementById("addLast").value == '') {
        document.getElementById("incorrectInput").innerHTML = "Please fill out all the fields.";
      } else {
        postDataUser({
          username: document.getElementById("addUsername").value,
          password: document.getElementById("addPassword").value,
          fName: document.getElementById("addFirst").value,
          lName: document.getElementById("addLast").value,
          isAdmin: document.getElementById("isAdminSlider").checked
        });
        location.reload();
      }

    });
  }
}

//-----------------------------------------------------------------------------------
// This function sends a post request to delete a user in the BBY_28_User table. 
// It is called when an admin user clicks the delete button on the user dashboard.
//-----------------------------------------------------------------------------------
async function postDeleteUser(data) {
  try {
    let resObject = await fetch("/deleteUser", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();
    if (parsedData.status == 'fail') {
      document.getElementById('incorrectDelete').innerHTML = parsedData.msg;
    } else {
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

//-----------------------------------------------------------------------------------
// This is an onclick function attached to the delete button on the dashboard. It 
// calls the postDeleteUser() function when the button is clicked.
//-----------------------------------------------------------------------------------
function deleteClicked(name) {
  postDeleteUser({
    id: name,
    user: document.getElementById('usernameInput').value
  });
}

//-----------------------------------------------------------------------------------
// This is an onclick function attached to the edit button on the dashboard. It enables 
// the username and password input field to be editable.
//-----------------------------------------------------------------------------------
function editClicked(name) {
  document.getElementById("inputUsernameID" + name).disabled = false;
  document.getElementById("inputPasswordID" + name).disabled = false;
}

//-----------------------------------------------------------------------------------
// This is an onclick function attached to the save button on the dashboard. It calls 
// the postUpdateDashboard() function.
//-----------------------------------------------------------------------------------
function saveClicked(name) {
  postUpdateDashboard({
    username: document.getElementById("inputUsernameID" + name).value,
    password: document.getElementById("inputPasswordID" + name).value,
    id: name
  });
  document.getElementById("inputUsernameID" + name).disabled = true;
  document.getElementById("inputPasswordID" + name).disabled = true;
}

//-----------------------------------------------------------------------------------
// This function sends a post request to update a user in the BBY_28_User table. 
// It is called when an admin user clicks the save button on the user dashboard.
//-----------------------------------------------------------------------------------
async function postUpdateDashboard(data) {
  try {
    let resObject = await fetch("/updateUserDashboard", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();

  } catch (error) {
    console.log(error);
  }
}

//-------------------------------------------------------------------------------------------
// This function is called to check whether the page is laoded.
//--------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}