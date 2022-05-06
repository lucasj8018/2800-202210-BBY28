//-----------------------------------------------------------------------------
// This function is called when the page first loads. It listens to request on user
// login and it will then post the login form entry information to the server.
//-----------------------------------------------------------------------------
ready(function () {

  console.log("signUp.js loaded.");

  function ajaxPOST(url, callback, data) {

    let params = typeof data == 'string' ? data : Object.keys(data).map(
      function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
      }
    ).join('&');
    console.log("params in ajaxPOST", params);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //console.log('responseText:' + xhr.responseText);
        callback(this.responseText);

      } else {
        console.log(this.status);
      }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }

  // Takes the form entry information and post to the server
  document.getElementById("createAccountButtonLabel").addEventListener("click", function (e) {
    console.log(1);
    e.preventDefault();
    let username = document.getElementById("inputUsername");
    let password = document.getElementById("inputPassword");
    let firstName = document.getElementById("inputFName");
    let lastName = document.getElementById("inputLName");

    if (username.value == "" || password.value == "" || firstName.value == "" || lastName == "") {
      document.getElementById("invalidUser").innerHTML = "Please enter the required info";

    } else {
      let queryString = "username=" + username.value + "&password=" + password.value 
      + "&firstName=" + firstName.value + "&lastName=" + lastName.value;
    console.log("data that we will send", username.value, password.value, firstName.value, lastName.value);
    const vars = {
      "username": username,
      "password": password
    }
    ajaxPOST("/signing-up", function (data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        console.log(dataParsed);
        if (dataParsed.status == "fail") {
          console.log("Error");
        } else {
          window.location.replace("/login");
        }
      }
      //document.getElementById("errorMsg").innerHTML = dataParsed.msg;

    }, queryString);

    }

  });

});

// This function checks whether page is loaded
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener was invoked");
  }
}