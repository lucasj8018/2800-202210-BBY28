//-----------------------------------------------------------------------------
// This function is called when the page first loads. It listens to request on user
// login and it will then post the login form entry information to the server.
//-----------------------------------------------------------------------------
ready(function () {

  console.log("Client script loaded.");

  // This function makes two calls to the server to request a html table and json data
  function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //console.log('responseText:' + xhr.responseText);
        callback(this.responseText);

      } else {
        console.log(this.status);
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

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
  document.getElementById("loginButton").addEventListener("click", function (e) {
    console.log(1);
    e.preventDefault();
    let email = document.getElementById("inputEmail");
    let password = document.getElementById("inputPassword");
    let queryString = "email=" + email.value + "&password=" + password.value;
    console.log("data that we will send", email.value, password.value);
    const vars = {
      "email": email,
      "password": password
    }
    ajaxPOST("/logining", function (data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        console.log(dataParsed);
        if (dataParsed.status == "fail") {
          document.getElementById("errorMsg").innerHTML = dataParsed.msg;
        } else {
          window.location.replace("/profile");
        }
      }
      //document.getElementById("errorMsg").innerHTML = dataParsed.msg;

    }, queryString);
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