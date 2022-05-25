//-----------------------------------------------------------------------------------
// This function is called when the kitchen orders page first loads. It requests orders
// data from the BBY_28_shoppingcart table and populate as a table.
//-----------------------------------------------------------------------------------
"use strict";
ready(async function () {
  var url = document.URL;

  // Fetches the customer, recipe and quantity of all the user's orders from the database.
  fetch("/displayKitchenOrders")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Displays the order data in a table.
      let table = "";
      for (let i = 0; i < data.length; i++){
        table += `<tr><td class="name">` + data[i].customer +
        `</td><td class="name">` + data[i].recipe +
        `</td><td>` + data[i].quantity +
        `</tr>`
      }

      // If the user has no orders display a message telling the user to check back later.
      if (table == ""){
        table = `<td colspan='3'>No orders check back later.</td>`
      }
      document.getElementById("orders").innerHTML = table;
    })
    .catch(function (error) {
      console.log(error);
    })

});

//----------------------------------------------------------------------------------------------
// This function checks whether page is loaded.
//-----------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}
