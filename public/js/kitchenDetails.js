//-----------------------------------------------------------------------------------
// This function is called when the profile page first loads. It gets the user data 
// and populate on the profile card.  It displays the user list dashboard if it logged
// in as an admin user.  It also listens to post request to send updated profile data
// or dashboard updates to the server and save to the database.
//-----------------------------------------------------------------------------------
"use strict";
ready(async function () {
  var url = document.URL;
  console.log(url);

  var id = url.substring(url.lastIndexOf('=') + 1);
  console.log(id);

  fetch("/kitchen-details?id=" + id)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

    })
    .catch(function (error) {
      console.log(error);
    })


  // await fetch("/user-dashboard")
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     var dashboardData;
  //     dashboardData = data;

  //     if (userData[0].isAdmin) {
  //       //Creating table
  //       var dashboard = "";
  //       let table = "<br/><br/><div id='incorrectDelete'> </div><br/><br/><div><table class='table table-light table-striped' id='userTable'><tr id='userTableHeader'><th scope='col'>Username</th><th scope='col'>Password</th><th scope='col'>Avatar</th><th scope ='col'></th></tr>"

  //       // For loops that appends to the table the users username, password and their avatar
  //       for (let i = 0; i < dashboardData.length; i++) {
  //         table += "</td><td><input type='text' value='" + dashboardData[i].username + "'id='inputUsernameID" + dashboardData[i].id + "'  disabled style='max-width: 50%'>" +
  //           "</td><td><input type='text' value='" + "●●●●●●●●" + "'id='inputPasswordID" + dashboardData[i].id + "' disabled style='max-width: 50%'>" +
  //           "</td><td><img src='./img/" + dashboardData[i].avatarPath + "' width ='100px', height ='100px'>" +
  //           "</td><td><button type='button' class='btn btn-outline-info' onclick='deleteClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Delete</a><br>" +
  //           "<button type='button' class='btn btn-outline-info' onclick='editClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Edit</a><br>" + 
  //           "<button type='button' class='btn btn-outline-info' onclick='saveClicked(this.name)' name='" + dashboardData[i].id + "' style='max-width: 70px'>Save</a></td>" +
  //           "</tr>"
  //       }
  //       table += "</table></div>";
  //       dashboard += table;

  //       document.getElementById("dashboard").innerHTML = dashboard;
  //       addUserButtonListener();

  //     }

  //   })
  //   .catch(function (error) {
  //     location.reload();
  //   })

  // async function postData(data) {
  //   try {
  //     let resObject = await fetch("/update-profile", {
  //       method: 'POST',
  //       headers: {
  //         "Accept": 'application/json',
  //         "Content-Type": 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });
  //     let parsedData = await resObject.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

});




// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}

