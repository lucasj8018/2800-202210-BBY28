//----------------------------------------------------------------------------------
// This function is called when the private kitchen registration page first loads. 
// It posts the registration form data to the server.
//----------------------------------------------------------------------------------
"use strict";
ready(function () {
  var userData;

  fetch("/display-profile")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      userData = data;
      console.log(userData);
      document.getElementById("avatarPath").src = "./img/" + userData[0].avatarPath;
      document.getElementById("firstNameInput").value = userData[0].fName;
      document.getElementById("lastNameInput").value = userData[0].lName;
      document.getElementById("usernameInput").value = userData[0].username;
      document.getElementById("passwordInput").value = "●●●●●●●●";

      if (userData[0].isAdmin) {
        document.getElementById("title").innerHTML = "Admin User Profile";
        document.getElementById("adminAdd").innerHTML = `
        <div id="addUser" class="card">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" >Username</span>
          </div>
          <input type="text" class="form-control" id="addUsername">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" >Password</span>
          </div>
          <input type="text" class="form-control" id="addPassword">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" >First Name</span>
          </div>
          <input type="text" class="form-control" id="addFirst">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" >Last Name</span>
          </div>
          <input type="text" class="form-control" id="addLast">
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="isAdminSlider">
          <label class="form-check-label" for="flexSwitchCheckDefault">Admin user?</label>
        </div>
          <button id="addUserButton" class='btn btn-primary' id="addUserLabel">Add User</button>
        </div>
        <div id="incorrectInput"></div>
        `;

      }

    })
    .catch(function (error) {
      console.log(error);
    })


  fetch("/user-dashboard")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var dashboardData;
      dashboardData = data;
      console.log(dashboardData);

      if (userData[0].isAdmin) {
        //Creating table
        var dashboard = "";
        let table = "<br/><br/><table class='table table-light table-striped' id='userTable'><tr><th scope='col'>Username</th><th scope='col'>Password</th><th scope='col'>Avatar</th><th scope ='col'></th></tr>"

        // For loops that appends to the table the users username, password and their avatar
        for (let i = 0; i < dashboardData.length; i++) {
          table += "</td><td>" + dashboardData[i].username +
            "</td><td>" + "●●●●●●●●" +
            "</td><td><img src='./img/" + dashboardData[i].avatarPath + "' width ='50%', height ='50%'>" +
            "</td><td><button type ='submit' onclick='deleteClicked(this.name)' name='" + dashboardData[i].id + "'>Delete</button></td></tr>"
        }
        table += "</table>";
        dashboard += table;

        document.getElementById("dashboard").innerHTML = dashboard;
        addUserButtonListener();

      }

    })
    .catch(function (error) {
      location.reload();
      console.log(error);
    })

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
      console.log("Response object", resObject);
      let parsedData = await resObject.json();
      console.log("From the server", parsedData);
    } catch (error) {
      console.log(error);
    }
  }


  document.getElementById("editUserInfo").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("personalInfoFields").disabled = false;
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
    document.getElementById("status").innerHTML = "Profile Updated";
  })



});


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

// Checks to see if the element exists (only exists for admin users) then adds a listener
function addUserButtonListener(){
  if (document.getElementById("addUserButton")){
    document.getElementById("addUserButton").addEventListener("click", function (e) {
      if (document.getElementById("addUsername").value == '' || document.getElementById("addPassword").value == ''
      || document.getElementById("addFirst").value == '' || document.getElementById("addLast").value == ''){
        document.getElementById("incorrectInput").innerHTML = "All fields required";
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


// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}

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
  } catch (error) {
    console.log(error);
  }
}

function deleteClicked(name){
  postDeleteUser({
    id: name,
    user: document.getElementById('usernameInput').value
  });
  location.reload();
}



// function editUserInfo() {
//   document.getElementById("personalInfoFields").disabled = false;
//   console.log(1);
// }