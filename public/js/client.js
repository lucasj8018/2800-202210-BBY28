//-----------------------------------------------------------------------------
// This function is called when the page first loads. It listens to request on user
// login and it will then post the login form data to the server.
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

  // Takes the login form input data and post to the server
  document.getElementById("loginButtonLabel").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.getElementById("inputUsername");
    let password = document.getElementById("inputPassword");
    let queryString = "username=" + username.value + "&password=" + password.value;

    ajaxPOST("/login", function (data) {

      if (data) {
        let parsedData = JSON.parse(data);

        if (parsedData.status == "fail") {
          document.getElementById("invalidUser").innerHTML = parsedData.msg;
        } else if (username.value == "" || password.value == "") {
          document.getElementById("invalidUser").innerHTML = "Please enter information in all fields";
        } else {
          window.location.replace("/profile");
        }
      }
    }, queryString);
  });

});

//--------------------------------------------------------------------------------------------
// This function is called to check whether the page is laoded.
//--------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}