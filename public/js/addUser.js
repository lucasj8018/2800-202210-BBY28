//----------------------------------------------------------------------------------
// This function is called when the profile first loads. 
// It posts the add user form data to the server.
//----------------------------------------------------------------------------------
"use strict";
ready(function () {

  async function postData(data) {
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
  if (document.getElementById("addUserButton")){
    document.getElementById("addUserButton").addEventListener("click", function (e) {
      if (document.getElementById("addUsername").value == '' || document.getElementById("addPassword").value == ''
      || document.getElementById("addFirst").value == '' || document.getElementById("addLast").value == ''){
        document.getElementById("incorrectInput").innerHTML = "All fields required";
      } else {
        postData({
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



});

// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}