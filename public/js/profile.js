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
      document.getElementById("passwordInput").value = userData[0].password;

      if (userData[0].isAdmin) {
        document.getElementById("title").innerHTML = "Admin User Profile";
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
            "</td><td>" + dashboardData[i].password +
            "</td><td><img src='./img/" + dashboardData[i].avatarPath + "' width ='50%', height ='50%'>" +
            "</td><td><button type ='submit' name='" + dashboardData[i].id + "'>Delete</button></td></tr>"
        }
        table += "</table>";
        dashboard += table;

        document.getElementById("dashboard").innerHTML = dashboard;
      }

    })
    .catch(function (error) {
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

// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}



// function editUserInfo() {
//   document.getElementById("personalInfoFields").disabled = false;
//   console.log(1);
// }