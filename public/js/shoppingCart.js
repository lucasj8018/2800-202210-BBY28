"use strict";
ready(async function () {

  fetch("/displayShoppingCart")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data[0].recipePath == "EmptyShoppingCart"){
      // If the shopping cart is empty it will prompt the user to go to the map to add items.
      document.getElementById("shoppingCart").innerHTML = "<h1>Shopping Cart is Empty.</h1><h2><a href='/map'>Head to the map to add some items!</a></h2>";

    } else {
      // Populates shopping cart table with items the user has added
      let shoppingCartTable = "<h1>Your Order</h1><table id='cartTable' class='table table-light table-striped'>";
      shoppingCartTable += "<tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th></tr>";
      for (let i = 0; i < data.length; i++){
        shoppingCartTable += "<tr>" +
        "<td><img src='./img/" + data[i].recipePath + "' width='100' height='100' alt='cartImg'></td>" +
        "<td>" + data[i].name + "</td>" +
        "<td>$" + data[i].price + "</td>" +
        "<td>" + data[i].quantity + "</td>" +
        "</tr>"
      }
      shoppingCartTable += "</table>";

      document.getElementById("shoppingCart").innerHTML = shoppingCartTable;
    }


  })
  .catch (function (error){
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