//----------------------------------------------------------------------------------
// This function is called when the private kitchen registration page first loads. 
// It posts the registration form data to the server.
//----------------------------------------------------------------------------------
"use strict";
ready(function () {

  async function postData(data) {
    try {
      let resObject = await fetch("/register-kitchen", {
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

  document.getElementById("next").addEventListener("click", function (e) {
    postData({
      name: document.getElementById("input-kitchen-name").value,
      street: document.getElementById("input-street").value,
      city: document.getElementById("input-city").value,
      postalCode: document.getElementById("input-postal-code").value
    });
  });

  postData({
    kitchenName: "Test",
    address: "10025 174 St Surrey BC"
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