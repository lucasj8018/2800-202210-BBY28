//----------------------------------------------------------------------------------
// This function is called when the private kitchen registration page first loads. 
// It posts the registration form data to the server.
//----------------------------------------------------------------------------------
"use strict";
ready(function () {

  var isRegistered;

  fetch("/check-kitchen-registration")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      isRegistered = data[0].isPrivateKitchenOwner;

    })
    .catch(function (error) {
      console.log(error);
    })


  document.getElementById("next").addEventListener("click", function (e) {

    var kitchenName = document.getElementById("input-kitchen-name").value;
    var kitchenStreet = document.getElementById("input-street").value;
    var kitchenCity = document.getElementById("input-city").value;
    var kitchenPostalCode = document.getElementById("input-postal-code").value;
    
    if (kitchenName == "" || kitchenStreet == "" || kitchenCity == "" || kitchenPostalCode == "") {
      document.getElementById("status-message").innerHTML = "All input fields are required";

    } else {
      if (isRegistered) {
        document.getElementById("status-message").innerHTML = "You have a registered address.  Please confirm to update the address";
        let confirmButton = document.createElement('a');
        confirmButton.innerText = "Confirm";
        confirmButton.className = 'btn btn-success';
        confirmButton.id = "confirm";
        confirmButton.href = "/kitchenDetails?id=loggedinUser";
        confirmButton.onclick = function() {
          postData({
            name: kitchenName,
            street: kitchenStreet,
            city: kitchenCity,
            postalCode: kitchenPostalCode
          });
        }
        document.getElementById("confirm-cancel").appendChild(confirmButton);
  
        let cancelButton = document.createElement('button');
        cancelButton.innerText = "Cancel";
        cancelButton.className = 'btn btn-danger'
        cancelButton.onclick = function () {
          location.reload();
        }
        document.getElementById("confirm-cancel").appendChild(cancelButton);
  
      } else {
        document.getElementById("status-message").innerHTML = "Please confirm to register your address";
        let confirmButton = document.createElement('a');
        confirmButton.innerText = "Confirm";
        confirmButton.className = 'btn btn-success';
        confirmButton.id = "confirm";
        confirmButton.href = "/kitchenDetails?id=loggedinUser";
        confirmButton.onclick = function() {
          postData({
            name: kitchenName,
            street: kitchenStreet,
            city: kitchenCity,
            postalCode: kitchenPostalCode
          });
        }
        document.getElementById("confirm-cancel").appendChild(confirmButton);
  
        let cancelButton = document.createElement('button');
        cancelButton.innerText = "Cancel";
        cancelButton.className = 'btn btn-danger'
        cancelButton.onclick = function () {
          location.reload();
        }
        document.getElementById("confirm-cancel").appendChild(cancelButton);
      }
    }
  });

});

//-----------------------------------------------------------------------------------
// This function sends a post request to update the kitchen name and location field 
// of a user in the BBY_28_User table. It is called when the logged in user clicks the 
// next button on the kitchen registration form.
//-----------------------------------------------------------------------------------
async function postData(data) {
  try {
    let resObject = await fetch("/register-kitchen", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    })
    let parsedData = await resObject.json();
  } catch (error) {
    console.log(error);
  }
}

//-------------------------------------------------------------------------------------------
// This function is called to check whether the page is laoded.
//-------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}