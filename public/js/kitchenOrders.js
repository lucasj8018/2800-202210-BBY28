//-----------------------------------------------------------------------------------
// This function is called when the kitchen orders page first loads. It requests orders
// data from the BBY_28_shoppingcart table and populate as a table.
//-----------------------------------------------------------------------------------
"use strict";
ready(async function () {
  var url = document.URL;

  fetch("/displayKitchenOrders")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let table = "";
      for (let i = 0; i < data.length; i++){
        table += `<tr><td class="name">` + data[i].customer +
        `</td><td class="name">` + data[i].recipe +
        `</td><td>` + data[i].quantity +
        // `<td><button type="button" class="btn btn-outline-info done">Done</button></td>` +
        `</tr>`
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
