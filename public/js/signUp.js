//-----------------------------------------------------------------------------
// This function is called when the page first loads. It listens to request on user
// sign up and it will then post the sign up form data to the server.
//-----------------------------------------------------------------------------
"use strict";
ready(function () {

  function ajaxPOST(url, callbackFunc, data) {

    let paramsData = typeof data == 'string' ? data : Object.keys(data).map(
      function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
      }
    ).join('&');

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callbackFunc(this.responseText);

      } else {
        console.log(this.status);
      }
    }
    xmlHttp.open("POST", url);
    xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.send(paramsData);
  }

  // Takes the form entry information and post to the server
  document.getElementById("createAccountButtonLabel").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.getElementById("inputUsername");
    let password = document.getElementById("inputPassword");
    let firstName = document.getElementById("inputFName");
    let lastName = document.getElementById("inputLName");

    if (username.value == "" || password.value == "" || firstName.value == "" || lastName == "") {
      document.getElementById("invalidUser").innerHTML = "Please enter the required info";

    } else {
      window.location.replace("/login");
      let queryStr = "username=" + username.value + "&password=" + password.value +
        "&firstName=" + firstName.value + "&lastName=" + lastName.value;

      ajaxPOST("/signing-up", function (data) {
        if (data) {
          let parsedData = JSON.parse(data);
          if (parsedData.status == "fail") {
            console.log("Error");
          } else {
            window.location.href("/login");
          }
        }
      }, queryStr);

    }

  });

});

// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}